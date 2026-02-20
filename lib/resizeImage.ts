import { resolve } from "path";

const DEFAULT_MAX_SIZE = 512;

export type ResizeOptions = {
    maxWidth?: number;
    maxHeight?: number;
};

export async function resizeImage(file: File, options: ResizeOptions = {}): Promise<File> {
    const maxWidth = options.maxWidth ?? DEFAULT_MAX_SIZE;
    const maxHeight = options.maxHeight ?? DEFAULT_MAX_SIZE;

    const bitmap = await createImageBitmap(file);
    const width = bitmap.width;
    const height = bitmap.height;

    // If the image is already smaller than the max width and height, return the original file
    const scale = Math.min(maxWidth / width, maxHeight / height);
    if (scale >= 1) {
        bitmap.close();
        return file;
    }

    // Calculate the new width and height
    const newWidth = width * scale;
    const newHeight = height * scale;

    // Create a canvas to draw the image on
    const canvas = 
        typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(newWidth, newHeight)
        : Object.assign(document.createElement('canvas'), {
            width: newWidth, height: newHeight 
        } as HTMLCanvasElement);

    // Draw the image on the canvas
    const context = canvas.getContext('2d');
    if (!context) {
        bitmap.close();
        return file;
    }
    (context as CanvasRenderingContext2D).drawImage(bitmap, 0, 0, newWidth, newHeight);
    bitmap.close();

    // Convert the canvas to a blob
    const blob = await new Promise<Blob | null>((resolve) => {
        if ("toBlob" in canvas) {
          (canvas as HTMLCanvasElement).toBlob((b) => resolve(b), "image/jpeg", 0.9);
        } else if ("convertToBlob" in canvas) {
          (canvas as OffscreenCanvas)
            .convertToBlob({ type: "image/jpeg", quality: 0.9 })
            .then(resolve);
        } else {
          resolve(null);
        }
      });

    if (!blob) {
        return file;
    }

    // Create a new file from the blob
    const baseName = file.name.replace(/\.[^.]+$/, "") || "avatar";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

