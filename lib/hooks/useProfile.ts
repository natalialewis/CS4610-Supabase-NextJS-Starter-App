"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  updated_at: string;
  created_at: string;
};

/**
 * Fetches the current user's profile from the profiles table.
 * Requires an authenticated user (use with useAuth).
 */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createSupabaseClient();
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setLoading(false);
    if (fetchError) {
      setError(fetchError.message);
      setProfile(null);
      return;
    }
    setProfile(data as Profile);
  }, [user?.id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { profile, loading, error, refetch };
}
