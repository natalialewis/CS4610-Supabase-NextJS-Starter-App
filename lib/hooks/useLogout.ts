"use client";

import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";

export function useLogout() {
  const router = useRouter();

  async function logout() {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    // When the user logs out, they are redirected to the login page
    router.push("/login");
  }

  return { logout };
}