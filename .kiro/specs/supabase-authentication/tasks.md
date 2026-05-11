# Implementation Plan: Supabase Authentication

## Overview

This implementation plan breaks down the Supabase authentication feature into discrete coding tasks. The feature integrates Supabase Auth into a Next.js frontend (TypeScript) and FastAPI backend (Python), supporting email/password authentication and OAuth (Google/GitHub).

The implementation follows an incremental approach:
1. Set up core infrastructure and configuration
2. Implement frontend authentication UI and flows
3. Implement backend token validation
4. Add route protection and session management
5. Integrate and test end-to-end flows

Each task builds on previous work, with checkpoints to validate progress before moving forward.

## Tasks

### 1. Backend Configuration and JWT Validation

- [x] 1.1 Update backend configuration for Supabase integration
  - Verify `backend/app/core/config.py` has all required Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
  - Ensure JWT_SECRET and JWT_ALGORITHM are configured for token validation
  - Add validation to ensure environment variables are not placeholder values
  - _Requirements: 9.2, 9.6, 9.7_

- [x] 1.2 Implement Supabase JWT token validation in backend
  - Create `decode_supabase_token()` function in `backend/app/core/security.py`
  - Validate JWT signature using JWT_SECRET from configuration
  - Extract user ID from the `sub` claim in token payload
  - Handle expired tokens and invalid signatures gracefully
  - Return None for invalid tokens, payload dict for valid tokens
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ]* 1.3 Write unit tests for JWT validation
  - Test valid token decoding and user ID extraction
  - Test expired token rejection
  - Test invalid signature rejection
  - Test malformed token handling
  - _Requirements: 5.2, 5.3_

- [x] 1.4 Create authentication dependency for protected routes
  - Implement `get_current_user()` dependency in `backend/app/core/security.py`
  - Extract Authorization header from request
  - Validate token using `decode_supabase_token()`
  - Raise HTTPException(401) if token is missing or invalid
  - Return user ID for valid tokens
  - _Requirements: 5.1, 5.3, 5.6_

- [ ] 1.5 Write unit tests for authentication dependency
  - Test successful authentication with valid token
  - Test 401 response with missing Authorization header
  - Test 401 response with invalid token
  - Test user ID extraction and availability to endpoint
  - _Requirements: 5.1, 5.6_

### 2. Frontend Supabase Client Setup

- [x] 2.1 Implement Supabase browser client configuration
  - Update `frontend/src/lib/supabase.ts` to use `@supabase/ssr` package
  - Read NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from environment
  - Implement `isSupabaseConfigured` check to validate environment variables
  - Validate that environment variables are not placeholder values
  - Create singleton browser client using `createBrowserClient()`
  - Return null if Supabase is not configured
  - _Requirements: 9.1, 9.3, 9.5_

- [x] 2.2 Implement Supabase server client for SSR contexts
  - Add `createServerClient()` function in `frontend/src/lib/supabase.ts`
  - Accept `cookieStore` parameter for server-side cookie access
  - Configure cookie handlers for `getAll()` and `setAll()`
  - Use `@supabase/ssr` package's `createServerClient()` method
  - _Requirements: 4.1, 4.2_

- [ ] 2.3 Write unit tests for Supabase client configuration
  - Test `isSupabaseConfigured` returns false with missing environment variables
  - Test `isSupabaseConfigured` returns false with placeholder values
  - Test `createClient()` returns null when not configured
  - Test `createClient()` returns client instance when configured
  - _Requirements: 9.3, 9.5_

### 3. Frontend Authentication Context

- [x] 3.1 Implement Auth Context provider
  - Update `frontend/src/lib/AuthContext.tsx` to provide authentication state
  - Initialize state variables: user, session, loading, isConfigured
  - Call `supabase.auth.getSession()` on mount to restore session
  - Subscribe to `onAuthStateChange` for real-time auth updates
  - Update user and session state when auth state changes
  - Set loading to false after initialization
  - Handle graceful degradation when Supabase is not configured
  - _Requirements: 4.2, 4.6, 9.3_

