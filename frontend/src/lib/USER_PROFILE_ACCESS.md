# User Profile Access via Auth Context

This document explains how to access user profile data from the Auth Context in your components.

## Overview

The Auth Context provides complete access to the Supabase `User` object, which includes:
- User ID and email
- Authentication provider (email, google, github)
- User metadata (username, avatar_url, etc.)
- App metadata (provider information)

## Usage

### Basic User Data Access

```typescript
import { useAuth } from "@/lib/AuthContext";

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <p>User ID: {user.id}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## Available User Properties

### Core Properties (Always Available)

- `user.id` - Unique user identifier (UUID)
- `user.email` - User's email address
- `user.created_at` - Account creation timestamp
- `user.updated_at` - Last update timestamp

### Authentication Provider

```typescript
const provider = user.app_metadata?.provider; // 'email', 'google', 'github'
const providers = user.app_metadata?.providers; // Array of all linked providers
```

### User Metadata (Optional Fields)

User metadata is set during signup or provided by OAuth providers:

```typescript
// Username (set during email/password signup)
const username = user.user_metadata?.username;

// Display name (may come from OAuth or manual entry)
const displayName = user.user_metadata?.display_name || 
                    user.user_metadata?.full_name;

// Avatar URL (typically from OAuth providers)
const avatarUrl = user.user_metadata?.avatar_url;
```

## Real-World Example

See `frontend/src/app/dashboard/page.tsx` for a complete example:

```typescript
import { useAuth } from "@/lib/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login
    return null;
  }

  // Get display name with fallback chain
  const displayName =
    user.user_metadata?.display_name ||
    user.user_metadata?.username ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  // Get avatar URL if available
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div>
      <h1>Welcome, {displayName}</h1>
      <p>{user.email}</p>
      {avatarUrl && <img src={avatarUrl} alt="Avatar" />}
    </div>
  );
}
```

## User Metadata by Provider

### Email/Password Authentication

When users sign up with email/password, you can store custom metadata:

```typescript
// During signup (in signup page)
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username: "johndoe", // Custom field
    },
  },
});

// Later, access it via:
const username = user.user_metadata?.username;
```

### Google OAuth

Google OAuth provides:
- `user.user_metadata.avatar_url` - Profile picture URL
- `user.user_metadata.full_name` - Full name from Google profile
- `user.user_metadata.email` - Email (also in `user.email`)
- `user.app_metadata.provider` - "google"

### GitHub OAuth

GitHub OAuth provides:
- `user.user_metadata.avatar_url` - GitHub avatar URL
- `user.user_metadata.user_name` - GitHub username
- `user.user_metadata.full_name` - Full name (if public)
- `user.app_metadata.provider` - "github"

## Type Safety

The `User` type is imported from `@supabase/supabase-js`:

```typescript
import type { User } from "@supabase/supabase-js";

const { user } = useAuth(); // user is User | null
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 10.1**: Auth Context provides complete user object with metadata
- **Requirement 10.2**: User object includes email, user ID, and authentication provider
- **Requirement 10.3**: User object includes username from user_metadata if present
- **Requirement 10.4**: User object includes OAuth provider metadata (avatar_url) if present
- **Requirement 10.7**: Components access user data via the useAuth hook

## Testing

See `frontend/src/lib/__tests__/AuthContext.userProfile.test.tsx` for comprehensive tests covering:
- Email, user ID, and provider access
- Username from user_metadata
- OAuth provider metadata (avatar_url)
- Graceful handling of missing fields
