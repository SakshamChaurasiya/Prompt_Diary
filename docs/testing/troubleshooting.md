# Troubleshooting Guide

This guide provides solutions to common issues encountered when testing the Prompt Dairy API. Each issue includes symptoms, root causes, and step-by-step solutions.

## Table of Contents

1. [Authentication Issues](#authentication-issues)
2. [CORS Issues](#cors-issues)
3. [Database Issues](#database-issues)
4. [Supabase Issues](#supabase-issues)
5. [Test Data Issues](#test-data-issues)
6. [Swagger UI Issues](#swagger-ui-issues)
7. [General API Issues](#general-api-issues)

---

## Authentication Issues

### Problem: Can't Find JWT Token in Local Storage

**Symptoms:**
- No keys matching `sb-*-auth-token` pattern in Local Storage
- Local Storage appears empty
- Can't extract access token

**Root Cause:**
- Not logged in to the frontend
- Viewing wrong domain's Local Storage
- Browser privacy settings blocking Local Storage

**Solution:**

1. **Verify you're logged in:**
   ```
   - Go to http://localhost:3000/dashboard
   - If redirected to /login, you're not authenticated
   - Log in with valid credentials
   ```

2. **Check the correct domain:**
   ```
   - Open DevTools (F12)
   - Go to Application tab → Local Storage
   - Ensure you're viewing http://localhost:3000
   - NOT http://localhost:8000 (backend domain)
   ```

3. **Try alternative extraction methods:**
   - **Method 1: Browser Console**
     ```javascript
     const keys = Object.keys(localStorage);
     const authKey = keys.find(key => key.includes('auth-token'));
     if (authKey) {
       const authData = JSON.parse(localStorage.getItem(authKey));
       console.log('Access Token:', authData.access_token);
     }
     ```
   
   - **Method 2: Network Tab**
     ```
     1. Open DevTools → Network tab
     2. Log in to the application
     3. Filter by "auth" or "token"
     4. Find Supabase auth request
     5. Check Response tab for access_token
     ```

4. **Clear cache and re-login:**
   ```
   - Clear browser cache and cookies
   - Close and reopen browser
   - Log in again
   - Check Local Storage immediately after login
   ```

**References:**
- [Authentication Flow Guide](authentication-flow.md#alternative-token-extraction-methods)

---

### Problem: Swagger Authorization Fails

**Symptoms:**
- After authorizing, protected endpoints still return 401
- Error: "Authorization header missing" or "Invalid token"
- Lock icon remains unlocked in Swagger UI

**Root Cause:**
- Missing "Bearer " prefix
- Extra spaces in token
- Token is incomplete or corrupted
- Token has expired

**Solution:**

1. **Check Bearer format:**
   ```
   ✅ Correct: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ❌ Wrong: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (missing "Bearer ")
   ❌ Wrong: BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (no space)
   ❌ Wrong: Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (two spaces)
   ```

2. **Verify token is complete:**
   ```
   - JWT tokens are typically 200+ characters long
   - Token should start with "eyJ"
   - Token has three parts separated by dots: xxxxx.yyyyy.zzzzz
   - Ensure you copied the entire token
   ```

3. **Check token expiration:**
   ```
   - Tokens expire after 1 hour
   - Extract a fresh token from the frontend
   - Log out and log in again if needed
   ```

4. **Re-authorize step-by-step:**
   ```
   1. Click "Authorize" button in Swagger UI
   2. If already authorized, click "Logout" first
   3. Enter: Bearer YOUR_ACCESS_TOKEN
   4. Click "Authorize" (button in dialog)
   5. Verify lock icon changes to locked 🔒
   6. Click "Close"
   7. Try a protected endpoint
   ```

5. **Verify JWT secret configuration:**
   ```
   - Check backend/.env has JWT_SECRET
   - Must match Supabase project's JWT secret
   - See AUTHENTICATION_SETUP.md for configuration
   ```

**References:**
- [Authentication Flow Guide](authentication-flow.md#authorizing-in-swagger-ui)
- [AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md)

---

### Problem: Token Expired Immediately

**Symptoms:**
- Token works briefly then stops
- Error: "Invalid or expired token" right after authorization
- Token expires faster than expected (< 1 hour)

**Root Cause:**
- System clock is incorrect
- Token was already near expiration when extracted
- Supabase project issue

**Solution:**

1. **Check system clock:**
   ```
   - Ensure your computer's date and time are accurate
   - JWT expiration is based on timestamps
   - Incorrect clock can cause immediate expiration
   ```

2. **Verify token expiration time:**
   ```javascript
   // In browser console
   const keys = Object.keys(localStorage);
   const authKey = keys.find(key => key.includes('auth-token'));
   const authData = JSON.parse(localStorage.getItem(authKey));
   console.log('Expires At:', new Date(authData.expires_at * 1000));
   console.log('Current Time:', new Date());
   ```

3. **Get a fresh token:**
   ```
   - Log out from frontend
   - Log in again
   - Extract token immediately
   - Use it right away in Swagger UI
   ```

4. **Check Supabase project status:**
   ```
   - Go to Supabase dashboard
   - Verify project is active (not paused)
   - Check for any service issues
   ```

---

### Problem: 401 Unauthorized Despite Valid Token

**Symptoms:**
- Token is valid and not expired
- Still receiving 401 errors on protected endpoints
- Token works in frontend but not in Swagger UI

**Root Cause:**
- Backend JWT_SECRET doesn't match Supabase JWT secret
- Backend can't verify token signature
- Supabase URL mismatch

**Solution:**

1. **Verify backend JWT configuration:**
   ```bash
   # Check backend/.env
   JWT_SECRET=your-supabase-jwt-secret-here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Get correct JWT secret from Supabase:**
   ```
   1. Go to Supabase dashboard
   2. Select your project
   3. Go to Settings → API
   4. Copy "JWT Secret" (under Project API keys)
   5. Paste into backend/.env as JWT_SECRET
   6. Restart backend server
   ```

3. **Check backend logs:**
   ```
   - Look for JWT validation errors
   - Common errors: "Token signature verification failed"
   - Check backend console output
   ```

4. **Test with a fresh token:**
   ```
   - Log out and log in again
   - Extract completely new token
   - Re-authorize in Swagger UI
   - Try protected endpoint
   ```

**References:**
- [AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md)
- [backend/CONFIGURATION_SETUP.md](../../backend/CONFIGURATION_SETUP.md)

---

## CORS Issues

### Problem: CORS Errors in Browser Console

**Symptoms:**
- Browser console shows CORS policy errors
- Requests blocked by CORS policy
- Error: "No 'Access-Control-Allow-Origin' header"

**Root Cause:**
- Frontend and backend CORS configuration mismatch
- Incorrect API URL in frontend
- Backend not allowing frontend origin

**Solution:**

1. **Verify frontend API URL:**
   ```bash
   # Check frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Check backend CORS configuration:**
   ```python
   # In backend/app/main.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],  # Frontend URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Restart both servers:**
   ```bash
   # Terminal 1: Backend
   cd backend
   python -m uvicorn app.main:app --reload
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

4. **Use Swagger UI instead:**
   ```
   - Swagger UI is served by the backend
   - No CORS issues when testing through Swagger
   - Recommended for API testing
   ```

**Note:** CORS errors only affect browser-based requests. Swagger UI and backend-to-backend requests are not affected.

---

## Database Issues

### Problem: Empty Responses or "Not Found" Errors

**Symptoms:**
- GET /articles returns empty array
- GET /challenges returns no data
- All resource endpoints return 404

**Root Cause:**
- Database not seeded with test data
- Database connection failure
- Wrong database being queried

**Solution:**

1. **Run database migrations:**
   ```bash
   cd backend
   python setup_database.py
   ```

2. **Run seed script:**
   ```bash
   # From project root
   psql -U your_username -d your_database -f database/seed/seed_data.sql
   ```

3. **Verify database connection:**
   ```bash
   # Check backend/.env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Check Supabase dashboard:**
   ```
   1. Go to Supabase dashboard
   2. Select your project
   3. Go to Table Editor
   4. Verify tables exist: articles, challenges, roadmaps
   5. Check that tables have data
   ```

5. **Test database connection:**
   ```bash
   cd backend
   python test_supabase.py
   ```

**References:**
- [backend/CONFIGURATION_SETUP.md](../../backend/CONFIGURATION_SETUP.md)
- [database/README.md](../../database/README.md)

---

### Problem: Database Connection Failure

**Symptoms:**
- 500 Internal Server Error on all endpoints
- Backend logs show database connection errors
- "Failed to connect to database" messages

**Root Cause:**
- Invalid Supabase credentials
- Supabase project is paused or deleted
- Network connectivity issues

**Solution:**

1. **Verify Supabase credentials:**
   ```bash
   # Check backend/.env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Test Supabase connection:**
   ```bash
   cd backend
   python test_supabase.py
   ```

3. **Check Supabase project status:**
   ```
   1. Go to Supabase dashboard
   2. Verify project is active (not paused)
   3. Check project health status
   4. Restart project if needed
   ```

4. **Check network connectivity:**
   ```bash
   # Test connection to Supabase
   curl https://your-project.supabase.co
   ```

5. **Review backend logs:**
   ```
   - Check backend console for detailed error messages
   - Look for connection timeout errors
   - Check for authentication failures
   ```

**References:**
- [backend/CONFIGURATION_SETUP.md](../../backend/CONFIGURATION_SETUP.md)

---

## Supabase Issues

### Problem: Supabase Authentication Fails

**Symptoms:**
- Can't log in to frontend
- "Authentication failed" errors
- Supabase client errors in console

**Root Cause:**
- Invalid Supabase credentials in frontend
- Supabase project not configured correctly
- Email confirmation required but not completed

**Solution:**

1. **Verify frontend Supabase configuration:**
   ```bash
   # Check frontend/.env.local
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Get correct credentials from Supabase:**
   ```
   1. Go to Supabase dashboard
   2. Select your project
   3. Go to Settings → API
   4. Copy "Project URL" and "anon public" key
   5. Update frontend/.env.local
   6. Restart frontend server
   ```

3. **Check email confirmation settings:**
   ```
   1. Go to Supabase dashboard → Authentication → Settings
   2. Check "Enable email confirmations"
   3. If enabled, check your email for confirmation link
   4. Or disable for testing purposes
   ```

4. **Test with different auth method:**
   ```
   - Try OAuth (Google/GitHub) if email/password fails
   - Or try email/password if OAuth fails
   ```

**References:**
- [AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md)

---

## Test Data Issues

### Problem: Invalid Article/Challenge IDs

**Symptoms:**
- 404 errors when marking progress
- "Article not found" or "Challenge not found"
- IDs from documentation don't work

**Root Cause:**
- Using example IDs from documentation
- Database has different IDs than expected
- Test data not seeded correctly

**Solution:**

1. **Get valid IDs dynamically:**
   ```
   Step 1: GET /api/v1/articles
   Step 2: Copy an actual ID from the response
   Step 3: Use that ID in your test
   ```

2. **Don't use hardcoded IDs:**
   ```
   ❌ Wrong: Use ID from documentation example
   ✅ Right: Get ID from GET endpoint first
   ```

3. **Verify test data exists:**
   ```bash
   # Run seed script
   psql -U your_username -d your_database -f database/seed/seed_data.sql
   ```

4. **Check Supabase Table Editor:**
   ```
   1. Go to Supabase dashboard
   2. Go to Table Editor
   3. Open articles/challenges table
   4. Verify data exists
   5. Copy actual IDs from table
   ```

**References:**
- [Public APIs Guide](public-apis.md) - How to get valid IDs
- [database/seed/seed_data.sql](../../database/seed/seed_data.sql)

---

## Swagger UI Issues

### Problem: Swagger UI Not Loading

**Symptoms:**
- http://localhost:8000/docs shows blank page
- 404 error on /docs
- Swagger UI doesn't render

**Root Cause:**
- Backend not running
- Wrong port number
- FastAPI docs disabled

**Solution:**

1. **Verify backend is running:**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Check correct URL:**
   ```
   ✅ Correct: http://localhost:8000/docs
   ❌ Wrong: http://localhost:3000/docs (frontend port)
   ❌ Wrong: http://localhost:8000/api/docs
   ```

3. **Check backend logs:**
   ```
   - Look for "Uvicorn running on http://127.0.0.1:8000"
   - Verify no startup errors
   ```

4. **Try alternative docs:**
   ```
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   ```

---

### Problem: Can't Execute Requests in Swagger UI

**Symptoms:**
- "Try it out" button doesn't work
- Execute button is grayed out
- No response after clicking Execute

**Root Cause:**
- Browser extension blocking requests
- CORS issues (shouldn't happen with Swagger)
- Backend not responding

**Solution:**

1. **Disable browser extensions:**
   ```
   - Try in incognito/private mode
   - Disable ad blockers
   - Disable security extensions
   ```

2. **Check browser console:**
   ```
   - Open DevTools (F12)
   - Go to Console tab
   - Look for JavaScript errors
   - Look for network errors
   ```

3. **Verify backend is responding:**
   ```bash
   # Test with curl
   curl http://localhost:8000/api/v1/articles
   ```

4. **Refresh Swagger UI:**
   ```
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache
   - Reopen Swagger UI
   ```

---

## General API Issues

### Problem: Slow API Responses

**Symptoms:**
- Requests take a long time to complete
- Timeout errors
- Swagger UI hangs

**Root Cause:**
- Database query performance issues
- Network latency to Supabase
- Backend not optimized

**Solution:**

1. **Check backend logs:**
   ```
   - Look for slow query warnings
   - Check for database connection issues
   ```

2. **Verify Supabase performance:**
   ```
   - Go to Supabase dashboard
   - Check database performance metrics
   - Look for slow queries
   ```

3. **Test with smaller datasets:**
   ```
   - Try endpoints with filters to reduce data
   - Example: GET /articles?category=fundamentals
   ```

4. **Check network connectivity:**
   ```bash
   # Test latency to Supabase
   ping your-project.supabase.co
   ```

---

### Problem: Inconsistent API Responses

**Symptoms:**
- Same request returns different results
- Data appears and disappears
- Caching issues

**Root Cause:**
- Database transactions not completing
- Caching layer issues
- Multiple backend instances

**Solution:**

1. **Verify single backend instance:**
   ```
   - Ensure only one backend server is running
   - Check for duplicate processes
   - Kill extra processes if found
   ```

2. **Clear browser cache:**
   ```
   - Hard refresh: Ctrl+Shift+R
   - Clear all browser cache
   - Try in incognito mode
   ```

3. **Check database consistency:**
   ```
   - Verify data in Supabase Table Editor
   - Check for pending transactions
   - Restart backend server
   ```

---

## Quick Reference: Common Error Codes

| Status Code | Meaning | Common Causes | Quick Fix |
|-------------|---------|---------------|-----------|
| **401** | Unauthorized | Missing/invalid token | Re-authorize in Swagger UI |
| **404** | Not Found | Invalid ID, resource doesn't exist | Get valid ID from GET endpoint |
| **422** | Validation Error | Invalid request data | Check request body format |
| **500** | Server Error | Database/backend issue | Check backend logs, verify config |

---

## Getting Help

If you've tried the solutions above and still have issues:

1. **Check backend logs:**
   ```
   - Look for error messages in backend console
   - Check for stack traces
   - Note any error codes
   ```

2. **Verify all prerequisites:**
   ```
   - Backend running on port 8000
   - Frontend running on port 3000
   - Database seeded with test data
   - Supabase configured correctly
   ```

3. **Review documentation:**
   - [README](README.md) - Testing overview
   - [Authentication Flow](authentication-flow.md) - Token extraction
   - [AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md) - Supabase setup
   - [backend/CONFIGURATION_SETUP.md](../../backend/CONFIGURATION_SETUP.md) - Backend config

4. **Test with minimal setup:**
   ```
   - Start with public endpoints (no auth required)
   - Verify those work before testing protected endpoints
   - Isolate the issue to specific endpoints
   ```

---

**Last Updated:** 2024  
**Maintained By:** Prompt Dairy Development Team
