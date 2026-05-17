# Design Document: API Testing Documentation

## Overview

This design specifies a comprehensive API testing documentation system for the Prompt Dairy FastAPI backend. The system will provide developers and QA engineers with clear, actionable documentation for manually testing all API endpoints through Swagger UI, understanding authentication flows, and optionally automating tests.

### Goals

1. **Enable Manual Testing**: Provide step-by-step guides for testing all public and protected APIs through Swagger UI
2. **Clarify Authentication**: Document the complete JWT token extraction and usage workflow for protected endpoints
3. **Standardize Test Scenarios**: Define consistent test cases with request formats, expected responses, and validation criteria
4. **Support Automation**: Provide optional pytest-based test script examples for regression testing
5. **Facilitate Troubleshooting**: Document common testing issues and their solutions

### Non-Goals

- Automated test execution infrastructure (CI/CD pipelines)
- Performance or load testing documentation
- Frontend testing documentation
- Database schema testing

## Architecture

### Documentation Structure

The API testing documentation will be organized as a multi-file system within the `docs/` directory:

```
docs/
├── api.md                          # Existing API reference (unchanged)
├── testing/
│   ├── README.md                   # Testing overview and quick start
│   ├── authentication-flow.md      # JWT token extraction and usage
│   ├── public-apis.md              # Public endpoint testing guide
│   ├── protected-apis.md           # Protected endpoint testing guide
│   ├── error-scenarios.md          # Error handling test cases
│   ├── user-progress-flow.md       # End-to-end progress tracking tests
│   ├── troubleshooting.md          # Common issues and solutions
│   └── automated-testing.md        # Optional pytest script examples
```

### Integration Points

1. **Existing Documentation**: Links to `docs/api.md`, `AUTHENTICATION_SETUP.md`, `backend/CONFIGURATION_SETUP.md`
2. **Swagger UI**: Primary testing interface at `http://localhost:8000/docs`
3. **Existing Tests**: References to `backend/tests/` directory for automation examples
4. **Seed Data**: References to `database/seed/seed_data.sql` for test data IDs

## Components and Interfaces

### 1. Testing Overview (README.md)

**Purpose**: Entry point for all API testing documentation

**Content Structure**:
- Quick start guide (3-step process: start backend, open Swagger, test endpoints)
- Documentation navigation map
- Prerequisites checklist (backend running, database seeded, frontend for auth)
- Links to detailed guides

**Interface**: Markdown document with navigation links

### 2. Authentication Flow Guide (authentication-flow.md)

**Purpose**: Complete JWT token extraction and usage workflow

**Content Structure**:
- Authentication overview (Supabase Auth, JWT tokens)
- Step-by-step token extraction:
  1. Navigate to `http://localhost:3000/login`
  2. Sign up or log in
  3. Open DevTools (F12) → Application tab → Local Storage
  4. Find key matching pattern `sb-*-auth-token`
  5. Copy `access_token` value from JSON object
- Swagger UI authorization:
  1. Click "Authorize" button (top right)
  2. Enter `Bearer YOUR_ACCESS_TOKEN`
  3. Click "Authorize" then "Close"
- Token expiration and re-authentication
- Alternative extraction methods (Network tab, Console)

**Interface**: Markdown with screenshots/detailed descriptions

### 3. Public APIs Testing Guide (public-apis.md)

**Purpose**: Testing guide for endpoints requiring no authentication

**Content Structure**:

For each endpoint category:
- **Articles** (`/api/v1/articles`)
  - List all articles (with category/difficulty filters)
  - Get article by ID
  - Get article by slug
  - System design articles
- **Challenges** (`/api/v1/challenges`)
  - List all challenges (with difficulty/category filters)
  - Get challenge by ID
- **Roadmaps** (`/api/v1/roadmaps`)
  - List all roadmaps (with level filter)
  - Get roadmap by ID
- **Search** (`/api/v1/search`)
  - Search with query parameter
  - Filter by type
- **Playground** (`/api/v1/playground`)
  - List models
  - Run prompt (works without auth, optional with auth)

