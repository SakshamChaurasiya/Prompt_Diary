# API Testing Documentation

Welcome to the Prompt Dairy API testing documentation. This guide will help you manually test all backend API endpoints through Swagger UI, understand authentication flows, and optionally automate tests.

## Quick Start

Get started testing APIs in 3 simple steps:

### 1. Start the Backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`

### 2. Open Swagger UI

Navigate to the interactive API documentation:

**Swagger UI:** `http://localhost:8000/docs`

### 3. Test Endpoints

- **Public APIs**: Click any endpoint → "Try it out" → Execute
- **Protected APIs**: First authorize with a JWT token (see [Authentication Flow](authentication-flow.md))

## Prerequisites

Before testing, ensure the following are set up:

- [ ] **Backend running** on `http://localhost:8000`
- [ ] **Database configured** with Supabase credentials (see [CONFIGURATION_SETUP.md](../../backend/CONFIGURATION_SETUP.md))
- [ ] **Database seeded** with test data (run `python backend/setup_database.py`)
- [ ] **Frontend running** on `http://localhost:3000` (required for authentication testing)
- [ ] **Supabase authentication** configured (see [AUTHENTICATION_SETUP.md](../../AUTHENTICATION_SETUP.md))

## Documentation Navigation

### Core Testing Guides

| Guide | Description | When to Use |
|-------|-------------|-------------|
| [Authentication Flow](authentication-flow.md) | JWT token extraction and Swagger authorization | Before testing any protected endpoints |
| [Public APIs](public-apis.md) | Testing endpoints without authentication | Testing articles, challenges, roadmaps, search, playground |
| [Protected APIs](protected-apis.md) | Testing authenticated endpoints | Testing user profile, user progress tracking |
| [Error Scenarios](error-scenarios.md) | Testing error handling (401, 404, 422, 500) | Validating proper error responses |
| [User Progress Flow](user-progress-flow.md) | End-to-end progress tracking workflow | Testing complete learning tracking system |

### Additional Resources

| Resource | Description |
|----------|-------------|
| [Troubleshooting](troubleshooting.md) | Common issues and solutions |
| [Automated Testing](automated-testing.md) | Optional pytest-based test scripts |
| [API Reference](../api.md) | Complete API endpoint reference |

## Testing Workflow

### For Public APIs

1. Open Swagger UI at `http://localhost:8000/docs`
2. Navigate to the endpoint section (Articles, Challenges, etc.)
3. Click the endpoint → "Try it out"
4. Fill in any query parameters (optional)
5. Click "Execute"
6. Verify the response status and data

**Example:** Testing GET /api/v1/articles
- No authentication required
- Can filter by category and difficulty
- Returns array of articles

### For Protected APIs

1. **Get JWT Token** (one-time setup):
   - Navigate to `http://localhost:3000/login`
   - Sign up or log in
   - Extract JWT token from browser DevTools (see [Authentication Flow](authentication-flow.md))

2. **Authorize in Swagger**:
   - Click "Authorize" button (top right in Swagger UI)
   - Enter: `Bearer YOUR_ACCESS_TOKEN`
   - Click "Authorize" then "Close"

3. **Test Endpoints**:
   - Navigate to protected endpoint (Auth, User Progress)
   - Click "Try it out" → Execute
   - Verify authenticated response

**Example:** Testing GET /api/v1/auth/me
- Requires JWT token authorization
- Returns current user profile
- Returns 401 if not authorized

## API Categories

### Public Endpoints (No Authentication)

- **Articles**: List, filter, and retrieve articles
- **Challenges**: List, filter, and retrieve coding challenges
- **Roadmaps**: List and retrieve learning roadmaps
- **Search**: Search across all content types
- **Playground**: List AI models and run prompts

### Protected Endpoints (JWT Required)

- **Authentication**: Get user profile, update profile, check auth status
- **User Progress**: Track article and challenge completion, view stats

## Test Data

The database seed script (`database/seed/seed_data.sql`) provides test data:

- **Articles**: Multiple articles with different categories and difficulties
- **Challenges**: Coding challenges with varying difficulty levels
- **Roadmaps**: Learning paths for different skill levels

To get valid IDs for testing:
1. Use GET endpoints to retrieve lists (e.g., GET /api/v1/articles)
2. Copy IDs from the response
3. Use those IDs in POST/PUT requests

## Common Testing Scenarios

### Scenario 1: Test Article Filtering

```
1. GET /api/v1/articles (all articles)
2. GET /api/v1/articles?category=fundamentals (filtered)
3. GET /api/v1/articles?difficulty=beginner (filtered)
4. Verify filtered results match criteria
```

### Scenario 2: Test User Progress Tracking

```
1. Authorize with JWT token
2. GET /api/v1/user-progress (initial state)
3. POST /api/v1/user-progress/article (mark completed)
4. GET /api/v1/user-progress (verify updated)
5. GET /api/v1/user-progress/stats (check stats)
```

### Scenario 3: Test Error Handling

```
1. Call protected endpoint without token (expect 401)
2. Call endpoint with invalid ID (expect 404)
3. Send invalid data format (expect 422)
4. Verify error messages are descriptive
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Paginated Response

```json
{
  "success": true,
  "items": [ ... ],
  "total": 42,
  "page": 1,
  "page_size": 10
}
```

## Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | Success | Request completed successfully |
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Invalid request data |
| 500 | Server Error | Internal server error |

## Next Steps

1. **New to API testing?** Start with [Public APIs](public-apis.md) to test endpoints without authentication
2. **Need authentication?** Follow the [Authentication Flow](authentication-flow.md) guide to get your JWT token
3. **Testing protected endpoints?** See [Protected APIs](protected-apis.md) for user profile and progress tracking
4. **Encountering errors?** Check [Troubleshooting](troubleshooting.md) for common issues and solutions
5. **Want to automate?** See [Automated Testing](automated-testing.md) for pytest examples

## Related Documentation

- **[API Reference](../api.md)**: Complete endpoint documentation with request/response formats
- **[Authentication Setup](../../AUTHENTICATION_SETUP.md)**: Supabase authentication configuration guide
- **[Configuration Setup](../../backend/CONFIGURATION_SETUP.md)**: Backend environment variable configuration
- **[Database Setup](../../database/README.md)**: Database schema and seed data information

## Support

If you encounter issues not covered in the troubleshooting guide:

1. Check that all prerequisites are met
2. Verify environment variables are configured correctly
3. Review the [Troubleshooting](troubleshooting.md) guide
4. Check backend logs for error messages
5. Consult the [API Reference](../api.md) for endpoint specifications

---

**Last Updated:** 2024
**Maintained By:** Prompt Dairy Development Team
