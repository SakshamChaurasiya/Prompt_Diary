/**
 * Unit tests for Supabase client configuration
 * 
 * Tests Requirements:
 * - 9.1: Frontend reads Supabase URL and anon key from environment variables
 * - 9.3: Gracefully disable authentication when not configured
 * - 9.5: Validate environment variables are not placeholder values
 */

// Mock the @supabase/ssr module before any imports
const mockCreateBrowserClient = jest.fn();
const mockCreateServerClient = jest.fn();

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: mockCreateBrowserClient,
  createServerClient: mockCreateServerClient,
}));

// Mock Next.js cookies
const mockCookies = jest.fn();
jest.mock('next/headers', () => ({
  cookies: mockCookies,
}));

describe('Supabase Client Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to clear the singleton client
    jest.resetModules();
    // Clear all mocks
    jest.clearAllMocks();
    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('isSupabaseConfigured', () => {
    it('should return false when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const { isSupabaseConfigured } = require('../supabase');
      expect(isSupabaseConfigured).toBe(false);
    });

    it('should return false when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

      const { isSupabaseConfigured } = require('../supabase');
      expect(isSupabaseConfigured).toBe(false);
    });

    it('should return false when NEXT_PUBLIC_SUPABASE_URL is a placeholder', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'your-supabase-project-url';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const { isSupabaseConfigured } = require('../supabase');
      expect(isSupabaseConfigured).toBe(false);
    });

    it('should return false when NEXT_PUBLIC_SUPABASE_ANON_KEY is a placeholder', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'your-supabase-anon-key';

      const { isSupabaseConfigured } = require('../supabase');
      expect(isSupabaseConfigured).toBe(false);
    });

    it('should return true when both environment variables are properly configured', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const { isSupabaseConfigured } = require('../supabase');
      expect(isSupabaseConfigured).toBe(true);
    });
  });

  describe('createClient', () => {
    it('should return null when Supabase is not configured', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

      const { createClient } = require('../supabase');
      const client = createClient();

      expect(client).toBeNull();
      expect(mockCreateBrowserClient).not.toHaveBeenCalled();
    });

    it('should create and return a browser client when configured', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const mockClient = { auth: {}, from: jest.fn() };
      mockCreateBrowserClient.mockReturnValue(mockClient);

      const { createClient } = require('../supabase');
      const client = createClient();

      expect(client).toBe(mockClient);
      expect(mockCreateBrowserClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key'
      );
    });

    it('should return the same client instance on subsequent calls (singleton)', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const mockClient = { auth: {}, from: jest.fn() };
      mockCreateBrowserClient.mockReturnValue(mockClient);

      const { createClient } = require('../supabase');
      const client1 = createClient();
      const client2 = createClient();

      expect(client1).toBe(client2);
      expect(mockCreateBrowserClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('createServerClient', () => {
    it('should return null when Supabase is not configured', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn(),
      };

      const { createServerClient } = require('../supabase');
      const client = createServerClient(mockCookieStore);

      expect(client).toBeNull();
      expect(mockCreateServerClient).not.toHaveBeenCalled();
    });

    it('should create a server client with cookie handling when configured', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([
          { name: 'test-cookie', value: 'test-value' }
        ]),
        set: jest.fn(),
      };

      const mockServerClientInstance = { auth: {}, from: jest.fn() };
      mockCreateServerClient.mockReturnValue(mockServerClientInstance);

      const { createServerClient } = require('../supabase');
      const client = createServerClient(mockCookieStore);

      expect(client).toBe(mockServerClientInstance);
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key',
        expect.objectContaining({
          cookies: expect.objectContaining({
            getAll: expect.any(Function),
            setAll: expect.any(Function),
          }),
        })
      );
    });

    it('should configure getAll to return cookies from cookieStore', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const mockCookies = [
        { name: 'cookie1', value: 'value1' },
        { name: 'cookie2', value: 'value2' }
      ];

      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue(mockCookies),
        set: jest.fn(),
      };

      mockCreateServerClient.mockReturnValue({ auth: {}, from: jest.fn() });

      const { createServerClient } = require('../supabase');
      createServerClient(mockCookieStore);

      // Get the cookies config that was passed to createServerClient
      const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies;
      
      // Test that getAll returns the cookies from the store
      const result = cookiesConfig.getAll();
      expect(result).toEqual(mockCookies);
      expect(mockCookieStore.getAll).toHaveBeenCalled();
    });

    it('should configure setAll to set cookies in cookieStore', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn(),
      };

      mockCreateServerClient.mockReturnValue({ auth: {}, from: jest.fn() });

      const { createServerClient } = require('../supabase');
      createServerClient(mockCookieStore);

      // Get the cookies config that was passed to createServerClient
      const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies;
      
      // Test that setAll calls set on the cookie store
      const cookiesToSet = [
        { name: 'cookie1', value: 'value1', options: {} },
        { name: 'cookie2', value: 'value2', options: { httpOnly: true } }
      ];

      cookiesConfig.setAll(cookiesToSet);

      expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
      expect(mockCookieStore.set).toHaveBeenCalledWith('cookie1', 'value1', {});
      expect(mockCookieStore.set).toHaveBeenCalledWith('cookie2', 'value2', { httpOnly: true });
    });

    it('should handle errors gracefully when setting cookies fails', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const mockCookieStore = {
        getAll: jest.fn().mockReturnValue([]),
        set: jest.fn().mockImplementation(() => {
          throw new Error('Cannot set cookies in Server Component');
        }),
      };

      mockCreateServerClient.mockReturnValue({ auth: {}, from: jest.fn() });

      const { createServerClient } = require('../supabase');
      createServerClient(mockCookieStore);

      // Get the cookies config that was passed to createServerClient
      const cookiesConfig = mockCreateServerClient.mock.calls[0][2].cookies;
      
      // Test that setAll doesn't throw when cookie setting fails
      const cookiesToSet = [
        { name: 'cookie1', value: 'value1', options: {} }
      ];

      expect(() => cookiesConfig.setAll(cookiesToSet)).not.toThrow();
    });
  });
});
