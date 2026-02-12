import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const supabaseResponse = NextResponse.next({ request });
    const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


    const supabase = createServerClient(supabaseURL,supabaseAnonKey,{
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    supabaseResponse.cookies.set(name, value, options);
                });
            },
        },
    });

    // Get the user's session
    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    // Public routes are '/', '/login', and '/signup'
    const isPublicRoute = 
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/signup";

    // If the user is not on a public route and not authenticated, redirect to '/login'
    if (!isPublicRoute && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return supabaseResponse;
}

// Run on common routes but not on api or static files
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};