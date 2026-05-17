# Automated Testing Guide

This guide provides examples and best practices for automating API tests using pytest and FastAPI's TestClient. Automated tests are useful for regression testing, CI/CD pipelines, and rapid validation.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Test Structure](#test-structure)
4. [Testing Public APIs](#testing-public-apis)
5. [Testing Protected APIs](#testing-protected-apis)
6. [Testing Error Scenarios](#testing-error-scenarios)
7. [Fixtures and Utilities](#fixtures-and-utilities)
8. [Running Tests](#running-tests)
9. [Best Practices](#best-practices)

---

## Overview

### When to Use Automated Tests

Automated tests are ideal for:

- **Regression Testing**: Ensure new changes don't break existing functionality
- **CI/CD Pipelines**: Automated validation on every commit/PR
- **Rapid Iteration**: Quick feedback during development
- **Coverage**: Test many scenarios quickly
- **Documentation**: Tests serve as executable documentation

### Manual vs Automated Testing

| Aspect | Manual Testing | Automated Testing |
|--------|----------------|-------------------|
| **Speed** | Slow (human-paced) | Fast (seconds) |
| **Coverage** | Limited by time | Comprehensive |
| **Repeatability** | Varies | Consistent |
| **Initial Setup** | None | Requires code |
| **Best For** | Exploration, UX | Regression, CI/CD |

**Recommendation:** Use both! Manual testing for exploration and initial validation, automated testing for ongoing regression and CI/CD.

---

## Setup

### Prerequisites

- Python 3.8+
- Backend dependencies installed
- pytest installed

### Installation

```bash
cd backend

# Install dependencies (includes pytest)
pip install -r requirements.txt

# Verify pytest is installed
pytest --version
```

### Project Structure

```
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── models/
│   └── services/
├── tests/
│   ├── conftest.py          # Pytest configuration and fixtures
│   ├── test_auth_login.py   # Authentication tests
│   ├── test_auth_signup.py  # Signup tests
│   ├── test_protected_endpoint.py  # Protected endpoint tests
│   └── __init__.py
└── requirements.txt
```

---

## Test Structure

### Basic Test Example

```python
# tests/test_articles.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_articles():
    """Test GET /api/v1/articles returns article list."""
    response = client.get("/api/v1/articles")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "articles" in data
    assert isinstance(data["articles"], list)
```

### Test Structure Components

1. **Import TestClient**: FastAPI's test client for making requests
2. **Create client instance**: `client = TestClient(app)`
3. **Define test function**: Name starts with `test_`
4. **Make request**: `client.get()`, `client.post()`, etc.
5. **Assert results**: Verify status code, response data, etc.

---

## Testing Public APIs

Public APIs don't require authentication, making them straightforward to test.

### Test: List Articles

```python
def test_list_articles():
    """Test GET /api/v1/articles returns article list."""
    response = client.get("/api/v1/articles")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "articles" in data
```

### Test: List Articles with Filters

```python
def test_list_articles_with_category_filter():
    """Test GET /api/v1/articles with category filter."""
    response = client.get("/api/v1/articles?category=fundamentals")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    
    # Verify all articles match the filter
    for article in data["articles"]:
        assert article["category"] == "fundamentals"
```

### Test: Get Article by ID

```python
def test_get_article_by_id(test_article_id):
    """Test GET /api/v1/articles/{id} returns article details."""
    response = client.get(f"/api/v1/articles/{test_article_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "article" in data
    assert data["article"]["id"] == test_article_id
```

### Test: Search Endpoint

```python
def test_search():
    """Test GET /api/v1/search returns search results."""
    response = client.get("/api/v1/search?q=prompt")
    
    assert response.status_code == 200
    data = response.json()
    assert "articles" in data
    assert "challenges" in data
    assert "roadmaps" in data
    assert "total" in data
```

### Test: Playground Models

```python
def test_list_playground_models():
    """Test GET /api/v1/playground/models returns model list."""
    response = client.get("/api/v1/playground/models")
    
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert "total" in data
    assert len(data["models"]) > 0
```

### Test: Playground Run Prompt

```python
def test_run_prompt():
    """Test POST /api/v1/playground/run executes prompt."""
    payload = {
        "prompt": "Explain what prompt engineering is.",
        "model": "gpt-4",
        "temperature": 0.7,
        "max_tokens": 200
    }
    
    response = client.post("/api/v1/playground/run", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "response" in data
    assert "model" in data
    assert data["model"] == "gpt-4"
```

---

## Testing Protected APIs

Protected APIs require JWT authentication. Use fixtures to create mock tokens.

### Creating Mock JWT Tokens

```python
# tests/conftest.py

import jwt
import pytest
from datetime import datetime, timedelta

@pytest.fixture
def mock_jwt_token():
    """Generate a mock JWT token for testing."""
    payload = {
        "sub": "test-user-id-12345",
        "email": "test@example.com",
        "role": "authenticated",
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    
    token = jwt.encode(payload, "test-jwt-secret-for-unit-tests-12345", algorithm="HS256")
    return token
```

### Test: Get Current User Profile

```python
def test_get_current_user(mock_jwt_token):
    """Test GET /api/v1/auth/me with valid token."""
    headers = {"Authorization": f"Bearer {mock_jwt_token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "user" in data
    assert data["user"]["id"] == "test-user-id-12345"
    assert data["user"]["email"] == "test@example.com"
```

### Test: Update User Profile

```python
def test_update_profile(mock_jwt_token):
    """Test PUT /api/v1/auth/profile updates user profile."""
    headers = {"Authorization": f"Bearer {mock_jwt_token}"}
    payload = {
        "display_name": "Test User",
        "bio": "Testing the API"
    }
    
    response = client.put("/api/v1/auth/profile", json=payload, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "message" in data
```

### Test: Get User Progress

```python
def test_get_user_progress(mock_jwt_token):
    """Test GET /api/v1/user-progress returns user progress."""
    headers = {"Authorization": f"Bearer {mock_jwt_token}"}
    response = client.get("/api/v1/user-progress", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "progress" in data
    assert "articles_completed" in data["progress"]
    assert "challenges_completed" in data["progress"]
    assert "total_points" in data["progress"]
```

### Test: Mark Article Completed

```python
def test_mark_article_completed(mock_jwt_token, test_article_id):
    """Test POST /api/v1/user-progress/article marks article completed."""
    headers = {"Authorization": f"Bearer {mock_jwt_token}"}
    payload = {"article_id": test_article_id}
    
    response = client.post("/api/v1/user-progress/article", json=payload, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "message" in data
```

### Test: Mark Challenge Completed

```python
def test_mark_challenge_completed(mock_jwt_token, test_challenge_id):
    """Test POST /api/v1/user-progress/challenge marks challenge completed."""
    headers = {"Authorization": f"Bearer {mock_jwt_token}"}
    payload = {
        "challenge_id": test_challenge_id,
        "score": 25
    }
    
    response = client.post("/api/v1/user-progress/challenge", json=payload, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
```

### Test: Get User Stats

```python
def test_get_user_stats(mock_jwt_token):
    """Test GET /api/v1/user-progress/stats returns aggregated stats."""
    headers = {"Authorization": f"Bearer {mock_jwt_token}"}
    response = client.get("/api/v1/user-progress/stats", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "stats" in data
    assert "articles_completed" in data["stats"]
    assert "challenges_completed" in data["stats"]
    assert "total_points" in data["stats"]
    assert "level" in data["stats"]
```

---

## Testing Error Scenarios

Test error handling to ensure proper status codes and error messages.

### Test: 401 Unauthorized (Missing Token)

```python
def test_protected_endpoint_without_token():
    """Test protected endpoint returns 401 without token."""
    response = client.get("/api/v1/auth/me")
    
    assert response.status_code == 401
    assert "detail" in response.json()
    assert "Authorization header missing" in response.json()["detail"]
```

### Test: 401 Unauthorized (Invalid Token)

```python
def test_protected_endpoint_with_invalid_token():
    """Test protected endpoint returns 401 with invalid token."""
    headers = {"Authorization": "Bearer invalid-token-12345"}
    response = client.get("/api/v1/auth/me", headers=headers)
    
    assert response.status_code == 401
    assert "detail" in response.json()
```

### Test: 404 Not Found

```python
def test_get_nonexistent_article():
    """Test GET /api/v1/articles/{id} returns 404 for non-existent article."""
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = client.get(f"/api/v1/articles/{fake_id}")
    
    assert response.status_code == 404
    assert "detail" in response.json()
    assert "not found" in response.json()["detail"].lower()
```

### Test: 422 Validation Error (Missing Required Field)

```python
def test_mark_article_without_article_id(mock_jwt_token):
    """Test POST /api/v1/user-progress/article returns 422 without article_id."""
    headers = {"Authorization": f"Bearer {mock_jwt_token}"}
    payload = {}  # Missing required article_id
    
    response = client.post("/api/v1/user-progress/article", json=payload, headers=headers)
    
    assert response.status_code == 422
    assert "detail" in response.json()
```

### Test: 422 Validation Error (Invalid Data Type)

```python
def test_run_prompt_with_invalid_temperature():
    """Test POST /api/v1/playground/run returns 422 with invalid temperature."""
    payload = {
        "prompt": "Test prompt",
        "temperature": 3.0  # Out of range (max is 2.0)
    }
    
    response = client.post("/api/v1/playground/run", json=payload)
    
    assert response.status_code == 422
    assert "detail" in response.json()
```

### Test: 422 Validation Error (String Too Short)

```python
def test_search_with_short_query():
    """Test GET /api/v1/search returns 422 with query < 2 characters."""
    response = client.get("/api/v1/search?q=a")
    
    assert response.status_code == 422
    assert "detail" in response.json()
```

---

## Fixtures and Utilities

### Common Fixtures

```python
# tests/conftest.py

import pytest
import jwt
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)

@pytest.fixture
def mock_jwt_token():
    """Generate mock JWT token for testing."""
    payload = {
        "sub": "test-user-id-12345",
        "email": "test@example.com",
        "role": "authenticated",
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, "test-jwt-secret-for-unit-tests-12345", algorithm="HS256")
    return token

@pytest.fixture
def test_article_id():
    """Valid article ID from seed data."""
    # In real tests, query the database or use a known ID
    return "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

@pytest.fixture
def test_challenge_id():
    """Valid challenge ID from seed data."""
    return "c1d2e3f4-g5h6-7890-ijkl-mn1234567890"

@pytest.fixture
def auth_headers(mock_jwt_token):
    """Authorization headers with Bearer token."""
    return {"Authorization": f"Bearer {mock_jwt_token}"}
```

### Using Fixtures

```python
def test_with_fixtures(client, auth_headers, test_article_id):
    """Example test using multiple fixtures."""
    response = client.post(
        "/api/v1/user-progress/article",
        json={"article_id": test_article_id},
        headers=auth_headers
    )
    
    assert response.status_code == 200
```

---

## Running Tests

### Run All Tests

```bash
cd backend
pytest
```

### Run Specific Test File

```bash
pytest tests/test_auth_login.py
```

### Run Specific Test Function

```bash
pytest tests/test_auth_login.py::test_get_current_user
```

### Run with Verbose Output

```bash
pytest -v
```

### Run with Coverage

```bash
pytest --cov=app tests/
```

### Run with Coverage Report

```bash
pytest --cov=app --cov-report=html tests/
```

This generates an HTML coverage report in `htmlcov/index.html`.

### Run Tests Matching Pattern

```bash
# Run all tests with "article" in the name
pytest -k article

# Run all tests with "auth" in the name
pytest -k auth
```

### Run Tests and Stop on First Failure

```bash
pytest -x
```

### Run Tests with Print Statements

```bash
pytest -s
```

---

## Best Practices

### 1. Test Organization

```
tests/
├── conftest.py              # Shared fixtures
├── test_articles.py         # Article endpoint tests
├── test_challenges.py       # Challenge endpoint tests
├── test_auth.py             # Authentication tests
├── test_user_progress.py    # User progress tests
└── test_error_scenarios.py  # Error handling tests
```

### 2. Test Naming

```python
# Good: Descriptive test names
def test_list_articles_returns_200():
    ...

def test_get_article_by_id_with_valid_id():
    ...

def test_protected_endpoint_without_token_returns_401():
    ...

# Bad: Vague test names
def test_articles():
    ...

def test_1():
    ...
```

### 3. Arrange-Act-Assert Pattern

```python
def test_mark_article_completed(client, auth_headers, test_article_id):
    # Arrange: Set up test data
    payload = {"article_id": test_article_id}
    
    # Act: Perform the action
    response = client.post(
        "/api/v1/user-progress/article",
        json=payload,
        headers=auth_headers
    )
    
    # Assert: Verify the result
    assert response.status_code == 200
    assert response.json()["success"] is True
```

### 4. Test Independence

```python
# Good: Each test is independent
def test_create_article():
    # Create article
    # Assert creation
    pass

def test_get_article():
    # Create article for this test
    # Get article
    # Assert retrieval
    pass

# Bad: Tests depend on each other
def test_create_article():
    # Create article
    # Store ID in global variable
    pass

def test_get_article():
    # Use ID from previous test (fragile!)
    pass
```

### 5. Use Fixtures for Common Setup

```python
@pytest.fixture
def created_article(client, auth_headers):
    """Create an article for testing."""
    payload = {"title": "Test Article", "content": "Test content"}
    response = client.post("/api/v1/articles", json=payload, headers=auth_headers)
    return response.json()["article"]

def test_update_article(client, auth_headers, created_article):
    """Test updating an article."""
    article_id = created_article["id"]
    # Test update logic
    ...
```

### 6. Test Both Success and Failure Cases

```python
def test_get_article_success(client, test_article_id):
    """Test successful article retrieval."""
    response = client.get(f"/api/v1/articles/{test_article_id}")
    assert response.status_code == 200

def test_get_article_not_found(client):
    """Test article retrieval with invalid ID."""
    response = client.get("/api/v1/articles/invalid-id")
    assert response.status_code == 404
```

### 7. Mock External Dependencies

```python
from unittest.mock import patch

@patch('app.core.supabase_client.get_supabase_admin')
def test_with_mocked_supabase(mock_supabase, client):
    """Test with mocked Supabase client."""
    # Configure mock
    mock_supabase.return_value.table.return_value.select.return_value.execute.return_value.data = []
    
    # Test logic
    response = client.get("/api/v1/articles")
    assert response.status_code == 200
```

### 8. Use Parametrized Tests

```python
import pytest

@pytest.mark.parametrize("category,expected_count", [
    ("fundamentals", 5),
    ("techniques", 3),
    ("architecture", 2),
])
def test_articles_by_category(client, category, expected_count):
    """Test article filtering by category."""
    response = client.get(f"/api/v1/articles?category={category}")
    assert response.status_code == 200
    assert len(response.json()["articles"]) == expected_count
```

---

## Example Test Suite

Here's a complete example test file:

```python
# tests/test_user_progress.py

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestUserProgress:
    """Test suite for user progress endpoints."""
    
    def test_get_progress_requires_auth(self):
        """Test GET /user-progress requires authentication."""
        response = client.get("/api/v1/user-progress")
        assert response.status_code == 401
    
    def test_get_progress_with_auth(self, auth_headers):
        """Test GET /user-progress with valid token."""
        response = client.get("/api/v1/user-progress", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "progress" in data
    
    def test_mark_article_completed(self, auth_headers, test_article_id):
        """Test marking article as completed."""
        payload = {"article_id": test_article_id}
        response = client.post(
            "/api/v1/user-progress/article",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["success"] is True
    
    def test_mark_challenge_completed(self, auth_headers, test_challenge_id):
        """Test marking challenge as completed with score."""
        payload = {"challenge_id": test_challenge_id, "score": 25}
        response = client.post(
            "/api/v1/user-progress/challenge",
            json=payload,
            headers=auth_headers
        )
        assert response.status_code == 200
    
    def test_get_stats(self, auth_headers):
        """Test GET /user-progress/stats returns aggregated stats."""
        response = client.get("/api/v1/user-progress/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "stats" in data
        assert "level" in data["stats"]
```

---

## References to Existing Tests

The backend already has several test files you can reference:

- **`tests/conftest.py`**: Pytest configuration and environment setup
- **`tests/test_auth_login.py`**: Authentication endpoint tests
- **`tests/test_auth_signup.py`**: Signup endpoint tests
- **`tests/test_protected_endpoint.py`**: Protected endpoint tests
- **`tests/test_jwt_validation.py`**: JWT token validation tests

Review these files for additional examples and patterns.

---

## Next Steps

- **Manual testing?** See [README](README.md) for Swagger UI testing guide
- **Need test data?** See [Public APIs](public-apis.md) for getting valid IDs
- **Authentication issues?** See [Troubleshooting](troubleshooting.md) for solutions
- **CI/CD integration?** Configure pytest in your CI pipeline

---

## Related Documentation

- **[README](README.md)**: Testing overview and quick start
- **[Public APIs](public-apis.md)**: Manual testing for public endpoints
- **[Protected APIs](protected-apis.md)**: Manual testing for protected endpoints
- **[Error Scenarios](error-scenarios.md)**: Error handling test cases

---

**Last Updated:** 2024  
**Maintained By:** Prompt Dairy Development Team
