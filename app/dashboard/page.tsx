import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  // See if the user is authenticated and use their first name
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-full bg-background px-4 py-8 sm:py-10 md:py-12">
      <main className="mx-auto w-full max-w-2xl">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
          Welcome to the dashboard, {user?.user_metadata?.first_name ?? "User"}!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
          This is a protected page, accessible only to logged-in users.
        </p>
        <div className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
          <p>Because you are logged in, your information is accessible:</p>
          <ul className="list-disc list-inside mt-2">
            <li><span className="font-bold">Email:</span> {user?.email}</li>
            <li><span className="font-bold">First Name:</span> {user?.user_metadata?.first_name}</li>
            <li><span className="font-bold">Last Name:</span> {user?.user_metadata?.last_name}</li>
          </ul>
        </div>
        <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
          You can navigate to your profile or sign out by clicking the profile icon in the top-right corner.
          For convenience, these links are also available here.
        </p>
        <nav className="mt-5 flex flex-wrap gap-3 sm:mt-6 sm:gap-4" aria-label="Dashboard links">
          <Link
            href="/profile"
            className="min-h-[2.75rem] rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background md:py-3 md:text-base"
          >
            Profile
          </Link>
          <Link
            href="/"
            className="min-h-[2.75rem] rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background md:py-3 md:text-base"
          >
            Home
          </Link>
          <LogoutButton />
        </nav>
      </main>
    </div>
  );
}
