# Quick Start: Making Authenticated API Requests

This guide shows you how to quickly start making authenticated API requests using the access token from the Auth Context.

## Step 1: Import the useAuth Hook

```typescript
import { useAuth } from "@/lib/AuthContext";
```

## Step 2: Access the Session Object

```typescript
function MyComponent() {
  const { session, user, loading } = useAuth();
  
  // The session object contains the access_token
  const accessToken = session?.access_token;
}
```

## Step 3: Make an Authenticated API Request

### Option A: Using the API Client Utility (Recommended)

```typescript
import { useAuth } from "@/lib/AuthContext";

function MyComponent() {
  const { session } = useAuth();
  
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/protected-endpoint", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("API request failed:", error);
    }
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
}
```

### Option B: Using the fetchAPI Utility

```typescript
import { useAuth } from "@/lib/AuthContext";
import { fetchAPI } from "@/lib/api";

function MyComponent() {
  const { session } = useAuth();
  
  const fetchData = async () => {
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
  
  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Complete Example

Here's a complete component that fetches user data from a protected endpoint:

```typescript
"use client";

import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";

export default function UserDataComponent() {
  const { session, user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && session?.access_token) {
      fetchUserData();
    }
  }, [loading, session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/user/data", {
        headers: {
          "Authorization": `Bearer ${session?.access_token}`,
        },
      });

      if (response.status === 401) {
        setError("Authentication failed. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

## Important Notes

1. **Always check for the token**: Before making a request, verify that `session?.access_token` exists
2. **Handle loading state**: Wait for `loading` to be `false` before accessing the session
3. **Handle 401 errors**: If the backend returns 401, the token is invalid or expired
4. **Token format**: The token should be included as `Bearer ${token}` in the Authorization header
5. **Automatic refresh**: The Supabase client automatically refreshes expired tokens

## Common Patterns

### Pattern 1: Fetch on Component Mount

```typescript
useEffect(() => {
  if (!loading && session?.access_token) {
    fetchData();
  }
}, [loading, session]);
```

### Pattern 2: Fetch on Button Click

```typescript
const handleClick = async () => {
  if (!session?.access_token) {
    alert("Please log in first");
    return;
  }
  await fetchData();
};
```

### Pattern 3: POST Request with Data

```typescript
const submitData = async (formData) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(formData),
  });
};
```

## Troubleshooting

**Problem**: "No access token available"
- **Solution**: Check that the user is logged in and `loading` is false

**Problem**: "401 Unauthorized"
- **Solution**: Verify the token is included in the header and the backend JWT_SECRET is correct

**Problem**: Token not refreshing
- **Solution**: The Supabase client handles this automatically. If it's not working, check your Supabase configuration

## Next Steps

- Read the full [API Authentication Guide](./API_AUTHENTICATION.md)
- See the [Example Component](../src/components/examples/AuthenticatedAPIExample.tsx)
- Review the [Backend API Documentation](../../backend/README.md)
