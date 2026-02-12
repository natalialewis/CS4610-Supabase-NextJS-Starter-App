import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient() {
    const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createBrowserClient(supabaseURL, supabaseAnonKey);
}