**Test Scenario Format**:
```markdown
### GET /api/v1/articles

**Request Format**:
- Method: GET
- Query Parameters:
  - `category` (optional): fundamentals | techniques | architecture
  - `difficulty` (optional): beginner | intermediate | advanced

**Test Steps**:
1. Navigate to Swagger UI → Articles section
2. Click GET /api/v1/articles → "Try it out"
3. Leave parameters empty → Execute
4. Verify 200 status, array of articles returned

**Expected Response**:
```json
{
  "success": true,
  "articles": [
    {
      "id": "uuid",
      "title": "string",
      "category": "fundamentals",
      "difficulty": "beginner",
      ...
    }
  ]
}
```

**Validation**:
- Status code: 200
- Response contains `success: true`
- Articles array is present
- Each article has required fields

**Filter Test**:
1. Set `category` = "fundamentals"
2. Execute
3. Verify all returned articles have `category: "fundamentals"`
```

**Interface**: Markdown with structured test scenarios

### 4. Protected APIs Testing Guide (protected-apis.md)

**Purpose**: Testing guide for endpoints requiring JWT authentication

**Content Structure**:

For each endpoint category:
- **Authentication** (`/api/v1/auth`)
  - GET /auth/me (get current user profile)
  - PUT /auth/profile (update profile)
  - GET /auth/status (check auth status)
- **User Progress** (`/api/v1/user-progress`)
  - GET /user-progress (get all progress)
  - POST /user-progress/article (mark article completed)
  - POST /user-progress/challenge (mark challenge completed)
  - GET /user-progress/stats (get aggregated stats)

**Test Scenario Format** (includes authorization):
```markdown
### GET /api/v1/auth/me

**Prerequisites**:
- JWT token obtained (see authentication-flow.md)
- Swagger UI authorized with Bearer token

**Request Format**:
- Method: GET
- Headers: Authorization: Bearer YOUR_ACCESS_TOKEN

**Test Steps**:
1. Ensure you're authorized in Swagger UI
2. Navigate to Authentication section
3. Click GET /auth/me → "Try it out" → Execute
4. Verify 200 status, user profile returned

**Expected Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "authenticated",
    "profile": {
      "id": "uuid",
      "username": "string",
      "display_name": "string",
      "bio": "string",
      "avatar_url": "string"
    }
  }
}
```

**Validation**:
- Status code: 200
- User ID matches token subject
- Email is present
- Profile object exists (may be null for new users)
```

**Interface**: Markdown with structured test scenarios

### 5. Error Scenarios Guide (error-scenarios.md)

**Purpose**: Comprehensive error handling test cases

**Content Structure**:

Organized by error type:

**401 Unauthorized Errors**:
- Missing Authorization header
- Invalid token format
- Expired token
- Malformed Bearer token

**404 Not Found Errors**:
- Non-existent article ID
- Non-existent challenge ID
- Non-existent roadmap ID
- Invalid slug

**422 Validation Errors**:
- Invalid profile update data
- Missing required fields
- Invalid data types
- Invalid enum values

**500 Internal Server Errors**:
- Database connection failure
- Supabase client error

**Test Scenario Format**:
```markdown
### 401: Missing Authorization Header

**Endpoint**: GET /api/v1/auth/me

**Test Steps**:
1. In Swagger UI, click "Authorize" → "Logout" (if authorized)
2. Navigate to GET /auth/me → "Try it out" → Execute

**Expected Response**:
```json
{
  "detail": "Authorization header missing"
}
```

**Validation**:
- Status code: 401
- Error message indicates missing header
```

**Interface**: Markdown with error-specific test scenarios

### 6. User Progress Flow Guide (user-progress-flow.md)

**Purpose**: End-to-end testing workflow for learning progress tracking

**Content Structure**:

Sequential test flow:
1. **Initial State Check**: GET /user-progress (expect empty)
2. **Mark Article Completed**: POST /user-progress/article
3. **Verify Article Progress**: GET /user-progress (expect 1 article)
4. **Mark Challenge Completed**: POST /user-progress/challenge
5. **Verify Challenge Progress**: GET /user-progress (expect 1 challenge)
6. **Check Stats**: GET /user-progress/stats (verify level calculation)
7. **Test Idempotency**: POST same article again (no duplicate)
8. **Verify Final State**: GET /user-progress (still 1 article)

**Test Scenario Format**:
```markdown
### Step 1: Check Initial State

