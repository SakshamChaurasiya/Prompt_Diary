# Access Token Usage for API Requests

## Summary

This document verifies that the Auth Context provides access to the session object with the `access_token` field, enabling authenticated API requests to the backend.

## Requirements Addressed

- **Requirement 10.5**: THE Auth_Context SHALL provide access to the current Auth_Session object ✅
- **Requirement 10.6**: THE Auth_Session SHALL include the Access_Token for making authenticated API requests ✅

## Implementation Verification

### 1. Auth Context Exposes Session Object

The `AuthContext` interface includes the `session` property:

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;              // Current session with access_token for API requests
  loading: boolean;
  isConfigured: boolean;
  signOut: () => Promise<void>;
}
```

**Location**: `frontend/src/lib/AuthContext.tsx`

### 2. Session Object Includes Access Token

The `Session` type from Supabase includes the following fields:

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

The `access_token` field contains the JWT token that must be included in the `Authorization` header when making API requests to protected backend endpoints.

### 3. How to Extract Access Token

Developers can access the access token using the `useAuth()` hook:

```typescript
import { useAuth } from "@/lib/AuthContext";

function MyComponent() {
  const { session } = useAuth();
  
  // Extract the access token
  const accessToken = session?.access_token;
  
  // Use it for API requests
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
}
```

## Documentation Created

### 1. Comprehensive API Authentication Guide

**Location**: `frontend/docs/API_AUTHENTICATION.md`

This guide includes:
- Overview of access token usage
- Session object structure
- Two methods for making authenticated API requests
- Complete example component
- Token lifecycle and refresh handling
- Error handling strategies
- Best practices and security considerations
- Troubleshooting guide

### 2. Example Component

**Location**: `frontend/src/components/examples/AuthenticatedAPIExample.tsx`

A working example component that demonstrates:
- Accessing the session and access_token from `useAuth()`
- Making GET requests with the token
- Making POST requests with the token
- Handling loading and error states
- Handling 401 authentication errors
- Displaying token information

### 3. API Client Documentation

**Location**: `frontend/src/lib/api.ts`

Updated the API client utility with documentation showing how to pass the access token:

```typescript
const { session } = useAuth();
const data = await fetchAPI("/protected-endpoint", {
  token: session?.access_token,
});
```

## Tests Created

**Location**: `frontend/src/lib/__tests__/AuthContext.test.tsx`

Created comprehensive tests to verify:

1. ✅ Auth Context provides access to session object with access_token
2. ✅ access_token is exposed from session for API requests
3. ✅ Session object contains all required fields (access_token, refresh_token, expires_in, token_type, user)
4. ✅ Session is null when user is not authenticated
5. ✅ Session updates when auth state changes
6. ✅ Session and access_token are cleared on sign out

**Test Results**: All 6 tests pass ✅

## Usage Examples

### Example 1: Using the API Client Utility

```typescript
import { useAuth } from "@/lib/AuthContext";
import { fetchAPI } from "@/lib/api";

function MyComponent() {
  const { session } = useAuth();
  
  const fetchData = async () => {
    const data = await fetchAPI("/protected-endpoint", {
      token: session?.access_token,
    });
    console.log(data);
  };
}
```

### Example 2: Direct Fetch with Authorization Header

```typescript
import { useAuth } from "@/lib/AuthContext";

function MyComponent() {
  const { session } = useAuth();
  
  const fetchData = async () => {
    const response = await fetch("http://localhost:8000/api/v1/protected", {
      headers: {
        "Authorization": `Bearer ${session?.access_token}`,
      },
    });
    const data = await response.json();
  };
}
```

## Backend Integration

The backend validates the access token on protected endpoints:

1. Extracts the token from the `Authorization: Bearer <token>` header
2. Verifies the JWT signature using the Supabase JWT secret
3. Checks token expiration
4. Extracts the user ID from the token's `sub` claim
5. Makes the user ID available to the endpoint handler

**Example Backend Endpoint** (FastAPI):

```python
from fastapi import Depends
from app.core.security import get_current_user

@router.get("/protected")
async def protected_endpoint(user_id: str = Depends(get_current_user)):
    return {"message": f"Hello user {user_id}"}
```

## Verification Checklist

- [x] Auth Context exposes `session` object
- [x] Session object includes `access_token` field
- [x] Documentation created for extracting access_token
- [x] Documentation created for making authenticated API requests
- [x] Example component created demonstrating usage
- [x] Tests created and passing
- [x] API client utility documented
- [x] Backend integration documented

## Conclusion

The Auth Context successfully provides access to the session object, which includes the `access_token` field required for making authenticated API requests to the backend. Comprehensive documentation and examples have been created to guide developers on how to use the access token correctly.

**Requirements 10.5 and 10.6 are fully satisfied.** ✅
