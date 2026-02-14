import Link from "next/link";

type AuthPageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthPage({ title, description, children }: AuthPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-background px-4 py-6 sm:py-8 md:py-12">
      <main className="flex w-full max-w-md flex-col items-center sm:max-w-md md:max-w-lg">
        <div className="w-full rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 md:p-8">
          <h1 className="text-center text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground md:text-base">
            {description}
          </p>
          {children}
        </div>
        <p className="mt-5 text-center sm:mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded md:text-base"
          >
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