**Endpoint**: GET /api/v1/user-progress

**Prerequisites**: Authorized with JWT token

**Test Steps**:
1. Execute GET /user-progress
2. Verify empty progress for new user

**Expected Response**:
```json
{
  "success": true,
  "progress": {
    "articles_completed": 0,
    "articles": [],
    "challenges_completed": 0,
    "challenges": [],
    "total_points": 0
  }
}
```

### Step 2: Mark Article Completed

**Endpoint**: POST /api/v1/user-progress/article

**Request Body**:
```json
{
  "article_id": "VALID_ARTICLE_ID_FROM_SEED_DATA"
}
```

**Test Steps**:
1. Get valid article ID from GET /articles
2. Execute POST /user-progress/article with article_id
3. Verify success response

**Expected Response**:
```json
{
  "success": true,
  "message": "Article marked as completed"
}
```

[Continue with remaining steps...]
```

**Interface**: Markdown with sequential workflow

### 7. Troubleshooting Guide (troubleshooting.md)

**Purpose**: Common issues and step-by-step solutions

**Content Structure**:

Organized by problem category:

**Authentication Issues**:
- Problem: Can't find JWT token in Local Storage
  - Solution: Check Application tab, look for `sb-*-auth-token` pattern
  - Alternative: Network tab → filter "auth" → check response
- Problem: Swagger authorization fails
  - Solution: Ensure "Bearer " prefix (with space)
  - Check token hasn't expired (re-login if needed)

**CORS Issues**:
- Problem: CORS errors in browser console
  - Solution: Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
  - Check backend CORS configuration in `main.py`

**Database Issues**:
- Problem: Empty responses or "not found" errors
  - Solution: Run migrations: `python backend/setup_database.py`
  - Run seed script: `psql -f database/seed/seed_data.sql`
  - Reference: `backend/CONFIGURATION_SETUP.md`

**Supabase Issues**:
- Problem: Authentication fails
  - Solution: Check `.env` variables (SUPABASE_URL, keys)
  - Reference: `AUTHENTICATION_SETUP.md`
  - Verify Supabase project is active

**Test Data Issues**:
- Problem: Invalid article/challenge IDs
  - Solution: Use GET endpoints to retrieve valid IDs
  - Check seed data was loaded successfully

**Format**:
```markdown
## Problem: [Issue Description]

**Symptoms**:
- [Observable behavior]
- [Error messages]

**Root Cause**:
[Explanation of why this happens]

**Solution**:
1. [Step-by-step resolution]
2. [Verification steps]

**References**:
- [Link to related documentation]
```

**Interface**: Markdown with problem-solution pairs

### 8. Automated Testing Guide (automated-testing.md)

**Purpose**: Optional pytest-based test automation examples

**Content Structure**:

**Overview**:
- When to use automated tests (regression, CI/CD)
- Relationship to manual testing
- Reference to existing `backend/tests/` directory

**Setup**:
```bash
cd backend
pip install -r requirements.txt
pytest tests/
```

**Test Structure Examples**:

```python
# Example: Testing public API
def test_list_articles(client):
    """Test GET /api/v1/articles returns article list."""
    response = client.get("/api/v1/articles")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "articles" in data

