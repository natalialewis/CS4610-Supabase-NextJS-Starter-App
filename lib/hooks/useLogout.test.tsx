import { renderHook, act } from "@testing-library/react";
import { useLogout } from "./useLogout";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockSignOut = jest.fn();
jest.mock("@/lib/supabase/client", () => ({
  createSupabaseClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}));

describe("useLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockResolvedValue(undefined);
  });

  it("returns logout function", () => {
    const { result } = renderHook(() => useLogout());
    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe("function");
  });

  it("calls signOut and redirects to login", async () => {
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
