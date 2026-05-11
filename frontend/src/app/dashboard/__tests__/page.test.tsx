import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardPage from '../page';
import { useAuth } from '@/lib/AuthContext';
import type { User } from '@supabase/supabase-js';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/lib/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('DashboardPage - Route Protection', () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: mockPush,
    });
  });

  describe('Loading State', () => {
    it('should display loading indicator while auth state is initializing', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('should not redirect while loading', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe('Unauthenticated Access', () => {
    it('should redirect to login page if user is not authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(mockReplace).toHaveBeenCalledWith('/login?next=%2Fdashboard');
    });

    it('should preserve current URL as "next" query parameter during redirect', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringContaining('next=%2Fdashboard')
      );
    });

    it('should return null after redirecting to prevent rendering', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        signOut: mockSignOut,
      });

      const { container } = render(<DashboardPage />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Authenticated Access', () => {
    const mockUser: Partial<User> = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: {
        username: 'testuser',
      },
    };

    it('should render dashboard content if user is authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('should display user email', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display username from user metadata', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });

    it('should display display_name if available', () => {
      const userWithDisplayName: Partial<User> = {
        ...mockUser,
        user_metadata: {
          display_name: 'Test User',
        },
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: userWithDisplayName,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(screen.getByText(/test user/i)).toBeInTheDocument();
    });

    it('should fallback to email prefix if no username or display_name', () => {
      const userWithoutMetadata: Partial<User> = {
        id: 'user-123',
        email: 'john@example.com',
        user_metadata: {},
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: userWithoutMetadata,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      // Check that the display name is "john" (from email prefix)
      expect(screen.getByText(/welcome/i).textContent).toContain('john');
    });

    it('should display avatar image if avatar_url is provided', () => {
      const userWithAvatar: Partial<User> = {
        ...mockUser,
        user_metadata: {
          username: 'testuser',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: userWithAvatar,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      const avatar = screen.getByAltText('Avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should display initial letter if no avatar_url', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      const { container } = render(<DashboardPage />);

      // Check for the initial letter 'T' from 'testuser'
      expect(container.textContent).toContain('T');
    });
  });

  describe('Sign Out Functionality', () => {
    const mockUser: Partial<User> = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: {
        username: 'testuser',
      },
    };

    it('should render sign out button', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });

    it('should call signOut when sign out button is clicked', async () => {
      mockSignOut.mockResolvedValue(undefined);
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      fireEvent.click(signOutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('should redirect to home page after sign out', async () => {
      mockSignOut.mockResolvedValue(undefined);
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      fireEvent.click(signOutButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should have id attribute for testing', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      expect(signOutButton).toHaveAttribute('id', 'dashboard-logout');
    });
  });

  describe('Dashboard Content', () => {
    const mockUser: Partial<User> = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: {
        username: 'testuser',
      },
    };

    it('should render all module cards', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      render(<DashboardPage />);

      expect(screen.getByText('Learning Articles')).toBeInTheDocument();
      expect(screen.getByText('Prompt Challenges')).toBeInTheDocument();
      expect(screen.getByText('Prompt Playground')).toBeInTheDocument();
      expect(screen.getByText('Learning Roadmaps')).toBeInTheDocument();
      expect(screen.getByText('System Design')).toBeInTheDocument();
    });

    it('should render module links with correct hrefs', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        loading: false,
        signOut: mockSignOut,
      });

      const { container } = render(<DashboardPage />);

      const links = container.querySelectorAll('a');
      const hrefs = Array.from(links).map(link => link.getAttribute('href'));

      expect(hrefs).toContain('/articles');
      expect(hrefs).toContain('/challenges');
      expect(hrefs).toContain('/playground');
      expect(hrefs).toContain('/roadmaps');
      expect(hrefs).toContain('/system-design');
    });
  });
});