# Example: Testing protected API with mock token
def test_get_user_profile(client, mock_jwt_token):
    """Test GET /api/v1/auth/me with valid token."""
    headers = {"Authorization": f"Bearer {mock_jwt_token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "user" in data

# Example: Testing error scenario
def test_protected_endpoint_without_token(client):
    """Test protected endpoint returns 401 without token."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert "Authorization header missing" in response.json()["detail"]
```

**Fixtures**:
```python
# conftest.py additions
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)

@pytest.fixture
def mock_jwt_token():
    """Generate mock JWT token for testing."""
    # Implementation using jwt.encode with test secret
    pass

@pytest.fixture
def test_article_id():
    """Valid article ID from seed data."""
    return "VALID_UUID_FROM_SEED"
```

**Running Tests**:
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth_login.py

# Run with coverage
pytest --cov=app tests/

# Run with verbose output
pytest -v
```

**Interface**: Markdown with code examples

## Data Models

### Test Scenario Document Structure

```typescript
interface TestScenario {
  endpoint: string;              // e.g., "GET /api/v1/articles"
  prerequisites?: string[];      // e.g., ["JWT token obtained"]
  requestFormat: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    queryParams?: Parameter[];
    body?: object;
  };
  testSteps: string[];          // Numbered steps
  expectedResponse: {
    statusCode: number;
    body: object;               // JSON example
  };
  validation: string[];         // Validation criteria
  notes?: string[];             // Additional context
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validValues?: string[];
}
```

### Error Scenario Structure

```typescript
interface ErrorScenario {
  errorType: string;            // e.g., "401 Unauthorized"
  endpoint: string;
  triggerCondition: string;     // What causes the error
  testSteps: string[];
  expectedResponse: {
    statusCode: number;
    errorMessage: string;
  };
  validation: string[];
}
```

### Troubleshooting Entry Structure

```typescript
interface TroubleshootingEntry {
  problem: string;
  symptoms: string[];
  rootCause: string;
  solution: string[];           // Step-by-step
  references: string[];         // Links to docs
}
```

## Error Handling

### Documentation Maintenance Errors

**Issue**: API endpoints change but documentation is outdated

**Mitigation**:
- Include "Last Updated" date in each document
- Reference Swagger UI as source of truth
- Add note: "If discrepancy exists, Swagger UI is authoritative"

### Test Data Availability

**Issue**: Seed data IDs change or are missing

**Mitigation**:
- Document how to retrieve valid IDs dynamically (GET endpoints)
- Provide placeholder format: `VALID_ARTICLE_ID_FROM_SEED_DATA`
- Include troubleshooting section for missing test data

### Authentication Complexity

**Issue**: JWT token extraction is complex for new developers

**Mitigation**:
- Provide detailed screenshots/descriptions
- Offer multiple extraction methods (Application tab, Network tab)
- Include troubleshooting for common auth issues

### Environment-Specific Issues

**Issue**: Documentation assumes specific environment setup

**Mitigation**:
- Clearly state prerequisites (backend running, database seeded)
- Reference setup documentation (CONFIGURATION_SETUP.md, AUTHENTICATION_SETUP.md)
- Include environment variable checklist

## Testing Strategy

### Documentation Validation

Since this feature produces documentation (not executable code), traditional property-based testing is not applicable. Instead, validation will focus on:

**Manual Review**:
- Technical accuracy (endpoints, request/response formats match actual API)
- Completeness (all requirements covered)
- Clarity (step-by-step instructions are unambiguous)
- Consistency (formatting, terminology, structure)

**Practical Testing**:
- Follow each test scenario manually through Swagger UI
- Verify expected responses match actual API behavior
- Test error scenarios produce documented error messages
- Validate troubleshooting solutions resolve stated problems

**Cross-Reference Validation**:
- Compare with existing `docs/api.md` for consistency
- Verify endpoint paths match `backend/app/api/v1/endpoints/`
- Confirm test data references match `database/seed/seed_data.sql`
- Check authentication flow matches `AUTHENTICATION_SETUP.md`

**User Acceptance Testing**:
- Have developers unfamiliar with the API follow the guides
- Collect feedback on clarity and completeness
- Identify missing steps or confusing instructions
- Iterate based on user feedback

### Documentation Quality Criteria

1. **Accuracy**: All endpoint paths, request formats, and response formats match actual API implementation
2. **Completeness**: All 10 requirements from requirements.md are addressed
3. **Usability**: A developer can successfully test all APIs by following the guides
4. **Maintainability**: Documentation structure allows easy updates when APIs change
5. **Accessibility**: Clear navigation, consistent formatting, appropriate detail level

### Validation Checklist

- [ ] All public API endpoints documented with test scenarios
- [ ] All protected API endpoints documented with test scenarios
- [ ] Authentication flow includes token extraction and Swagger authorization
- [ ] Error scenarios cover 401, 404, 422, 500 status codes
- [ ] User progress flow provides end-to-end test sequence
- [ ] Troubleshooting guide addresses common issues from requirements
- [ ] Automated testing guide references existing test files
- [ ] All test scenarios include request format, expected response, validation criteria
- [ ] Test data examples use valid IDs or explain how to obtain them
- [ ] Cross-references to existing documentation are accurate

## Implementation Notes

### File Organization

Create new `docs/testing/` directory to keep testing documentation separate from API reference:

```bash
mkdir -p docs/testing
```

### Documentation Tools

- **Format**: Markdown for maximum compatibility
- **Code Blocks**: Use syntax highlighting (```json, ```bash, ```python)
- **Navigation**: Include table of contents in README.md
- **Cross-Links**: Use relative links between documents

### Content Sources

- **Endpoint Details**: Extract from `backend/app/api/v1/endpoints/*.py`
- **Request/Response Formats**: Reference Swagger UI schemas
- **Test Data**: Reference `database/seed/seed_data.sql`
- **Authentication**: Reference `AUTHENTICATION_SETUP.md`
- **Configuration**: Reference `backend/CONFIGURATION_SETUP.md`

### Maintenance Strategy

- Update documentation when API endpoints change
- Version documentation alongside API versions
- Include "Last Updated" dates
- Maintain changelog for significant documentation updates

### Optional Enhancements

- Screenshots for DevTools navigation (if feasible)
- Video walkthrough of authentication flow
- Postman collection export (alternative to Swagger UI)
- Integration test suite in `backend/tests/integration/`

## Dependencies

### External Dependencies

- **Swagger UI**: FastAPI's built-in documentation at `/docs`
- **Browser DevTools**: For JWT token extraction
- **pytest**: For optional automated testing (already in requirements.txt)
- **FastAPI TestClient**: For automated testing (already available)

### Internal Dependencies

- **Existing Documentation**: `docs/api.md`, `AUTHENTICATION_SETUP.md`, `backend/CONFIGURATION_SETUP.md`
- **API Implementation**: `backend/app/api/v1/endpoints/*.py`
- **Test Infrastructure**: `backend/tests/conftest.py`, existing test files
- **Seed Data**: `database/seed/seed_data.sql`

### Environment Requirements

- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000` (for authentication)
- Database seeded with test data
- Supabase project configured

## Acceptance Criteria Mapping

This design addresses all requirements from requirements.md:

- **Requirement 1**: Public API testing → `public-apis.md` with test scenarios for all endpoints
- **Requirement 2**: Authentication flow → `authentication-flow.md` with token extraction steps
- **Requirement 3**: Protected API testing → `protected-apis.md` with authorization examples
- **Requirement 4**: Error scenarios → `error-scenarios.md` with 401/404/422/500 test cases
- **Requirement 5**: Request/response formats → Included in all test scenarios
- **Requirement 6**: Test data examples → Embedded in test scenarios with valid IDs
- **Requirement 7**: Swagger UI workflow → Integrated into all test scenario steps
- **Requirement 8**: User progress flow → `user-progress-flow.md` with sequential tests
- **Requirement 9**: Automated test scripts → `automated-testing.md` with pytest examples
- **Requirement 10**: Troubleshooting → `troubleshooting.md` with common issues and solutions

## Future Considerations

### Potential Enhancements

1. **Interactive Testing Tool**: Web-based UI for guided API testing
2. **Automated Documentation Generation**: Extract test scenarios from OpenAPI spec
3. **CI/CD Integration**: Automated test execution on pull requests
4. **Performance Testing**: Load testing documentation and tools
5. **API Versioning**: Documentation for multiple API versions
6. **Postman/Insomnia Collections**: Alternative to Swagger UI
7. **Video Tutorials**: Screen recordings of testing workflows
8. **Localization**: Multi-language documentation support

### Scalability Considerations

- As API grows, consider splitting documentation by domain (auth, content, progress)
- Implement documentation versioning strategy
- Consider automated documentation generation from code annotations
- Evaluate documentation hosting platform (GitBook, ReadTheDocs, etc.)