- [x] 3.2 Implement signOut method in Auth Context
  - Call `supabase.auth.signOut()` to invalidate session
  - Clear authentication cookies
  - Clear legacy localStorage session if present
  - Reset user and session state to null
  - _Requirements: 4.4, 4.5_

- [x] 3.3 Implement useAuth hook
  - Export `useAuth()` hook to access Auth Context
  - Throw error if used outside AuthProvider
  - Return current auth state (user, session, loading, isConfigured, signOut)
  - _Requirements: 4.6, 10.7_

- [ ] 3.4 Write unit tests for Auth Context
  - Test initial loading state
  - Test user state updates on auth state change
  - Test signOut clears user and session
  - Test graceful handling when Supabase not configured
  - Test useAuth hook throws error outside provider
  - _Requirements: 4.2, 4.4, 4.6_

### 4. Email/Password Authentication UI

- [x] 4.1 Implement signup page with email/password form
  - Update `frontend/src/app/signup/page.tsx` with form fields (email, password, username)
  - Add form validation (email format, minimum 6 character password)
  - Implement `handleSignup()` function to call `supabase.auth.signUp()`
  - Pass username in `options.data.username` field
  - Display success message prompting user to check email
  - Display error messages for authentication failures
  - Show loading state during signup operation
  - Handle Supabase not configured error gracefully
  - _Requirements: 1.1, 1.4, 1.5, 8.1, 9.3_

- [ ] 4.2 Write unit tests for signup page
  - Test form validation (email format, password length)
  - Test error message display for invalid credentials
  - Test success message display after signup
  - Test loading state during submission
  - Test graceful handling when Supabase not configured
  - _Requirements: 1.5, 8.1, 8.5_

- [x] 4.3 Implement login page with email/password form
  - Update `frontend/src/app/login/page.tsx` with form fields (email, password)
  - Implement `handleLogin()` function to call `supabase.auth.signInWithPassword()`
  - Redirect to dashboard on successful login
  - Display error messages without redirecting on failure
  - Show loading state during login operation
  - Handle Supabase not configured error gracefully
  - _Requirements: 1.2, 1.3, 1.6, 1.7, 8.1, 9.3_

- [ ] 4.4 Write unit tests for login page
  - Test form validation
  - Test error message display for invalid credentials
  - Test redirect to dashboard on success
  - Test loading state during submission
  - Test error display without redirect on failure
  - _Requirements: 1.3, 1.6, 1.7, 8.1_

### 5. OAuth Authentication UI

- [x] 5.1 Implement Google OAuth button on signup page
  - Add "Continue with Google" button to `frontend/src/app/signup/page.tsx`
  - Implement `handleGoogleSignup()` function
  - Call `supabase.auth.signInWithOAuth()` with provider "google"
  - Set redirectTo option to `${window.location.origin}/auth/callback`
  - Display error message if OAuth initiation fails
  - Show loading state during OAuth redirect
  - _Requirements: 2.1, 2.2, 8.1_

- [x] 5.2 Implement GitHub OAuth button on signup page
  - Add "Continue with GitHub" button to `frontend/src/app/signup/page.tsx`
  - Implement `handleGithubSignup()` function
  - Call `supabase.auth.signInWithOAuth()` with provider "github"
  - Set redirectTo option to `${window.location.origin}/auth/callback`
  - Display error message if OAuth initiation fails
  - Show loading state during OAuth redirect
  - _Requirements: 3.1, 3.2, 8.1_

- [x] 5.3 Implement Google OAuth button on login page
  - Add "Continue with Google" button to `frontend/src/app/login/page.tsx`
  - Implement `handleGoogleLogin()` function using same logic as signup
  - Call `supabase.auth.signInWithOAuth()` with provider "google"
  - Set redirectTo option to `${window.location.origin}/auth/callback`
  - _Requirements: 2.1, 2.2_

- [x] 5.4 Implement GitHub OAuth button on login page
  - Add "Continue with GitHub" button to `frontend/src/app/login/page.tsx`
  - Implement `handleGithubLogin()` function using same logic as signup
  - Call `supabase.auth.signInWithOAuth()` with provider "github"
  - Set redirectTo option to `${window.location.origin}/auth/callback`
  - _Requirements: 3.1, 3.2_

