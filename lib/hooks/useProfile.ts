"use client";

import { useProfileContext } from "@/lib/contexts/ProfileContext";

export type { Profile } from "@/lib/contexts/ProfileContext";

/**
 * Fetches the current user's profile from the profiles table (shared across the app).
 * Requires ProfileProvider in the tree and an authenticated user (use with useAuth).
 */
export function useProfile() {
  return useProfileContext();
}
