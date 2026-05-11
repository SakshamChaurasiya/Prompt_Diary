# Supabase Authentication Setup Guide

This guide walks you through setting up Supabase authentication for the Prompt Dairy application, including email/password authentication and OAuth providers (Google and GitHub).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Configure Environment Variables](#configure-environment-variables)
4. [Configure OAuth Providers](#configure-oauth-providers)
5. [Verify Setup](#verify-setup)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A [Supabase account](https://supabase.com) (free tier is sufficient)
- A Google Cloud account (for Google OAuth)
- A GitHub account (for GitHub OAuth)
- Node.js 18+ and Python 3.10+ installed

---

## Create Supabase Project

### 1. Sign up for Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign in with GitHub
3. Create a new organization (or use an existing one)

### 2. Create a New Project

1. Click "New Project"
2. Fill in the project details:
   - **Name**: `prompt-dairy` (or your preferred name)
   - **Database Password**: Generate a strong password (save this securely)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be provisioned

### 3. Get Your API Credentials

Once your project is ready:

1. Go to **Settings** > **API** in the left sidebar
2. You'll see the following values in the "Project API keys" section:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: A long JWT token starting with `eyJ...`
   - **service_role key**: Another JWT token (keep this secret!)

3. Scroll down to **JWT Settings** section:
   - **JWT Secret**: A long string used to sign tokens (keep this secret!)

**Keep these values handy** — you'll need them in the next step.

---

## Configure Environment Variables

### Frontend Configuration

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Create a `.env.local` file from the example:
   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` and replace the placeholder values:
   ```env
   # Replace with your actual Supabase project URL
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   
   # Replace with your actual Supabase anon key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **Where to find these values:**
   - Supabase Dashboard > Settings > API > Project URL
   - Supabase Dashboard > Settings > API > Project API keys > `anon` `public`

### Backend Configuration

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and replace the placeholder values:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # JWT Configuration (MUST match Supabase JWT secret)
   JWT_SECRET=your-supabase-jwt-secret-here
   JWT_ALGORITHM=HS256
   ```

   **Where to find these values:**
   - `SUPABASE_URL`: Supabase Dashboard > Settings > API > Project URL
   - `SUPABASE_ANON_KEY`: Supabase Dashboard > Settings > API > `anon` `public` key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard > Settings > API > `service_role` `secret` key
   - `JWT_SECRET`: Supabase Dashboard > Settings > API > JWT Settings > JWT Secret

   **⚠️ IMPORTANT:** The `JWT_SECRET` must exactly match your Supabase project's JWT secret, or token validation will fail.

---

## Configure OAuth Providers

### Google OAuth Setup

#### 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - **User Type**: External (for testing) or Internal (for organization use)
   - **App name**: Prompt Dairy
   - **User support email**: Your email
   - **Developer contact**: Your email
   - Click **Save and Continue**
   - Skip scopes (default scopes are sufficient)
   - Add test users if using External type
6. Back in **Credentials**, click **Create Credentials** > **OAuth client ID**
7. Select **Application type**: Web application
8. **Name**: Prompt Dairy
9. **Authorized redirect URIs**: Add the following URLs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
   Replace `your-project-id` with your actual Supabase project ID.

10. Click **Create**
11. Copy the **Client ID** and **Client Secret** (you'll need these next)

#### 2. Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers** in the left sidebar
3. Find **Google** in the list and click to expand
4. Toggle **Enable Sign in with Google** to ON
5. Paste your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
6. Click **Save**

#### 3. Add Redirect URL to Google

1. Copy the callback URL from Supabase (shown in the Google provider settings)
2. Go back to Google Cloud Console > Credentials
3. Edit your OAuth client
4. Ensure the Supabase callback URL is in **Authorized redirect URIs**:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
5. Click **Save**

### GitHub OAuth Setup

#### 1. Create GitHub OAuth Application

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** in the left sidebar
3. Click **New OAuth App**
4. Fill in the application details:
   - **Application name**: Prompt Dairy
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: 
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
     Replace `your-project-id` with your actual Supabase project ID.
5. Click **Register application**
6. On the next page, click **Generate a new client secret**
7. Copy the **Client ID** and **Client Secret** (you'll need these next)

#### 2. Configure GitHub OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers** in the left sidebar
3. Find **GitHub** in the list and click to expand
4. Toggle **Enable Sign in with GitHub** to ON
5. Paste your GitHub OAuth credentials:
   - **Client ID**: From GitHub OAuth App settings
   - **Client Secret**: From GitHub OAuth App settings
6. Click **Save**

### Production OAuth Setup

When deploying to production, you'll need to:

1. **Update OAuth redirect URIs** in both Google Cloud Console and GitHub OAuth App settings:
   ```
   https://your-production-domain.com/auth/callback
   ```

2. **Update Supabase Site URL**:
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Set **Site URL** to your production domain: `https://your-production-domain.com`

3. **Update Redirect URLs**:
   - Add your production domain to **Redirect URLs** list

4. **Google OAuth Consent Screen**:
   - If using "External" user type, publish your app for production use
   - Complete the OAuth consent screen verification process

---

## Verify Setup

### 1. Start the Backend

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

**Check for warnings:**
- If configuration is correct, you should see no warnings
- If you see warnings about Supabase or JWT configuration, review the [Troubleshooting](#troubleshooting) section

Backend should be running at: `http://localhost:8000`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend should be running at: `http://localhost:3000`

### 3. Test Authentication

1. **Test Email/Password Signup:**
   - Go to `http://localhost:3000/signup`
   - Enter an email and password (minimum 6 characters)
   - Click "Sign Up"
   - Check your email for a confirmation link (if email confirmation is enabled)
   - You should be redirected to the dashboard

2. **Test Email/Password Login:**
   - Go to `http://localhost:3000/login`
   - Enter your credentials
   - Click "Sign In"
   - You should be redirected to the dashboard

3. **Test Google OAuth:**
   - Go to `http://localhost:3000/login`
   - Click "Continue with Google"
   - Authenticate with your Google account
   - You should be redirected to the dashboard

4. **Test GitHub OAuth:**
   - Go to `http://localhost:3000/login`
   - Click "Continue with GitHub"
   - Authenticate with your GitHub account
   - You should be redirected to the dashboard

5. **Test Protected Routes:**
   - While logged in, navigate to `http://localhost:3000/dashboard`
   - You should see the dashboard content
   - Sign out using the sign out button
   - Try accessing `http://localhost:3000/dashboard` again
   - You should be redirected to the login page

6. **Test Backend Token Validation:**
   - Open your browser's developer tools (F12)
   - Go to the Network tab
   - Make a request to a protected backend endpoint
   - Check that the `Authorization` header contains your JWT token
   - Verify the backend returns data (not a 401 error)

---

## Troubleshooting

### Frontend Issues

#### "Authentication is unavailable"

**Cause:** Supabase environment variables are not configured or set to placeholder values.

**Solution:**
1. Check that `frontend/.env.local` exists
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Ensure values are not placeholders like "your-project-id"
4. Restart the Next.js development server after changing `.env.local`

#### OAuth redirect fails with "Invalid redirect URL"

**Cause:** The redirect URL is not whitelisted in Supabase or OAuth provider settings.

**Solution:**
1. **Supabase**: Go to Authentication > URL Configuration > Redirect URLs
2. Add `http://localhost:3000/auth/callback` for development
3. **Google**: Add the Supabase callback URL to Authorized redirect URIs in Google Cloud Console
4. **GitHub**: Add the Supabase callback URL to Authorization callback URL in GitHub OAuth App settings

#### "Failed to exchange code for session"

**Cause:** OAuth provider credentials are incorrect or not configured in Supabase.

**Solution:**
1. Verify Client ID and Client Secret in Supabase match your OAuth provider
2. Check that the OAuth provider is enabled in Supabase (toggle should be ON)
3. Ensure the OAuth app is not in "development mode" or restricted to specific users

### Backend Issues

#### Warning: "Supabase is not properly configured"

**Cause:** One or more Supabase environment variables are missing or set to placeholder values.

**Solution:**
1. Check that `backend/.env` exists
2. Verify all three variables are set: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Ensure values are not placeholders like "your-supabase-url"
4. Copy actual values from Supabase Dashboard > Settings > API

#### Warning: "JWT_SECRET is not properly configured"

**Cause:** JWT_SECRET is missing or set to a placeholder value.

**Solution:**
1. Get your JWT secret from Supabase Dashboard > Settings > API > JWT Settings
2. Set `JWT_SECRET` in `backend/.env` to the actual value
3. Ensure it matches your Supabase project's JWT secret exactly
4. Do not use placeholder values like "dev-secret-change-in-production"

#### 401 Unauthorized on protected endpoints

**Cause:** JWT token validation is failing.

**Solution:**
1. Verify `JWT_SECRET` in backend `.env` matches Supabase JWT secret exactly
2. Check that `JWT_ALGORITHM` is set to `HS256`
3. Ensure the frontend is sending the token in the `Authorization` header
4. Check that the token is not expired (default: 60 minutes)
5. Verify the user is logged in on the frontend

#### "Token signature verification failed"

**Cause:** JWT_SECRET does not match Supabase project's JWT secret.

**Solution:**
1. Go to Supabase Dashboard > Settings > API > JWT Settings
2. Copy the JWT Secret value
3. Update `JWT_SECRET` in `backend/.env` to match exactly
4. Restart the backend server

### Email Confirmation Issues

#### Confirmation emails not being sent

**Cause:** Email confirmation is enabled but email provider is not configured.

**Solution:**
1. **For development**: Disable email confirmation in Supabase
   - Go to Authentication > Settings
   - Toggle "Enable email confirmations" to OFF
2. **For production**: Configure a custom SMTP provider
   - Go to Authentication > Settings > SMTP Settings
   - Configure your email provider (SendGrid, Mailgun, etc.)

#### Confirmation link redirects to wrong URL

**Cause:** Site URL is not configured correctly in Supabase.

**Solution:**
1. Go to Authentication > URL Configuration
2. Set **Site URL** to your application URL:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

### General Issues

#### Changes to .env files not taking effect

**Solution:**
- **Frontend**: Restart the Next.js development server (`npm run dev`)
- **Backend**: Restart the FastAPI server (`uvicorn app.main:app --reload`)
- Environment variables are loaded at startup, not dynamically

#### "CORS error" when calling backend from frontend

**Solution:**
1. Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Verify CORS middleware is configured in `backend/app/main.py`
3. Ensure you're using the correct backend URL in frontend API calls

---

## Security Best Practices

### Development

1. **Never commit `.env` or `.env.local` files** to version control
2. **Use different Supabase projects** for development, staging, and production
3. **Keep service role key secret** — never expose it in frontend code
4. **Use test OAuth apps** for development (separate from production)

### Production

1. **Rotate keys regularly** — change Supabase keys and JWT secrets periodically
2. **Enable Row Level Security (RLS)** on all database tables
3. **Use HTTPS only** — OAuth providers require HTTPS for production
4. **Configure email provider** — use a reliable SMTP service for production emails
5. **Monitor authentication logs** — check Supabase logs for suspicious activity
6. **Set up rate limiting** — protect against brute force attacks
7. **Enable MFA** — consider enabling multi-factor authentication for sensitive operations

### Environment Variables

1. **Use environment-specific secrets** — production secrets should be unique and strong
2. **Store secrets securely** — use secret management services (AWS Secrets Manager, etc.)
3. **Limit access** — only authorized team members should have access to production secrets
4. **Document secret rotation** — maintain a process for rotating compromised secrets

---

## Additional Resources

### Supabase Documentation

- [Supabase Auth Overview](https://supabase.com/docs/guides/auth)
- [Server-Side Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [OAuth Providers](https://supabase.com/docs/guides/auth/social-login)
- [JWT Tokens](https://supabase.com/docs/guides/auth/jwts)

### OAuth Provider Documentation

- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

### Backend Configuration

- See `backend/CONFIGURATION_SETUP.md` for detailed backend configuration documentation
- See `backend/.env.example` for all available environment variables

---

## Requirements Mapping

This setup guide satisfies the following requirements from the specification:

- **Requirement 9.1**: Frontend reads Supabase URL and anonymous key from environment variables
- **Requirement 9.2**: Backend reads Supabase URL, anonymous key, and service role key from environment variables
- **Requirement 9.3**: Frontend gracefully disables authentication when not configured
- **Requirement 9.4**: Backend returns appropriate errors when not configured
- **Requirement 9.5**: System validates environment variables are not placeholder values
- **Requirement 9.6**: Backend reads JWT secret and algorithm from environment variables
- **Requirement 9.7**: Backend uses configured JWT settings to validate tokens

Additionally, this guide provides instructions for:
- Setting up Google OAuth (Requirement 2)
- Setting up GitHub OAuth (Requirement 3)
- Configuring email/password authentication (Requirement 1)
- Verifying the complete authentication system works end-to-end