- [ ]* 5.5 Write unit tests for OAuth buttons
  - Test Google button click initiates OAuth flow
  - Test GitHub button click initiates OAuth flow
  - Test error handling for OAuth initiation failures
  - Test loading states during OAuth redirect
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

### 6. OAuth Callback Handling

- [x] 6.1 Implement OAuth callback route handler
  - Update `frontend/src/app/auth/callback/route.ts` to handle OAuth redirects
  - Extract authorization code from query parameters
  - Extract "next" destination URL from query parameters
  - Create server-side Supabase client using `createServerClient()`
  - Call `supabase.auth.exchangeCodeForSession(code)` to get session
  - Set authentication cookies via server client
  - Redirect to destination URL from "next" parameter, or dashboard if not provided
  - Redirect to login with error parameter if code exchange fails
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [ ]* 6.2 Write unit tests for OAuth callback route
  - Test code extraction from query parameters
  - Test redirect to destination URL
  - Test redirect to dashboard when no destination provided
  - Test error handling for failed code exchange
  - Test cookie setting via server client
  - _Requirements: 7.1, 7.4, 7.5, 7.6_

### 7. Checkpoint - Test Authentication Flows

- [ ] 7. Checkpoint - Ensure all authentication flows work end-to-end
  - Test email/password signup creates account and sends confirmation email
  - Test email/password login authenticates and redirects to dashboard
  - Test Google OAuth flow completes and redirects to dashboard
  - Test GitHub OAuth flow completes and redirects to dashboard
  - Test error messages display correctly for invalid credentials
  - Test sign out clears session and redirects to login
  - Ensure all tests pass, ask the user if questions arise.

### 8. Frontend Route Protection

- [x] 8.1 Implement route protection for dashboard page
  - Update `frontend/src/app/dashboard/page.tsx` to check authentication state
  - Use `useAuth()` hook to access user and loading state
  - Show loading indicator while auth state is initializing
  - Redirect to login page if user is not authenticated
  - Preserve current URL as "next" query parameter during redirect
  - Render dashboard content if user is authenticated
  - _Requirements: 6.1, 6.2, 6.5, 6.6_

- [x] 8.2 Implement post-login redirect to preserved destination
  - Update login page to check for "next" query parameter
  - After successful login, redirect to preserved destination URL if present
  - Redirect to dashboard if no destination URL is preserved
  - _Requirements: 6.3, 6.4_

- [ ]* 8.3 Write integration tests for route protection
  - Test unauthenticated access redirects to login
  - Test authenticated access renders page content
  - Test destination URL preservation during redirect
  - Test loading state during auth check
  - Test redirect to preserved destination after login
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

### 9. Backend API Integration

- [x] 9.1 Update backend auth endpoints to integrate with Supabase
  - Modify `backend/app/api/v1/endpoints/auth.py` signup endpoint
  - Install and import Supabase Python client (`supabase-py`)
  - Create Supabase client using SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
  - Call `supabase.auth.sign_up()` with email and password
  - Return success message or error response
  - _Requirements: 1.1, 5.7_

- [x] 9.2 Update backend login endpoint to integrate with Supabase
  - Modify `backend/app/api/v1/endpoints/auth.py` login endpoint
  - Call `supabase.auth.sign_in_with_password()` with credentials
  - Return JWT token on successful authentication
  - Return error response for invalid credentials
  - _Requirements: 1.2, 1.3, 5.7_

- [x] 9.3 Add protected endpoint example using authentication dependency
  - Create example protected endpoint in `backend/app/api/v1/endpoints/auth.py`
  - Use `Depends(get_current_user)` to require authentication
  - Access user_id from dependency injection
  - Return user-specific data to demonstrate authentication working
  - _Requirements: 5.1, 5.5, 5.6_

- [ ]* 9.4 Write integration tests for backend authentication
  - Test protected endpoint with valid Supabase JWT token
  - Test protected endpoint returns 401 with invalid token
  - Test protected endpoint returns 401 without Authorization header
  - Test user ID extraction and usage in endpoint handler
  - _Requirements: 5.1, 5.3, 5.6_

### 10. User Profile Integration

