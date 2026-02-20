import { render, screen } from "@testing-library/react";
import { AuthNav } from "./AuthNav";

jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));
jest.mock("@/lib/hooks/useProfile", () => ({
  useProfile: () => ({ profile: null }),
}));
jest.mock("@/lib/hooks/useLogout", () => ({
  useLogout: () => ({ logout: jest.fn() }),
}));

describe("AuthNav", () => {
  it("renders login and sign up links when not authenticated", () => {
    render(<AuthNav />);
    expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/signup");
  });

  it("renders nav with aria-label", () => {
    render(<AuthNav />);
    expect(screen.getByRole("navigation", { name: /authentication/i })).toBeInTheDocument();
  });
});

