/**
 * Unit tests for Auth Context - User Profile Access
 * 
 * Tests Requirements:
 * - 10.1: Auth_Context provides access to user object with metadata
 * - 10.2: User object includes email, user ID, and authentication provider
 * - 10.3: User object includes username from user_metadata if present
 * - 10.4: User object includes OAuth provider metadata (avatar_url) if present
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import * as supabaseModule from '../supabase';
import type { User, Session } from '@supabase/supabase-js';

// Mock the supabase module
jest.mock('../supabase');

// Test component that displays user profile data
function UserProfileTestComponent() {
  const { user } = useAuth();
  
  if (!user) {
    return <div data-testid="no-user">No user</div>;
  }
  
  return (
    <div>
      <div data-testid="user-id">{user.id}</div>
      <div data-testid="user-email">{user.email}</div>
      <div data-testid="auth-provider">{user.app_metadata?.provider || 'unknown'}</div>
      <div data-testid="username">{user.user_metadata?.username || 'no-username'}</div>
      <div data-testid="avatar-url">{user.user_metadata?.avatar_url || 'no-avatar'}</div>
    </div>
  );
}

describe('AuthContext - User Profile Access', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabaseClient = {
      auth: {
        getSession: jest.fn(),
        onAuthStateChange: jest.fn(() => ({
          data: {
            subscription: {
              unsubscribe: jest.fn(),
            },
          },
        })),
        signOut: jest.fn(),
      },
    };

    (supabaseModule as any).isSupabaseConfigured = true;
    (supabaseModule.createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it('should provide user object with email, user ID, and authentication provider (Requirement 10.1, 10.2)', async () => {
    const mockUser: User = {
      id: 'test-user-123',
      email: 'testuser@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      app_metadata: {
        provider: 'email',
        providers: ['email'],
      },
      user_metadata: {},
    };

    const mockSession: Session = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfileTestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-123');
      expect(screen.getByTestId('user-email')).toHaveTextContent('testuser@example.com');
      expect(screen.getByTestId('auth-provider')).toHaveTextContent('email');
    });
  });

  it('should provide username from user_metadata when present (Requirement 10.3)', async () => {
    const mockUser: User = {
      id: 'test-user-456',
      email: 'john@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      app_metadata: {
        provider: 'email',
        providers: ['email'],
      },
      user_metadata: {
        username: 'johndoe',
      },
    };

    const mockSession: Session = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfileTestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('johndoe');
    });
  });

  it('should handle missing username gracefully', async () => {
    const mockUser: User = {
      id: 'test-user-789',
      email: 'noname@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      app_metadata: {
        provider: 'email',
        providers: ['email'],
      },
      user_metadata: {},
    };

    const mockSession: Session = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfileTestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('no-username');
    });
  });

  it('should provide OAuth provider metadata including avatar_url (Requirement 10.4)', async () => {
    const mockUser: User = {
      id: 'oauth-user-123',
      email: 'oauth@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      app_metadata: {
        provider: 'google',
        providers: ['google'],
      },
      user_metadata: {
        avatar_url: 'https://example.com/avatar.jpg',
        full_name: 'OAuth User',
      },
    };

    const mockSession: Session = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfileTestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-provider')).toHaveTextContent('google');
      expect(screen.getByTestId('avatar-url')).toHaveTextContent('https://example.com/avatar.jpg');
    });
  });

  it('should provide GitHub OAuth metadata', async () => {
    const mockUser: User = {
      id: 'github-user-456',
      email: 'github@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      app_metadata: {
        provider: 'github',
        providers: ['github'],
      },
      user_metadata: {
        avatar_url: 'https://github.com/avatar.png',
        user_name: 'githubuser',
      },
    };

    const mockSession: Session = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfileTestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-provider')).toHaveTextContent('github');
      expect(screen.getByTestId('avatar-url')).toHaveTextContent('https://github.com/avatar.png');
    });
  });

  it('should handle OAuth user without avatar_url', async () => {
    const mockUser: User = {
      id: 'oauth-no-avatar',
      email: 'noavatar@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      app_metadata: {
        provider: 'google',
        providers: ['google'],
      },
      user_metadata: {
        full_name: 'No Avatar User',
      },
    };

    const mockSession: Session = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    };

    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    render(
      <AuthProvider>
        <UserProfileTestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('avatar-url')).toHaveTextContent('no-avatar');
    });
  });
});
