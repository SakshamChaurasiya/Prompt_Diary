# API Authentication Guide

This guide explains how to make authenticated API requests to the backend using Supabase access tokens.

## Overview

When a user authenticates with Supabase (via email/password or OAuth), the Auth Context provides access to a `session` object that contains an `access_token`. This JWT token must be included in the `Authorization` header when making API requests to protected backend endpoints.

## Accessing the Access Token

The `useAuth()` hook provides access to the current session:

```typescript
import { useAuth } from "@/lib/AuthContext";

function MyComponent() {
  const { session, user } = useAuth();
  
  // The session object contains the access token
  const accessToken = session?.access_token;
  
  // Use this token for authenticated API requests
}
```

## Session Object Structure

The `session` object from Supabase Auth contains:

```typescript
interface Session {
  access_token: string;      // JWT token for API authentication
  refresh_token: string;     // Token for refreshing the access token
  expires_in: number;        // Token expiration time in seconds
  expires_at?: number;       // Absolute expiration timestamp
  token_type: "bearer";      // Token type (always "bearer")
  user: User;                // User object with profile information
}
```

## Making Authenticated API Requests

### Method 1: Using the API Client Utility

The recommended approach is to use the `fetchAPI` utility from `@/lib/api.ts`, which handles token injection:

```typescript
import { useAuth } from "@/lib/AuthContext";
import { fetchAPI } from "@/lib/api";

function MyComponent() {
  const { session } = useAuth();
  
  const fetchProtectedData = async () => {
    try {
      const data = await fetchAPI("/protected-endpoint", {
        method: "GET",
        token: session?.access_token,
      });
      console.log(data);
    } catch (error) {
      console.error("API request failed:", error);
    }
  };
  
  return (
    <button onClick={fetchProtectedData}>
      Fetch Protected Data
    </button>
  );
}
```

### Method 2: Direct Fetch with Authorization Header

For custom API requests, include the token in the `Authorization` header:

```typescript
import { useAuth } from "@/lib/AuthContext";

function MyComponent() {
  const { session } = useAuth();
  
  const fetchProtectedData = async () => {
    if (!session?.access_token) {
      console.error("No access token available");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/protected-endpoint", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("API request failed:", error);
    }
  };
  
  return (
    <button onClick={fetchProtectedData}>
      Fetch Protected Data
    </button>
  );
}
```

## Complete Example: Protected Resource Component

Here's a complete example of a component that fetches protected data:

```typescript
"use client";

import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  email: string;
  username: string;
}

export default function UserProfileComponent() {
  const { session, user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!loading && session?.access_token) {
      fetchUserProfile();
    }
  }, [loading, session]);

  const fetchUserProfile = async () => {
    if (!session?.access_token) {
      setError("No access token available");
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setFetching(false);
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (fetching) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      {profile ? (
        <div>
          <p>ID: {profile.id}</p>
          <p>Email: {profile.email}</p>
          <p>Username: {profile.username}</p>
        </div>
      ) : (
        <button onClick={fetchUserProfile}>Load Profile</button>
      )}
    </div>
  );
}
```

## Token Lifecycle

### Automatic Token Refresh

The Supabase client automatically refreshes expired access tokens using the refresh token. You don't need to handle token refresh manually - the `session` object in the Auth Context will always contain a valid token (or `null` if the user is not authenticated).

### Token Expiration

Access tokens typically expire after 1 hour. When a token expires:

1. The Supabase client automatically uses the refresh token to obtain a new access token
2. The `onAuthStateChange` listener in the Auth Context updates the session
3. Your components receive the updated session with the new access token

### Handling Token Errors

If an API request returns a 401 Unauthorized error, it typically means:

- The user is not authenticated (no token provided)
- The token has expired and refresh failed
- The token is invalid

Handle this by redirecting the user to the login page:

```typescript
const fetchProtectedData = async () => {
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${session?.access_token}`,
      },
    });
    
    if (response.status === 401) {
      // Token is invalid or expired
      router.push("/login");
      return;
    }
    
    // Handle other responses...
  } catch (error) {
    console.error("Request failed:", error);
  }
};
```

## Backend Token Validation

The backend validates the access token on protected endpoints:

1. Extracts the token from the `Authorization: Bearer <token>` header
2. Verifies the JWT signature using the Supabase JWT secret
3. Checks token expiration
4. Extracts the user ID from the token's `sub` claim
5. Makes the user ID available to the endpoint handler

Example backend endpoint (FastAPI):

```python
from fastapi import Depends, HTTPException
from app.core.security import get_current_user

@router.get("/protected-endpoint")
async def protected_endpoint(user_id: str = Depends(get_current_user)):
    # user_id is guaranteed to be valid here
    return {"message": f"Hello user {user_id}"}
```

## Best Practices

### 1. Always Check for Token Availability

Before making authenticated requests, verify the token exists:

```typescript
if (!session?.access_token) {
  console.error("User is not authenticated");
  return;
}
```

### 2. Handle Loading States

Wait for the Auth Context to finish loading before making requests:

```typescript
const { session, loading } = useAuth();

if (loading) {
  return <div>Loading...</div>;
}
```

### 3. Handle Errors Gracefully

Always wrap API requests in try-catch blocks and provide user feedback:

```typescript
try {
  const data = await fetchAPI("/endpoint", { token: session?.access_token });
  // Handle success
} catch (error) {
  // Show error message to user
  setError(error.message);
}
```

### 4. Don't Store Tokens in localStorage

The Auth Context manages token storage securely using HTTP-only cookies. Never manually store tokens in localStorage or sessionStorage, as this exposes them to XSS attacks.

### 5. Use the API Client Utility

Prefer using the `fetchAPI` utility from `@/lib/api.ts` over direct fetch calls, as it provides consistent error handling and token injection.

## Troubleshooting

### "No access token available"

**Cause**: User is not authenticated or session hasn't loaded yet.

**Solution**: Check the `loading` state and `user` object before accessing the token:

```typescript
const { session, user, loading } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <div>Please log in</div>;

// Now safe to use session.access_token
```

### "401 Unauthorized" from Backend

**Cause**: Token is missing, invalid, or expired.

**Solution**: 
1. Verify the token is included in the Authorization header
2. Check that the backend JWT_SECRET matches your Supabase project's JWT secret
3. Ensure the token hasn't expired (check `session.expires_at`)

### Token Not Refreshing

**Cause**: Refresh token is invalid or Supabase client not properly initialized.

**Solution**:
1. Verify Supabase environment variables are set correctly
2. Check browser console for Supabase errors
3. Try signing out and signing in again

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production to prevent token interception
2. **Token Exposure**: Never log or expose access tokens in client-side code
3. **CORS Configuration**: Ensure backend CORS settings allow requests from your frontend domain
4. **Token Validation**: Backend must validate every token - never trust client-side authentication state
5. **Secure Storage**: Tokens are stored in HTTP-only cookies, which are not accessible to JavaScript

## Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [JWT Token Structure](https://jwt.io/)
- Backend API Documentation: `backend/README.md`
- Auth Context Implementation: `frontend/src/lib/AuthContext.tsx`
