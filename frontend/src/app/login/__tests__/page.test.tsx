import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from '../page';
import { createClient } from '@/lib/supabase';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock supabase client
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockSignInWithPassword = jest.fn();
  const mockSignInWithOAuth = jest.fn();
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    // Default: no "next" parameter
    mockSearchParams.get.mockReturnValue(null);
  });

  describe('Email/Password Login', () => {
    it('should render login form with email and password fields', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('should call signInWithPassword with email and password on form submit', async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should redirect to dashboard on successful login', async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should redirect to preserved destination URL after successful login', async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null });
      mockSearchParams.get.mockReturnValue('/challenges');
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/challenges');
      });
    });

    it('should display error message without redirecting on login failure', async () => {
      mockSignInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // The Supabase error object is not an Error instance, so it shows "Login failed"
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });
      
      // Verify no redirect happened
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should show loading state during login operation', async () => {
      mockSignInWithPassword.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Check for loading state
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument();
      });
    });

    it('should handle Supabase not configured error gracefully', async () => {
      (createClient as jest.Mock).mockReturnValue(null);

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/supabase is not configured/i)).toBeInTheDocument();
      });
    });
  });

  describe('OAuth Login', () => {
    it('should render Google and GitHub OAuth buttons', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with github/i })).toBeInTheDocument();
    });

    it('should call signInWithOAuth with Google provider when Google button is clicked', async () => {
      mockSignInWithOAuth.mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockSignInWithOAuth).toHaveBeenCalledWith({
          provider: 'google',
          options: {
            redirectTo: expect.stringContaining('/auth/callback'),
          },
        });
      });
    });

    it('should include next parameter in OAuth redirect when present', async () => {
      mockSignInWithOAuth.mockResolvedValue({ error: null });
      mockSearchParams.get.mockReturnValue('/challenges');
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockSignInWithOAuth).toHaveBeenCalledWith({
          provider: 'google',
          options: {
            redirectTo: expect.stringContaining('/auth/callback?next=%2Fchallenges'),
          },
        });
      });
    });

    it('should call signInWithOAuth with GitHub provider when GitHub button is clicked', async () => {
      mockSignInWithOAuth.mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const githubButton = screen.getByRole('button', { name: /continue with github/i });
      fireEvent.click(githubButton);

      await waitFor(() => {
        expect(mockSignInWithOAuth).toHaveBeenCalledWith({
          provider: 'github',
          options: {
            redirectTo: expect.stringContaining('/auth/callback'),
          },
        });
      });
    });

    it('should display error message when OAuth login fails', async () => {
      const errorMessage = 'Google login failed';
      mockSignInWithOAuth.mockResolvedValue({ error: { message: 'OAuth provider error' } });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        // The component shows "Google login failed" for any Google OAuth error
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should show loading state during OAuth redirect', async () => {
      mockSignInWithOAuth.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      // Check for loading state - both buttons should show "Redirecting..."
      await waitFor(() => {
        expect(googleButton).toHaveTextContent(/redirecting/i);
        expect(googleButton).toBeDisabled();
      });
    });
  });

  describe('Navigation', () => {
    it('should render link to signup page', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignInWithPassword,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<LoginPage />);

      const signupLink = screen.getByRole('link', { name: /sign up/i });
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute('href', '/signup');
    });
  });
});
