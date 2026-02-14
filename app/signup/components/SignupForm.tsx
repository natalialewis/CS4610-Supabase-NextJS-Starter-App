"use client";

import Link from "next/link";
import { type SubmitEvent, useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useSignUp } from "@/lib/hooks/useSignUp";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const { signUp, isLoading, error: signUpError } = useSignUp();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear any previous validation errors
    setValidationError("");

    // Trim form fields to remove whitespace
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate form fields
    if (!trimmedFirstName) {
      setValidationError("First name is required.");
      return;
    }
    if (!trimmedLastName) {
      setValidationError("Last name is required.");
      return;
    }
    if (!trimmedEmail) {
      setValidationError("Email is required.");
      return;
    }
    if (!validatePassword(trimmedPassword)) {
      setValidationError(PASSWORD_ERROR);
      return;
    }

    // Sign up the user
    await signUp({ email: trimmedEmail, password:trimmedPassword, firstName:trimmedFirstName, lastName:trimmedLastName });
  }

  // Display both validation and sign up errors
  const displayedError = validationError || signUpError || "";

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4 sm:mt-6 sm:space-y-4 md:mt-8 md:space-y-5" noValidate>
      <div>
        <label htmlFor="signup-first-name" className="block text-sm font-medium text-foreground md:text-base">
          First name
        </label>
        <input
          id="signup-first-name"
          type="text"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring md:py-3"
          required
          aria-required="true"
          aria-invalid={validationError === "First name is required."}
        />
      </div>
      <div>
        <label htmlFor="signup-last-name" className="block text-sm font-medium text-foreground md:text-base">
          Last name
        </label>
        <input
          id="signup-last-name"
          type="text"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring md:py-3"
          required
          aria-required="true"
          aria-invalid={validationError === "Last name is required."}
        />
      </div>
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
          aria-invalid={validationError === "Email is required."}
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
          aria-invalid={!!validationError}
        />
      </div>
      {/* Error display */}
      <div role="alert" aria-live="polite" className="min-h-[1.5rem] text-sm text-destructive">
        {displayedError}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full min-h-[2.75rem] rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 md:min-h-0 md:py-3 md:text-base"
      >
        {isLoading ? "Creating account..." : "Sign up"}
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
