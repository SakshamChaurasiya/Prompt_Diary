import { render, screen } from '@testing-library/react';
import UserProfile from '../UserProfile';
import { useAuth } from '@/lib/AuthContext';
import type { User, Session } from '@supabase/supabase-js';

// Mock the AuthContext
jest.mock('@/lib/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('UserProfile Component', () => {
  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    user_metadata: {
      username: 'testuser',
      avatar_url: 'https://example.com/avatar.jpg',
    },
    app_metadata: {
      provider: 'google',
      providers: ['google'],
    },
  } as User;

  const mockSession: Session = {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
    refresh_token: 'refresh-token-here',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser,
  } as Session;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading state when auth is initializing', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        session: null,
        loading: true,
      });

      render(<UserProfile />);

      expect(screen.getByText(/loading user profile/i)).toBeInTheDocument();
    });
  });

  describe('Unauthenticated State', () => {
    it('should display login prompt when user is not authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        session: null,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText(/please log in to view your profile/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /go to login/i })).toBeInTheDocument();
    });

    it('should have correct link to login page', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        session: null,
        loading: false,
      });

      render(<UserProfile />);

      const loginLink = screen.getByRole('link', { name: /go to login/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Authenticated State - User Profile Display', () => {
    it('should display user email', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getAllByText('test@example.com')).toHaveLength(2); // Appears in header and details
    });

    it('should display username from user metadata', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getAllByText('testuser')).toHaveLength(2); // Appears in header and details
    });

    it('should display user ID', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('123e4567-e89b-12d3-a456-426614174000')).toBeInTheDocument();
    });

    it('should display avatar image when avatar_url is available', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      const avatar = screen.getByAltText('User avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should display avatar placeholder when avatar_url is not available', () => {
      const userWithoutAvatar = {
        ...mockUser,
        user_metadata: {
          username: 'testuser',
        },
      } as User;

      (useAuth as jest.Mock).mockReturnValue({
        user: userWithoutAvatar,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      // Avatar placeholder should show first letter of username
      const avatarPlaceholder = screen.getByText('T');
      expect(avatarPlaceholder).toBeInTheDocument();
    });

    it('should display "Not set" when username is not available', () => {
      const userWithoutUsername = {
        ...mockUser,
        user_metadata: {},
      } as User;

      (useAuth as jest.Mock).mockReturnValue({
        user: userWithoutUsername,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      // "Not set" appears twice: in header and in username field
      expect(screen.getAllByText('Not set')).toHaveLength(2);
    });

    it('should display avatar URL when available', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('https://example.com/avatar.jpg')).toBeInTheDocument();
    });
  });

  describe('Authentication Provider Display', () => {
    it('should display Google provider', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('Google')).toBeInTheDocument();
    });

    it('should display GitHub provider', () => {
      const githubUser = {
        ...mockUser,
        app_metadata: {
          provider: 'github',
          providers: ['github'],
        },
      } as User;

      (useAuth as jest.Mock).mockReturnValue({
        user: githubUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    it('should display Email/Password provider', () => {
      const emailUser = {
        ...mockUser,
        app_metadata: {
          provider: 'email',
          providers: ['email'],
        },
      } as User;

      (useAuth as jest.Mock).mockReturnValue({
        user: emailUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('Email/Password')).toBeInTheDocument();
    });

    it('should display multiple providers when user has linked accounts', () => {
      const multiProviderUser = {
        ...mockUser,
        app_metadata: {
          provider: 'google',
          providers: ['google', 'github'],
        },
      } as User;

      (useAuth as jest.Mock).mockReturnValue({
        user: multiProviderUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });
  });

  describe('Session Information Display', () => {
    it('should display access token preview', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      // Should show first 40 characters of token followed by "..."
      expect(screen.getByText(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJ\.\.\./)).toBeInTheDocument();
    });

    it('should display token type', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('bearer')).toBeInTheDocument();
    });

    it('should display token expiration time', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('3600 seconds')).toBeInTheDocument();
    });

    it('should display "Not available" when session is missing', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: null,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText('Not available')).toBeInTheDocument();
    });

    it('should display "N/A" for missing token type', () => {
      const sessionWithoutTokenType = {
        ...mockSession,
        token_type: undefined,
        expires_in: undefined,
      } as Session;

      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: sessionWithoutTokenType,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getAllByText('N/A')).toHaveLength(2); // Token type and expires_in
    });
  });

  describe('Usage Example', () => {
    it('should display usage example code', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getByText(/💡 Usage Example/i)).toBeInTheDocument();
      expect(screen.getByText(/import { useAuth } from "@\/lib\/AuthContext"/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing email gracefully', () => {
      const userWithoutEmail = {
        ...mockUser,
        email: undefined,
      } as User;

      (useAuth as jest.Mock).mockReturnValue({
        user: userWithoutEmail,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getAllByText('No email available')).toHaveLength(2);
    });

    it('should handle missing app_metadata gracefully', () => {
      const userWithoutAppMetadata = {
        ...mockUser,
        app_metadata: undefined,
      } as User;

      (useAuth as jest.Mock).mockReturnValue({
        user: userWithoutAppMetadata,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      // Should default to 'email' provider
      expect(screen.getByText('Email/Password')).toBeInTheDocument();
    });

    it('should use display_name when username is not available', () => {
      const userWithDisplayName = {
        ...mockUser,
        user_metadata: {
          display_name: 'Test Display Name',
        },
      } as User;

      (useAuth as jest.Mock).mockReturnValue({
        user: userWithDisplayName,
        session: mockSession,
        loading: false,
      });

      render(<UserProfile />);

      expect(screen.getAllByText('Test Display Name')).toHaveLength(2);
    });
  });
});
