# Authentication Flow Guide

This guide provides complete instructions for obtaining JWT tokens from the frontend and using them to authorize in Swagger UI for testing protected API endpoints.

## Table of Contents

1. [Overview](#overview)
2. [Authentication System](#authentication-system)
3. [Obtaining a JWT Token](#obtaining-a-jwt-token)
4. [Authorizing in Swagger UI](#authorizing-in-swagger-ui)
5. [Token Expiration and Re-authentication](#token-expiration-and-re-authentication)
6. [Alternative Token Extraction Methods](#alternative-token-extraction-methods)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The Prompt Dairy API uses **JWT (JSON Web Token) authentication** for protected endpoints. This guide walks you through:

1. Logging into the frontend application
2. Extracting the JWT access token from your browser
3. Using the token to authorize in Swagger UI
4. Testing protected API endpoints

**Prerequisites:**
- Frontend running at `http://localhost:3000`
- Backend running at `http://localhost:8000`
- Supabase authentication configured (see [AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md))

---

## Authentication System

### Supabase Auth

The application uses **Supabase Auth** for user authentication, which provides:

- Email/password authentication
- OAuth providers (Google, GitHub)
- Secure JWT token generation
- Automatic token refresh

### JWT Token Structure

When you authenticate, Supabase generates a JWT token stored in your browser's Local Storage. The token contains:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": 1234567890,
  "refresh_token": "...",
  "user": { ... }
}
```

**Key Fields:**
- `access_token`: The JWT token you'll use for API authentication
- `expires_in`: Token validity duration in seconds (typically 3600 = 1 hour)
- `expires_at`: Absolute expiration timestamp
- `refresh_token`: Used to obtain a new access token when it expires

---

## Obtaining a JWT Token

Follow these steps to extract your JWT access token from the browser.

### Step 1: Navigate to the Login Page

Open your browser and go to:

```
http://localhost:3000/login
```

### Step 2: Sign Up or Log In

**Option A: Email/Password**
1. If you don't have an account, click "Sign Up" and create one
2. If you have an account, enter your email and password
3. Click "Sign In"

**Option B: OAuth (Google/GitHub)**
1. Click "Continue with Google" or "Continue with GitHub"
2. Authenticate with your OAuth provider
3. You'll be redirected back to the application

After successful authentication, you'll be redirected to the dashboard.

### Step 3: Open Browser Developer Tools

Press **F12** (or right-click → "Inspect") to open Developer Tools.

**Keyboard Shortcuts:**
- **Windows/Linux**: `F12` or `Ctrl + Shift + I`
- **macOS**: `Cmd + Option + I`

### Step 4: Navigate to Application Tab

In Developer Tools:

1. Click the **"Application"** tab (Chrome/Edge) or **"Storage"** tab (Firefox)
2. In the left sidebar, expand **"Local Storage"**
3. Click on `http://localhost:3000`

**Visual Guide:**
```
Developer Tools
├── Elements
├── Console
├── Sources
├── Network
├── Performance
├── Memory
├── Application  ← Click here
│   ├── Local Storage  ← Expand this
│   │   └── http://localhost:3000  ← Click this
│   ├── Session Storage
│   ├── IndexedDB
│   └── Cookies
```

### Step 5: Find the Supabase Auth Token

In the Local Storage view, look for a key matching the pattern:

```
sb-<project-id>-auth-token
```

**Example:**
```
sb-abcdefghijklmnop-auth-token
```

The exact name depends on your Supabase project ID.

### Step 6: Extract the Access Token

1. Click on the `sb-*-auth-token` key
2. In the value column, you'll see a JSON object
3. Look for the `access_token` field within the JSON

**Example Value:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM0NTY3ODkwLCJpYXQiOjE3MzQ1NjQyOTAsImlzcyI6Imh0dHBzOi8veW91ci1wcm9qZWN0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJ1c2VyLWlkLWhlcmUiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6e30sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.signature-here",
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": 1734567890,
  "refresh_token": "...",
  "user": { ... }
}
```

### Step 7: Copy the Access Token

1. **Double-click** the `access_token` value to select it
2. **Right-click** → "Copy" (or press `Ctrl+C` / `Cmd+C`)
3. The token should start with `eyJ...`

**Important:** Copy only the `access_token` value, not the entire JSON object.

---

## Authorizing in Swagger UI

Once you have the access token, use it to authorize in Swagger UI.

### Step 1: Open Swagger UI

Navigate to the interactive API documentation:

```
http://localhost:8000/docs
```

### Step 2: Click the Authorize Button

In the top-right corner of the Swagger UI page, you'll see a green **"Authorize"** button with a lock icon. Click it.

**Visual Location:**
```
┌─────────────────────────────────────────────────┐
│  Prompt Dairy API          [Authorize] 🔓      │
│  Version 1.0                                    │
└─────────────────────────────────────────────────┘
```

### Step 3: Enter the Bearer Token

A dialog will appear with an input field labeled **"Value"**.

**Enter the token in this format:**

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- Include the word `Bearer` followed by a **space**
- Then paste your access token
- The format is: `Bearer <access_token>`

**Example:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM0NTY3ODkwLCJpYXQiOjE3MzQ1NjQyOTAsImlzcyI6Imh0dHBzOi8veW91ci1wcm9qZWN0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJ1c2VyLWlkLWhlcmUiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6e30sInVzZXJfbWV0YWRhdGEiOnt9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.signature-here
```

### Step 4: Authorize

1. Click the **"Authorize"** button in the dialog
2. The lock icon should change from 🔓 (unlocked) to 🔒 (locked)
3. Click **"Close"** to dismiss the dialog

### Step 5: Verify Authorization

You're now authorized! The Swagger UI will automatically include your token in the `Authorization` header for all requests to protected endpoints.

**Visual Indicator:**
```
┌─────────────────────────────────────────────────┐
│  Prompt Dairy API          [Authorize] 🔒      │
│  Version 1.0                                    │
└─────────────────────────────────────────────────┘
```

The lock icon changes to indicate you're authenticated.

### Step 6: Test a Protected Endpoint

Try testing a protected endpoint to verify authorization:

1. Scroll to the **"Authentication"** section
2. Click **GET /api/v1/auth/me**
3. Click **"Try it out"** → **"Execute"**
4. You should receive a **200 OK** response with your user profile

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id-here",
    "email": "user@example.com",
    "role": "authenticated",
    "profile": {
      "id": "profile-id",
      "username": "your-username",
      "display_name": "Your Name",
      "bio": "Your bio",
      "avatar_url": "https://..."
    }
  }
}
```

If you receive a **401 Unauthorized** error, see the [Troubleshooting](#troubleshooting) section.

---

## Token Expiration and Re-authentication

### Token Lifetime

JWT access tokens typically expire after **1 hour** (3600 seconds). After expiration, you'll need to obtain a new token.

### Detecting Token Expiration

When your token expires, protected API endpoints will return:

**Response:**
```json
{
  "detail": "Invalid or expired token"
}
```

**Status Code:** `401 Unauthorized`

### Re-authentication Steps

When your token expires:

1. **Return to the frontend** (`http://localhost:3000`)
2. **Check if you're still logged in**:
   - If logged in, the Supabase client automatically refreshes the token
   - Extract the new token using the same steps as before
3. **If logged out**:
   - Log in again at `http://localhost:3000/login`
   - Extract the new token from Local Storage
4. **Re-authorize in Swagger UI**:
   - Click "Authorize" → "Logout" (to clear old token)
   - Enter the new token with `Bearer` prefix
   - Click "Authorize"

### Automatic Token Refresh

The frontend application automatically refreshes tokens using the `refresh_token`. However, Swagger UI does not have access to this mechanism, so you must manually update the token when it expires.

**Best Practice:** If you're doing extensive API testing, keep the frontend tab open. The Supabase client will keep your session alive and refresh tokens automatically.

---

## Alternative Token Extraction Methods

If you have trouble finding the token in Local Storage, try these alternative methods.

### Method 1: Browser Console

1. Open Developer Tools (F12)
2. Go to the **Console** tab
3. Paste and run this JavaScript code:

```javascript
// Extract Supabase auth token from Local Storage
const keys = Object.keys(localStorage);
const authKey = keys.find(key => key.includes('auth-token'));
if (authKey) {
  const authData = JSON.parse(localStorage.getItem(authKey));
  console.log('Access Token:', authData.access_token);
  console.log('Expires At:', new Date(authData.expires_at * 1000));
} else {
  console.log('No auth token found. Please log in.');
}
```

4. The access token will be printed in the console
5. Copy the token value

### Method 2: Network Tab

1. Open Developer Tools (F12)
2. Go to the **Network** tab
3. **Log in** to the application (or refresh the page if already logged in)
4. In the Network tab, filter by "auth" or "token"
5. Look for requests to Supabase Auth endpoints
6. Click on a request and go to the **Response** tab
7. Find the `access_token` in the response JSON

**Example Request:**
```
POST https://your-project.supabase.co/auth/v1/token?grant_type=password
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  ...
}
```

### Method 3: React DevTools (Advanced)

If you have React DevTools installed:

1. Open Developer Tools (F12)
2. Go to the **Components** tab (React DevTools)
3. Find the `AuthProvider` component
4. Inspect the component's state/props
5. Look for the `session` object containing `access_token`

### Method 4: Copy from Frontend Code (Development Only)

For development purposes, you can temporarily add a "Copy Token" button to the frontend:

```typescript
// Add to any authenticated page
import { useAuth } from "@/lib/AuthContext";

export default function TokenCopier() {
  const { session } = useAuth();
  
  const copyToken = () => {
    if (session?.access_token) {
      navigator.clipboard.writeText(session.access_token);
      alert('Token copied to clipboard!');
    }
  };
  
  return <button onClick={copyToken}>Copy Token</button>;
}
```

---

## Troubleshooting

### Issue: Can't Find Auth Token in Local Storage

**Symptoms:**
- No keys matching `sb-*-auth-token` pattern in Local Storage
- Local Storage is empty

**Solutions:**

1. **Verify you're logged in:**
   - Go to `http://localhost:3000/dashboard`
   - If redirected to login, you're not authenticated

2. **Check the correct domain:**
   - Ensure you're viewing Local Storage for `http://localhost:3000`
   - Not `http://localhost:8000` (backend domain)

3. **Try alternative extraction methods:**
   - Use the [Browser Console method](#method-1-browser-console)
   - Use the [Network Tab method](#method-2-network-tab)

4. **Clear cache and re-login:**
   - Clear browser cache and cookies
   - Log in again
   - Check Local Storage immediately after login

### Issue: Swagger Authorization Fails

**Symptoms:**
- After authorizing, protected endpoints still return 401
- Error: "Authorization header missing" or "Invalid token"

**Solutions:**

1. **Check Bearer format:**
   - Ensure you included `Bearer ` (with space) before the token
   - Correct: `Bearer eyJhbGci...`
   - Incorrect: `eyJhbGci...` or `Bearer eyJhbGci...` (no space)

2. **Verify token is complete:**
   - JWT tokens are long (typically 200+ characters)
   - Ensure you copied the entire token
   - Token should start with `eyJ` and have three parts separated by dots

3. **Check token expiration:**
   - Tokens expire after 1 hour
   - Extract a fresh token from the frontend
   - Re-authorize in Swagger UI

4. **Verify JWT secret configuration:**
   - Backend `JWT_SECRET` must match Supabase project's JWT secret
   - See [AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md) for configuration

### Issue: Token Expired Immediately

**Symptoms:**
- Token works briefly then stops
- Error: "Invalid or expired token"

**Solutions:**

1. **Check system clock:**
   - Ensure your computer's clock is accurate
   - JWT expiration is based on timestamps

2. **Verify token expiration time:**
   - Use the [Browser Console method](#method-1-browser-console) to check `expires_at`
   - Compare with current time

3. **Check Supabase project status:**
   - Verify your Supabase project is active
   - Check Supabase dashboard for any issues

### Issue: 401 Unauthorized Despite Valid Token

**Symptoms:**
- Token is valid and not expired
- Still receiving 401 errors

**Solutions:**

1. **Verify backend JWT configuration:**
   - Check `backend/.env` has correct `JWT_SECRET`
   - Must match Supabase project's JWT secret exactly
   - See [AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md)

2. **Check backend logs:**
   - Look for JWT validation errors in backend console
   - Common errors: "Token signature verification failed"

3. **Verify Supabase URL:**
   - Backend `SUPABASE_URL` must match your project URL
   - Check `backend/.env` configuration

4. **Test with a fresh token:**
   - Log out and log in again
   - Extract a completely new token
   - Re-authorize in Swagger UI

### Issue: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Requests blocked by CORS policy

**Solutions:**

1. **Verify backend CORS configuration:**
   - Check `backend/app/main.py` CORS settings
   - Ensure `http://localhost:3000` is allowed

2. **Check frontend API URL:**
   - Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
   - Should be `http://localhost:8000`

3. **Use Swagger UI instead:**
   - Swagger UI is served by the backend, so no CORS issues
   - This is the recommended testing method

---

## Summary

### Quick Reference: Token Extraction

1. Go to `http://localhost:3000/login` and log in
2. Press **F12** → **Application** tab → **Local Storage** → `http://localhost:3000`
3. Find key: `sb-*-auth-token`
4. Copy the `access_token` value

### Quick Reference: Swagger Authorization

1. Go to `http://localhost:8000/docs`
2. Click **Authorize** button (top-right)
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Click **Authorize** → **Close**
5. Test protected endpoints

### Token Lifecycle

- **Validity:** 1 hour (3600 seconds)
- **Refresh:** Automatic in frontend, manual in Swagger UI
- **Re-authentication:** Extract new token when expired

---

## Next Steps

Now that you're authorized, you can test protected endpoints:

- **[Protected APIs Guide](protected-apis.md)**: Test user profile and progress tracking endpoints
- **[User Progress Flow](user-progress-flow.md)**: Complete end-to-end progress tracking workflow
- **[Error Scenarios](error-scenarios.md)**: Test authentication error handling

---

## Related Documentation

- **[AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md)**: Supabase authentication configuration
- **[Public APIs Guide](public-apis.md)**: Test endpoints without authentication
- **[Troubleshooting Guide](troubleshooting.md)**: Common testing issues and solutions
- **[API Reference](../api.md)**: Complete endpoint documentation

---

**Last Updated:** 2024  
**Maintained By:** Prompt Dairy Development Team
