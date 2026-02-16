import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Get the currently authenticated user on the server (Server Components, route handlers, server actions).
 * Returns null if not authenticated.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseClient();
  const {data: { user }} = await supabase.auth.getUser();

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    redirect("/login");
  }

  return user;
}
