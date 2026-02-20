import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    localStorage.clear();
  });

  it("renders a button after theme is resolved", async () => {
    render(<ThemeToggle />);
    const btn = await screen.findByRole("button");
    expect(btn).toBeInTheDocument();
  });

  it("has accessible label for theme switch", async () => {
    render(<ThemeToggle />);
    const btn = await screen.findByRole("button");
    expect(btn).toHaveAttribute("aria-label");
    expect(btn.getAttribute("aria-label")).toMatch(/light|dark/i);
  });

  it("toggles theme on click", async () => {
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);
    const btn = await screen.findByRole("button");
    fireEvent.click(btn);
    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("dark");
    });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("light");
    });
  });
});
