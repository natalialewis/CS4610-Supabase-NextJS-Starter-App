"use client";

import Link from "next/link";
import { type SubmitEvent, useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useLogin } from "@/lib/hooks/useLogin";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    await login({ email: email.trim(), password });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-6 md:mt-8 md:space-y-5" noValidate>
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-foreground md:text-base">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring md:py-3"
          placeholder="you@example.com"
          required
          aria-required="true"
          aria-invalid={error === "Email is required."}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-foreground md:text-base">
          Password
        </label>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 px-3"
          required
          aria-required="true"
          aria-invalid={error === "Password is required."}
        />
      </div>
      {/* Error display */}
      <div role="alert" aria-live="polite" className="min-h-[1.5rem] text-sm text-destructive">
        {error}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full min-h-[2.75rem] rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 md:min-h-0 md:py-3 md:text-base"
      >
        {isLoading ? "Signing in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-muted-foreground md:text-base">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
