import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background px-4 py-8 sm:py-10 md:py-12">
      <main className="mx-auto w-full max-w-2xl">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
          Settings options will be added here.
        </p>
        <nav className="mt-5 sm:mt-6">
          <Link
            href="/profile"
            className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded md:text-base"
          >
            ← Back to profile
          </Link>
        </nav>
      </main>
    </div>
  );
}
