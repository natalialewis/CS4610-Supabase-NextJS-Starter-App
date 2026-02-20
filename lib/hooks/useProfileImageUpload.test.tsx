import { renderHook, act } from "@testing-library/react";
import { useProfileImageUpload } from "./useProfileImageUpload";

const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock("./useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" } }),
}));

jest.mock("@/lib/resizeImage", () => ({
  resizeImage: (f: File) =>
    Promise.resolve(new File(["resized"], f.name, { type: f.type })),
}));

const mockUpload = jest.fn();
const mockList = jest.fn();
const mockRemove = jest.fn();

jest.mock("@/lib/supabase/client", () => ({
  createSupabaseClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: () => ({ data: { publicUrl: "https://example.com/avatar.jpg" } }),
        list: mockList,
        remove: mockRemove,
      }),
    },
    from: () => ({
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  }),
}));

describe("useProfileImageUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpload.mockResolvedValue({ error: null });
    mockList.mockResolvedValue([]);
    mockRemove.mockResolvedValue({ error: null });
  });

  it("returns upload, deleteAvatar, uploading, deleting, error, uploadedUrl", () => {
    const { result } = renderHook(() => useProfileImageUpload());
    expect(result.current.upload).toBeDefined();
    expect(result.current.deleteAvatar).toBeDefined();
    expect(result.current.uploading).toBe(false);
    expect(result.current.deleting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.uploadedUrl).toBeNull();
  });

  it("sets error for disallowed file type", async () => {
    const { result } = renderHook(() => useProfileImageUpload());
    const file = new File(["x"], "bad.pdf", { type: "application/pdf" });

    await act(async () => {
      await result.current.upload(file);
    });

    expect(result.current.error).toBe(
      "File type not allowed. Please upload a JPEG, PNG, WebP, GIF, or SVG."
    );
    expect(result.current.uploading).toBe(false);
  });

});
