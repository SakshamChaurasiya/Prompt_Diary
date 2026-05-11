# UserProfile Component

## Overview

The `UserProfile` component is an example component that demonstrates how to use user profile data from the Auth Context. It displays comprehensive user information including email, username, avatar, authentication provider, and session details.

## Features

- ✅ Displays user email, username, and avatar
- ✅ Shows authentication provider (Email/Password, Google, GitHub)
- ✅ Displays session information (access token, token type, expiration)
- ✅ Handles loading state during auth initialization
- ✅ Handles unauthenticated state with login prompt
- ✅ Responsive design with glass-card styling
- ✅ Includes usage example code

## Usage

### Basic Usage

```tsx
import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  return (
    <div>
      <h1>My Profile</h1>
      <UserProfile />
    </div>
  );
}
```

### Accessing User Data in Your Components

The UserProfile component demonstrates how to use the `useAuth()` hook:

```tsx
import { useAuth } from "@/lib/AuthContext";

function MyComponent() {
  const { user, session, loading } = useAuth();

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle unauthenticated state
  if (!user) {
    return <div>Please log in</div>;
  }

  // Access user data
  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Username: {user.user_metadata?.username}</p>
      <p>Provider: {user.app_metadata?.provider}</p>
      <p>Avatar: {user.user_metadata?.avatar_url}</p>
    </div>
  );
}
```

## User Object Structure

The `user` object from `useAuth()` contains:

```typescript
interface User {
  id: string;                          // UUID user identifier
  email: string;                       // User's email address
  user_metadata: {
    username?: string;                 // Username (if provided)
    display_name?: string;             // Display name
    avatar_url?: string;               // Profile picture URL (from OAuth)
  };
  app_metadata: {
    provider: string;                  // Auth provider (email, google, github)
    providers: string[];               // All linked providers
  };
}
```

## Session Object Structure

The `session` object from `useAuth()` contains:

```typescript
interface Session {
  access_token: string;                // JWT access token for API requests
  refresh_token: string;               // Token for refreshing access token
  expires_in: number;                  // Token expiration time (seconds)
  token_type: "bearer";                // Token type
  user: User;                          // User object
}
```

## Example Page

A complete example page is available at `/profile` which demonstrates the UserProfile component in action.

To view it:
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/profile`
3. Log in if not already authenticated

## Testing

The component includes comprehensive unit tests covering:
- Loading state
- Unauthenticated state
- User profile display
- Authentication provider display
- Session information display
- Edge cases (missing data)

Run tests with:
```bash
npm test -- UserProfile.test.tsx
```

## Requirements Validated

This component validates the following requirements from the Supabase Authentication spec:

- **Requirement 10.1**: Access to user object containing user metadata
- **Requirement 10.2**: User object includes email, user ID, and authentication provider
- **Requirement 10.3**: User object includes username in user metadata
- **Requirement 10.4**: User object includes provider-specific metadata (avatar URL)
- **Requirement 10.7**: Component accesses data via the useAuth hook

## Styling

The component uses the project's existing styling patterns:
- Glass-card styling for containers
- CSS variables for colors and spacing
- Responsive design
- Gradient accents for visual interest

## Customization

You can customize the component by:
1. Modifying the styling (inline styles or CSS classes)
2. Adding/removing fields to display
3. Changing the layout structure
4. Adding interactive features (edit profile, etc.)

## Related Components

- `AuthContext` - Provides authentication state
- `AuthenticatedAPIExample` - Shows how to make authenticated API requests
- `LoginPage` - User authentication interface
- `SignupPage` - User registration interface
