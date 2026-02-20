import { render, screen, fireEvent } from "@testing-library/react";
import { LogoutButton } from "./LogoutButton";

const mockLogout = jest.fn();
jest.mock("@/lib/hooks/useLogout", () => ({
  useLogout: () => ({ logout: mockLogout }),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  it("renders default text Log out", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
  });

  it("renders custom children when provided", () => {
    render(<LogoutButton>Sign out</LogoutButton>);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("calls logout when clicked", () => {
    render(<LogoutButton />);
    fireEvent.click(screen.getByRole("button", { name: /log out/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("applies custom className when provided", () => {
    render(<LogoutButton className="custom-class" />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("custom-class");
  });
});
