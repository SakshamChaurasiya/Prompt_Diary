import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignupPage from '../page';
import { createClient } from '@/lib/supabase';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(),
}));

describe('SignupPage', () => {
  const mockPush = jest.fn();
  const mockSignUp = jest.fn();
  const mockSignInWithOAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should render OAuth buttons', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with github/i })).toBeInTheDocument();
    });

    it('should render link to login page', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      const loginLink = screen.getByRole('link', { name: /log in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Form Validation', () => {
    it('should require email field', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should require password field with minimum length', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('minLength', '6');
    });

    it('should display password requirement text', () => {
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      expect(screen.getByText(/minimum 6 characters/i)).toBeInTheDocument();
    });
  });

  describe('Email/Password Signup', () => {
    it('should call signUp with correct parameters including username', async () => {
      mockSignUp.mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          options: {
            data: {
              username: 'testuser',
              display_name: 'testuser',
            },
          },
        });
      });
    });

    it('should display success message after successful signup', async () => {
      mockSignUp.mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/check your email to confirm/i)).toBeInTheDocument();
      });
    });

    it('should display error message on signup failure', async () => {
      const errorMessage = 'Email already registered';
      mockSignUp.mockResolvedValue({ error: new Error(errorMessage) });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should show loading state during signup', async () => {
      mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)));
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      });
    });

    it('should handle Supabase not configured error', async () => {
      (createClient as jest.Mock).mockReturnValue(null);

      render(<SignupPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/supabase is not configured/i)).toBeInTheDocument();
      });
    });
  });

  describe('OAuth Signup', () => {
    it('should initiate Google OAuth flow', async () => {
      mockSignInWithOAuth.mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

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

    it('should initiate GitHub OAuth flow', async () => {
      mockSignInWithOAuth.mockResolvedValue({ error: null });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

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

    it('should display error message on OAuth failure', async () => {
      const errorMessage = 'OAuth provider error';
      mockSignInWithOAuth.mockResolvedValue({ error: new Error(errorMessage) });
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp,
          signInWithOAuth: mockSignInWithOAuth,
        },
      });

      render(<SignupPage />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should handle Supabase not configured for OAuth', async () => {
      (createClient as jest.Mock).mockReturnValue(null);

      render(<SignupPage />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(screen.getByText(/supabase is not configured/i)).toBeInTheDocument();
      });
    });
  });
});
