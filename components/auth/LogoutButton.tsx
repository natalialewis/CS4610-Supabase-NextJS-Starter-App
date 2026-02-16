"use client";

import { useLogout } from "@/lib/hooks/useLogout";

// Props for the LogoutButton component to allow for custom styling and children
type LogoutButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const { logout } = useLogout();

  return (
    <button
      type="button"
      onClick={() => logout()}
      className={
        className ??
        "min-h-[2.75rem] rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background md:py-3 md:text-base"
      }
    >
      {children ?? "Log out"}
    </button>
  );
}
