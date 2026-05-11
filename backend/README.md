# Prompt Dairy — Backend API

FastAPI backend for the Prompt Dairy platform with Supabase authentication.

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Before running the server, you need to configure Supabase authentication:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   JWT_SECRET=your-supabase-jwt-secret-here
   JWT_ALGORITHM=HS256
   ```

**Where to get these values:**
- Go to your [Supabase project dashboard](https://app.supabase.com)
- Navigate to Settings > API
- Copy the Project URL, anon key, service_role key, and JWT Secret

**⚠️ Important:** The `JWT_SECRET` must exactly match your Supabase project's JWT secret.

**Need help?** See the complete setup guides:
- [../AUTHENTICATION_SETUP.md](../AUTHENTICATION_SETUP.md) — Complete authentication setup
- [CONFIGURATION_SETUP.md](./CONFIGURATION_SETUP.md) — Backend configuration details

## Run

```bash
uvicorn app.main:app --reload
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

### Required for Authentication

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard > Settings > API |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin) | Supabase Dashboard > Settings > API |
| `JWT_SECRET` | Supabase JWT secret for token validation | Supabase Dashboard > Settings > API > JWT Settings |
| `JWT_ALGORITHM` | JWT signing algorithm (use `HS256`) | Set to `HS256` |

### Optional Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | `Prompt Dairy` |
| `APP_ENV` | Environment (development/production) | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration time | `60` |
| `DATABASE_URL` | PostgreSQL connection string | — |

See `.env.example` for all available variables.

## Configuration Validation

The backend automatically validates configuration on startup:

- ✅ Checks that all required Supabase variables are set
- ✅ Detects placeholder values (e.g., "your-supabase-url")
- ✅ Validates JWT configuration
- ✅ Issues clear warning messages for any issues

If you see warnings on startup, check [CONFIGURATION_SETUP.md](./CONFIGURATION_SETUP.md) for troubleshooting.

## Testing

Run the test suite:

```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app

# Run specific test file
python -m pytest tests/test_auth_dependency.py -v
```

### Test Files

- `tests/test_config.py` — Configuration validation tests
- `tests/test_jwt_validation.py` — JWT token validation tests
- `tests/test_auth_dependency.py` — Protected endpoint dependency tests
- `tests/test_protected_endpoint.py` — End-to-end authentication tests

## Project Structure

```
app/
├── main.py          # App entry point
├── api/v1/          # API endpoints
├── core/            # Config & security
├── db/              # Database session
├── models/          # ORM models
├── schemas/         # Request/response schemas
└── services/        # Business logic
```
