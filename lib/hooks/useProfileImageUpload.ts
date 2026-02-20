"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { useState } from "react";
import { resizeImage } from "@/lib/resizeImage";
import { createSupabaseClient } from "@/lib/supabase/client";

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
];

const AVATAR_MAX_SIZE = 512;

export function useProfileImageUpload() {
    const router = useRouter();
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    async function upload(file: File): Promise<void> {
        // If there is no file or user id, return
        if (!file || !user?.id) return;

        // If the file is not an allowed type, return
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("File type not allowed. Please upload a JPEG, PNG, WebP, GIF, or SVG.");
            return;
        }

        setError(null);
        setUploading(true);

        // Resize the image to 512x512 to save on storage space
        const imageToUpload = await resizeImage(file, { maxWidth: AVATAR_MAX_SIZE, maxHeight: AVATAR_MAX_SIZE });

        const supabase = createSupabaseClient();
        const extension = imageToUpload.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${user.id}/avatar.${extension}`;

        // Try to upload the image to Supabase Storage (replace existing if it exists)
        const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, imageToUpload, {upsert: true});

        if (uploadError) {
            setError(uploadError.message);
            setUploading(false);
            return;
        }

        // Get the public URL of the uploaded image
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
        

        // Update the profile with the new avatar URL (add a cachebuster to avoid caching issues)
        const cacheBuster = new Date().getTime();
        const { error: updateError } = await supabase.from("profiles").update({ avatar_url: `${publicUrl}?cachebuster=${cacheBuster}` }).eq("id", user.id);

        if (updateError) {
            setError(updateError.message);
            setUploading(false);
            return;
        }

        const newUrl = `${publicUrl}?cachebuster=${cacheBuster}`;
        setUploadedUrl(newUrl);
        setUploading(false);
        router.refresh();
    }

    return { upload, uploading, error, uploadedUrl };
}