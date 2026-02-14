"use client";

import Link from "next/link";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";

// Handles password validation so users are forced to create a strong password
function validatePassword(value: string): boolean {
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;
  if (!/[^A-Za-z0-9]/.test(value)) return false;
  return true;
}

const PASSWORD_ERROR =
  "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!validatePassword(password)) {
      setError(PASSWORD_ERROR);
      return;
    }
    // TODO: wire to Supabase sign up
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-6 sm:space-y-4 md:mt-8 md:space-y-5" noValidate>
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-foreground md:text-base">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring md:py-3"
          placeholder="you@example.com"
          required
          aria-required="true"
          aria-invalid={false}
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-foreground md:text-base">
          Password
        </label>
        <PasswordInput
          id="signup-password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 px-3"
          required
          minLength={8}
          aria-required="true"
          aria-invalid={!!error}
        />
      </div>
      <div role="alert" aria-live="polite" className="min-h-[1.5rem] text-sm text-destructive">
        {error}
      </div>
      <button
        type="submit"
        className="w-full min-h-[2.75rem] rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 md:min-h-0 md:py-3 md:text-base"
      >
        Sign up
      </button>
      <p className="text-center text-sm text-muted-foreground md:text-base">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
