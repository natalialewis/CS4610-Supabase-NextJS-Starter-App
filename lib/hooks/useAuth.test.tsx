import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";

const mockGetUser = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock("@/lib/supabase/client", () => ({
  createSupabaseClient: () => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
  });

  it("starts with loading true and user null", () => {
    mockGetUser.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it("sets user and loading false after getUser resolves with user", async () => {
    const mockUser = { id: "user-1", email: "a@b.com" };
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toEqual(mockUser);
  });

  it("sets user null and loading false when getUser resolves with no user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBeNull();
  });
});
