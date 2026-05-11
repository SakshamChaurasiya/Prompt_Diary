import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { createClient } from "../supabase";
import type { Session, User } from "@supabase/supabase-js";

// Mock the supabase module
jest.mock("../supabase", () => ({
  createClient: jest.fn(),
  isSupabaseConfigured: true,
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe("AuthContext - Access Token Retrieval", () => {
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    app_metadata: {},
    user_metadata: { username: "testuser" },
    aud: "authenticated",
    created_at: "2024-01-01T00:00:00Z",
  };

  const mockSession: Session = {
    access_token: "mock-jwt-access-token-12345",
    refresh_token: "mock-refresh-token-67890",
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
    token_type: "bearer",
    user: mockUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should provide access to session object with access_token", async () => {
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    };

    mockCreateClient.mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    // Wait for auth to initialize
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify session is available
    expect(result.current.session).not.toBeNull();
    expect(result.current.session).toEqual(mockSession);
  });

  it("should expose access_token from session for API requests", async () => {
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    };

    mockCreateClient.mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify access_token is accessible
    expect(result.current.session?.access_token).toBe("mock-jwt-access-token-12345");
    expect(result.current.session?.token_type).toBe("bearer");
  });

  it("should provide complete session object with all required fields", async () => {
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    };

    mockCreateClient.mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const { session } = result.current;

    // Verify all session fields required for API authentication
    expect(session).toHaveProperty("access_token");
    expect(session).toHaveProperty("refresh_token");
    expect(session).toHaveProperty("expires_in");
    expect(session).toHaveProperty("token_type");
    expect(session).toHaveProperty("user");

    // Verify token format
    expect(typeof session?.access_token).toBe("string");
    expect(session?.access_token.length).toBeGreaterThan(0);
  });

  it("should return null session when user is not authenticated", async () => {
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    };

    mockCreateClient.mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify session is null when not authenticated
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("should update session when auth state changes", async () => {
    let authStateCallback: ((event: string, session: Session | null) => void) | null = null;

    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
        onAuthStateChange: jest.fn().mockImplementation((callback) => {
          authStateCallback = callback;
          return {
            data: { subscription: { unsubscribe: jest.fn() } },
          };
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    };

    mockCreateClient.mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Initially no session
    expect(result.current.session).toBeNull();

    // Simulate user login wrapped in act
    await act(async () => {
      if (authStateCallback) {
        authStateCallback("SIGNED_IN", mockSession);
      }
    });

    await waitFor(() => {
      expect(result.current.session).not.toBeNull();
    });

    // Verify session with access_token is now available
    expect(result.current.session?.access_token).toBe("mock-jwt-access-token-12345");
    expect(result.current.user?.id).toBe("test-user-id");
  });

  it("should clear session and access_token on sign out", async () => {
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
      },
    };

    mockCreateClient.mockReturnValue(mockSupabase as any);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify session exists
    expect(result.current.session?.access_token).toBe("mock-jwt-access-token-12345");

    // Sign out wrapped in act
    await act(async () => {
      await result.current.signOut();
    });

    // Verify session is cleared
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
