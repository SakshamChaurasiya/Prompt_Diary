# Backend Configuration Setup Guide

## Overview

This guide explains the backend configuration for Supabase authentication integration. The configuration system validates environment variables and provides clear feedback when values are missing or set to placeholder values.

## Configuration File

The main configuration is in `backend/app/core/config.py`. It uses `pydantic-settings` to load environment variables from a `.env` file.

## Required Environment Variables

### Supabase Configuration

These values are required for Supabase authentication to work:

- **SUPABASE_URL**: Your Supabase project URL (e.g., `https://abc123.supabase.co`)
- **SUPABASE_ANON_KEY**: Your Supabase anonymous/public key
- **SUPABASE_SERVICE_ROLE_KEY**: Your Supabase service role key (for admin operations)

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the values from the "Project API keys" section

### JWT Configuration

These values are required for validating Supabase JWT tokens:

- **JWT_SECRET**: Your Supabase project's JWT secret (MUST match Supabase)
- **JWT_ALGORITHM**: Should be set to `HS256` (Supabase default)
- **ACCESS_TOKEN_EXPIRE_MINUTES**: Token expiration time (default: 60 minutes)

**Where to find JWT_SECRET:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Scroll down to "JWT Settings"
4. Copy the "JWT Secret" value

## Configuration Validation

The configuration system includes automatic validation that runs on application startup:

### Validation Methods

1. **`is_supabase_configured()`**: Checks if all Supabase environment variables are set and not placeholder values
2. **`is_jwt_configured()`**: Checks if JWT_SECRET is set and not a placeholder value
3. **`validate_configuration()`**: Runs all validations and issues warnings for any issues

### Placeholder Detection

The system detects common placeholder values and treats them as invalid:

**Supabase placeholders:**
- Empty strings
- "your-supabase-url"
- "your-supabase-anon-key"
- "your-supabase-service-role-key"
- "your-project-url"
- "your-anon-key"
- "your-service-role-key"

**JWT placeholders:**
- Empty strings
- "dev-secret-change-in-production"
- "your-jwt-secret"
- "change-me"
- "secret"

### Warning Messages

When configuration issues are detected, the system issues clear warning messages:

```
UserWarning: Supabase is not properly configured. Authentication features will be unavailable. 
Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY environment variables with valid values.
```

```
UserWarning: JWT_SECRET is not properly configured. Token validation will fail. 
Please set JWT_SECRET environment variable to your Supabase project's JWT secret.
```

## Setup Instructions

### 1. Create .env File

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

### 2. Configure Supabase Values

Edit `.env` and replace the placeholder values with your actual Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Configure JWT Secret

**IMPORTANT:** The JWT_SECRET must match your Supabase project's JWT secret exactly:

```env
JWT_SECRET=your-actual-supabase-jwt-secret-here
JWT_ALGORITHM=HS256
```

### 4. Verify Configuration

Start the application and check for warning messages:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

If configuration is correct, you should see no warnings. If there are issues, you'll see clear warning messages indicating what needs to be fixed.

## Testing

Unit tests are provided in `backend/tests/test_config.py` to verify configuration validation:

```bash
cd backend
python -m pytest tests/test_config.py -v
```

### Test Coverage

The tests verify:
- Valid configuration is detected correctly
- Empty values are detected
- Placeholder values are detected
- JWT algorithm warnings work correctly
- Validation methods issue appropriate warnings

## Usage in Code

### Accessing Configuration

```python
from app.core.config import settings

# Access configuration values
supabase_url = settings.SUPABASE_URL
jwt_secret = settings.JWT_SECRET

# Check if Supabase is configured
if settings.is_supabase_configured():
    # Initialize Supabase client
    pass
else:
    # Handle missing configuration
    pass
```

### Validation on Startup

The configuration is automatically validated when the module is loaded. You can also manually validate:

```python
from app.core.config import settings

settings.validate_configuration()
```

## Security Best Practices

1. **Never commit .env files**: The `.env` file is in `.gitignore` to prevent accidental commits
2. **Use different values per environment**: Development, staging, and production should have separate Supabase projects
3. **Rotate keys regularly**: Periodically rotate your Supabase keys and JWT secrets
4. **Protect service role key**: The service role key has admin privileges - never expose it to the frontend
5. **Use environment-specific secrets**: Production JWT secrets should be strong and unique

## Troubleshooting

### Warning: "Supabase is not properly configured"

**Cause:** One or more Supabase environment variables are missing or set to placeholder values.

**Solution:**
1. Check that `.env` file exists in the `backend` directory
2. Verify all three Supabase variables are set: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Ensure values are not placeholder strings like "your-supabase-url"
4. Copy actual values from your Supabase project dashboard

### Warning: "JWT_SECRET is not properly configured"

**Cause:** JWT_SECRET is missing or set to a placeholder value.

**Solution:**
1. Get your JWT secret from Supabase Dashboard > Settings > API > JWT Settings
2. Set `JWT_SECRET` in `.env` to the actual value
3. Ensure it's not set to "dev-secret-change-in-production" or similar placeholders

### Warning: "JWT_ALGORITHM is set to 'X' but Supabase uses 'HS256'"

**Cause:** JWT_ALGORITHM is set to a value other than HS256.

**Solution:**
1. Set `JWT_ALGORITHM=HS256` in your `.env` file
2. Supabase uses HS256 for JWT signing - other algorithms will fail validation

## Requirements Mapping

This configuration implementation satisfies the following requirements from the spec:

- **Requirement 9.2**: Backend reads Supabase URL, anonymous key, and service role key from environment variables
- **Requirement 9.6**: Backend reads JWT secret and algorithm from environment variables
- **Requirement 9.7**: Backend uses configured JWT settings to validate Supabase tokens

Additionally, it implements validation to ensure environment variables are not placeholder values, which supports:

- **Requirement 9.5**: Auth system validates that environment variables are not placeholder values
