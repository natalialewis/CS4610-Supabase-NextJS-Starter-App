import Link from "next/link";

// Placeholder for authentication status
const user = false;

export default function HomePage() {
  return (
    <div className="min-h-full bg-background px-4 py-12">
      <main className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome!
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          This is your Next.js and Supabase starter app. 
        </p>
        <p className="mt-3 text-lg text-muted-foreground">
          {/* semi-bold 'authentication status' */}
          <span className="font-medium">Authentication status:</span> {user ? "Logged In" : "Not Logged In"}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {user ? (
            <Link
              href="/dashboard"
              className="w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background sm:w-auto"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full rounded-lg border border-border bg-card px-5 py-2.5 text-center text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background sm:w-auto"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="w-full rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background sm:w-auto"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