- [x] 10.1 Implement user profile access in Auth Context
  - Ensure Auth Context provides complete user object with metadata
  - Verify user object includes email, user ID, and authentication provider
  - Verify user object includes username from user_metadata if present
  - Verify user object includes OAuth provider metadata (avatar_url) if present
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 10.2 Implement access token retrieval for API requests
  - Ensure Auth Context provides access to session object
  - Verify session object includes access_token for authenticated API requests
  - Document how to extract access_token from session for API calls
  - _Requirements: 10.5, 10.6_

- [x] 10.3 Create example component using user profile data
  - Create example component in `frontend/src/components/UserProfile.tsx`
  - Use `useAuth()` hook to access user object
  - Display user email, username, and avatar (if available)
  - Show authentication provider (email, google, github)
  - Handle loading and unauthenticated states
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.7_

- [ ]* 10.4 Write unit tests for user profile component
  - Test component displays user data correctly
  - Test component handles loading state
  - Test component handles unauthenticated state
  - Test component displays OAuth provider metadata
  - _Requirements: 10.1, 10.7_

### 11. Error Handling and User Feedback

- [x] 11.1 Implement comprehensive error handling in signup page
  - Distinguish between configuration errors, authentication errors, and network errors
  - Display "Supabase not configured" message for missing environment variables
  - Display "connectivity issues" message for network errors
  - Display specific error messages from Supabase for authentication failures
  - Use color-coded styling (red for errors, green for success)
  - Clear previous messages before displaying new ones
  - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

- [x] 11.2 Implement comprehensive error handling in login page
  - Apply same error handling strategy as signup page
  - Distinguish between different error categories
  - Display appropriate messages for each error type
  - Use consistent styling with signup page
  - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

- [x] 11.3 Implement loading indicators for all async operations
  - Add loading indicators to signup form submission
  - Add loading indicators to login form submission
  - Add loading indicators to OAuth button clicks
  - Add loading indicator to Auth Context initialization
  - Disable form inputs and buttons during loading states
  - _Requirements: 8.7_

- [x] 11.4 Implement graceful OAuth cancellation handling
  - Handle OAuth flow cancellation without showing error message
  - Detect cancellation by checking for specific error codes
  - Return user to login/signup page without error display
  - _Requirements: 8.4_

- [ ]* 11.5 Write integration tests for error handling
  - Test configuration error message display
  - Test network error message display
  - Test authentication error message display
  - Test error message styling (red vs green)
  - Test loading indicators during operations
  - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.7_

### 12. Final Integration and Testing

- [x] 12.1 Create environment variable documentation
  - Document all required environment variables in README
  - Provide example `.env.local` file for frontend
  - Provide example `.env` file for backend
  - Include instructions for obtaining Supabase credentials
  - Document OAuth provider setup steps
  - _Requirements: 9.1, 9.2_

- [ ] 12.2 Test complete authentication flow end-to-end
  - Test email/password signup → email confirmation → login → dashboard
  - Test Google OAuth signup → dashboard
  - Test GitHub OAuth signup → dashboard
  - Test session persistence across page refresh
  - Test automatic token refresh
  - Test sign out → redirect to login
  - Test protected route access (authenticated and unauthenticated)
  - Test backend API calls with JWT token
  - _Requirements: All requirements_

- [ ] 12.3 Write end-to-end integration tests
  - Use Playwright or Cypress for frontend E2E tests
  - Test complete signup and login flows
  - Test OAuth flows (with mocked OAuth providers)
  - Test session management and persistence
  - Test route protection
  - Test backend API integration with frontend
  - _Requirements: All requirements_

- [ ] 13. Final checkpoint - Ensure all tests pass and feature is complete
  - Run all unit tests and verify they pass
  - Run all integration tests and verify they pass
  - Manually test all authentication flows
  - Verify error handling works correctly
  - Verify configuration documentation is complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints (tasks 7 and 13) ensure incremental validation before proceeding
- The implementation uses TypeScript for frontend (Next.js) and Python for backend (FastAPI)
- All authentication flows use Supabase Auth as the identity provider
- JWT tokens are validated locally in the backend without round-trip calls to Supabase
- Session tokens are stored in HTTP-only cookies for security
