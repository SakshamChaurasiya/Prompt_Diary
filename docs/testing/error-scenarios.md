# Error Scenarios Testing Guide

This guide provides comprehensive test cases for validating proper error handling across all API endpoints. Testing error scenarios ensures the API returns appropriate status codes and descriptive error messages.

## Table of Contents

1. [Overview](#overview)
2. [401 Unauthorized Errors](#401-unauthorized-errors)
3. [404 Not Found Errors](#404-not-found-errors)
4. [422 Validation Errors](#422-validation-errors)
5. [500 Internal Server Errors](#500-internal-server-errors)
6. [Testing Checklist](#testing-checklist)

---

## Overview

### Why Test Error Scenarios?

Testing error handling is crucial for:

- **User Experience**: Clear error messages help users understand what went wrong
- **Security**: Proper authentication errors prevent unauthorized access
- **Debugging**: Descriptive errors help developers identify issues quickly
- **API Contract**: Consistent error responses across all endpoints

### Error Response Format

All errors follow a consistent format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

For validation errors (422):

```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "error message",
      "type": "error_type"
    }
  ]
}
```

---

## 401 Unauthorized Errors

Authentication errors occur when JWT token is missing, invalid, or expired.

### Error 1: Missing Authorization Header

**Scenario:** Call a protected endpoint without providing an Authorization header.

#### Test Steps

1. In Swagger UI, click **"Authorize"** → **"Logout"** (if authorized)
2. Navigate to any protected endpoint (e.g., **GET /api/v1/auth/me**)
3. Click **"Try it out"** → **"Execute"**

#### Expected Response

**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Authorization header missing"
}
```

#### Validation

- ✅ Status code is 401
- ✅ Error message indicates missing header
- ✅ No sensitive information leaked

#### Affected Endpoints

All protected endpoints:
- GET /api/v1/auth/me
- PUT /api/v1/auth/profile
- GET /api/v1/user-progress
- POST /api/v1/user-progress/article
- POST /api/v1/user-progress/challenge
- GET /api/v1/user-progress/stats

---

### Error 2: Invalid Token Format

**Scenario:** Provide a malformed or invalid JWT token.

#### Test Steps

1. Click **"Authorize"** in Swagger UI
2. Enter an invalid token: `Bearer invalid-token-12345`
3. Click **"Authorize"** → **"Close"**
4. Try executing **GET /api/v1/auth/me**

#### Expected Response

**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Invalid or expired token"
}
```

#### Validation

- ✅ Status code is 401
- ✅ Error message indicates invalid token
- ✅ Backend doesn't crash or leak internal errors

---

### Error 3: Expired Token

**Scenario:** Use a JWT token that has expired (after 1 hour).

#### Test Steps

1. Wait for your JWT token to expire (1 hour after login)
2. Try executing any protected endpoint

**Alternative (Faster Test):**
1. Manually create an expired token (for testing purposes)
2. Authorize with the expired token
3. Try executing a protected endpoint

#### Expected Response

**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Invalid or expired token"
}
```

#### Validation

- ✅ Status code is 401
- ✅ Error message indicates token expiration
- ✅ User is prompted to re-authenticate

---

### Error 4: Malformed Bearer Token

**Scenario:** Provide token without "Bearer " prefix or with incorrect format.

#### Test: Missing "Bearer" Prefix

**Steps:**
1. Click **"Authorize"**
2. Enter token without "Bearer ": `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Try executing a protected endpoint

**Expected:** `401 Unauthorized`

#### Test: Extra Spaces

**Steps:**
1. Enter token with extra spaces: `Bearer  eyJhbGci...` (two spaces)
2. Try executing a protected endpoint

**Expected:** May work or return `401` depending on backend parsing

#### Test: Wrong Prefix

**Steps:**
1. Enter token with wrong prefix: `Token eyJhbGci...`
2. Try executing a protected endpoint

**Expected:** `401 Unauthorized`

---

## 404 Not Found Errors

Resource not found errors occur when requesting non-existent resources.

### Error 5: Non-Existent Article ID

**Scenario:** Request an article that doesn't exist.

#### Test Steps

1. Navigate to **GET /api/v1/articles/{article_id}**
2. Click **"Try it out"**
3. Enter a non-existent UUID: `00000000-0000-0000-0000-000000000000`
4. Click **"Execute"**

#### Expected Response

**Status Code:** `404 Not Found`

```json
{
  "detail": "Article not found"
}
```

#### Validation

- ✅ Status code is 404
- ✅ Error message is descriptive
- ✅ No database errors exposed

---

### Error 6: Non-Existent Challenge ID

**Scenario:** Request a challenge that doesn't exist.

#### Test Steps

1. Navigate to **GET /api/v1/challenges/{challenge_id}**
2. Enter a non-existent UUID
3. Execute

#### Expected Response

**Status Code:** `404 Not Found`

```json
{
  "detail": "Challenge not found"
}
```

---

### Error 7: Non-Existent Roadmap ID

**Scenario:** Request a roadmap that doesn't exist.

#### Test Steps

1. Navigate to **GET /api/v1/roadmaps/{roadmap_id}**
2. Enter a non-existent UUID
3. Execute

#### Expected Response

**Status Code:** `404 Not Found`

```json
{
  "detail": "Roadmap not found"
}
```

---

### Error 8: Invalid Slug

**Scenario:** Request an article by a slug that doesn't exist.

#### Test Steps

1. Navigate to **GET /api/v1/articles/slug/{slug}**
2. Enter a non-existent slug: `this-article-does-not-exist`
3. Execute

#### Expected Response

**Status Code:** `404 Not Found`

```json
{
  "detail": "Article not found"
}
```

---

## 422 Validation Errors

Validation errors occur when request data doesn't meet schema requirements.

### Error 9: Missing Required Field

**Scenario:** POST request without required field.

#### Test: Missing article_id

**Steps:**
1. Navigate to **POST /api/v1/user-progress/article**
2. Authorize with valid token
3. Click **"Try it out"**
4. Enter empty request body: `{}`
5. Execute

#### Expected Response

**Status Code:** `422 Unprocessable Entity`

```json
{
  "detail": [
    {
      "loc": ["body", "article_id"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

#### Validation

- ✅ Status code is 422
- ✅ Error indicates which field is missing
- ✅ Error location is specified (`body.article_id`)

---

### Error 10: Invalid Data Type

**Scenario:** Provide wrong data type for a field.

#### Test: String Instead of Number

**Steps:**
1. Navigate to **POST /api/v1/user-progress/challenge**
2. Authorize with valid token
3. Enter request body with invalid score type:

```json
{
  "challenge_id": "valid-uuid-here",
  "score": "not-a-number"
}
```

4. Execute

#### Expected Response

**Status Code:** `422 Unprocessable Entity`

```json
{
  "detail": [
    {
      "loc": ["body", "score"],
      "msg": "value is not a valid integer",
      "type": "type_error.integer"
    }
  ]
}
```

---

### Error 11: Invalid Enum Value

**Scenario:** Provide a value not in the allowed enum list.

#### Test: Invalid Category Filter

**Steps:**
1. Navigate to **GET /api/v1/articles**
2. Set `category` = `invalid-category`
3. Execute

**Expected:** Request may succeed but return empty results, or return 422 if strict validation is enabled.

**Note:** Current implementation may not strictly validate enum values for query parameters.

---

### Error 12: String Length Validation

**Scenario:** Provide string that's too short or too long.

#### Test: Search Query Too Short

**Steps:**
1. Navigate to **GET /api/v1/search**
2. Set `q` = `a` (1 character, minimum is 2)
3. Execute

#### Expected Response

**Status Code:** `422 Unprocessable Entity`

```json
{
  "detail": [
    {
      "loc": ["query", "q"],
      "msg": "ensure this value has at least 2 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

#### Test: Prompt Too Long

**Steps:**
1. Navigate to **POST /api/v1/playground/run**
2. Enter a prompt longer than 10,000 characters
3. Execute

**Expected:** `422` error indicating maximum length exceeded

---

### Error 13: Invalid Profile Update Data

**Scenario:** Update profile with invalid data.

#### Test: Invalid Username Format

**Steps:**
1. Navigate to **PUT /api/v1/auth/profile**
2. Authorize with valid token
3. Enter request body:

```json
{
  "username": "Invalid Username With Spaces!"
}
```

4. Execute

**Expected:** May succeed (current implementation doesn't validate username format) or return 422 if validation is added.

**Note:** Consider adding validation for:
- Username: lowercase, alphanumeric, underscores only
- Avatar URL: valid URL format
- Bio: maximum length

---

### Error 14: Range Validation

**Scenario:** Provide numeric value outside valid range.

#### Test: Temperature Out of Range

**Steps:**
1. Navigate to **POST /api/v1/playground/run**
2. Enter request body:

```json
{
  "prompt": "Test prompt",
  "temperature": 3.0
}
```

3. Execute

#### Expected Response

**Status Code:** `422 Unprocessable Entity`

```json
{
  "detail": [
    {
      "loc": ["body", "temperature"],
      "msg": "ensure this value is less than or equal to 2",
      "type": "value_error.number.not_le"
    }
  ]
}
```

#### Test: Negative Temperature

**Request Body:**

```json
{
  "prompt": "Test prompt",
  "temperature": -0.5
}
```

**Expected:** `422` error indicating value must be >= 0

---

## 500 Internal Server Errors

Server errors occur when the backend encounters an unexpected issue.

### Error 15: Database Connection Failure

**Scenario:** Backend cannot connect to the database.

#### Simulation

This error is difficult to test without modifying the environment. It occurs when:

- Database is down
- Invalid database credentials
- Network issues

#### Expected Response

**Status Code:** `500 Internal Server Error`

```json
{
  "detail": "Failed to update profile: [database error details]"
}
```

or

```json
{
  "detail": "Internal server error"
}
```

#### Validation

- ✅ Status code is 500
- ✅ Error message doesn't expose sensitive database details
- ✅ Backend logs contain full error for debugging

---

### Error 16: Supabase Client Error

**Scenario:** Supabase API is unavailable or returns an error.

#### Simulation

Occurs when:
- Supabase project is paused or deleted
- Invalid Supabase credentials
- Supabase API rate limit exceeded

#### Expected Behavior

- Most endpoints have fallback behavior (return empty data or mock data)
- Some endpoints may return 500 error
- Error messages should not expose Supabase credentials

---

## Testing Checklist

### 401 Unauthorized Tests

- [ ] Missing Authorization header on protected endpoints
- [ ] Invalid token format
- [ ] Expired token
- [ ] Malformed Bearer token (missing prefix, extra spaces, wrong prefix)

### 404 Not Found Tests

- [ ] Non-existent article ID
- [ ] Non-existent challenge ID
- [ ] Non-existent roadmap ID
- [ ] Invalid article slug

### 422 Validation Tests

- [ ] Missing required field (article_id, challenge_id, prompt)
- [ ] Invalid data type (string instead of number)
- [ ] String too short (search query < 2 chars)
- [ ] String too long (prompt > 10,000 chars)
- [ ] Numeric value out of range (temperature < 0 or > 2)
- [ ] Invalid enum value (if strict validation enabled)

### 500 Internal Server Tests

- [ ] Database connection failure (requires environment manipulation)
- [ ] Supabase client error (requires environment manipulation)

### General Error Handling

- [ ] All errors return consistent format
- [ ] Error messages are descriptive but don't leak sensitive information
- [ ] Status codes are appropriate for error types
- [ ] Validation errors specify field location and error type

---

## Error Testing Best Practices

### 1. Test Both Success and Failure Paths

For every endpoint, test:
- ✅ Success case (valid input)
- ❌ Failure cases (invalid input, missing auth, etc.)

### 2. Verify Error Messages

Ensure error messages are:
- **Descriptive**: User understands what went wrong
- **Actionable**: User knows how to fix the issue
- **Secure**: No sensitive information leaked

### 3. Check Status Codes

Verify correct HTTP status codes:
- `400`: Bad Request (client error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (authenticated but not authorized)
- `404`: Not Found (resource doesn't exist)
- `422`: Unprocessable Entity (validation error)
- `500`: Internal Server Error (server-side issue)

### 4. Test Edge Cases

- Empty strings
- Null values
- Very long strings
- Special characters
- Boundary values (min/max)

### 5. Security Testing

- Ensure authentication is enforced on protected endpoints
- Verify users can only access their own data
- Check that error messages don't expose system internals

---

## Common Error Patterns

### Pattern 1: Authentication Flow

```
1. Try protected endpoint without token → 401
2. Authorize with invalid token → 401
3. Authorize with valid token → 200
4. Wait for token to expire → 401
5. Re-authenticate and get new token → 200
```

### Pattern 2: Resource Lifecycle

```
1. GET non-existent resource → 404
2. POST to create resource → 201 (if creation endpoint exists)
3. GET created resource → 200
4. DELETE resource → 200 (if deletion endpoint exists)
5. GET deleted resource → 404
```

### Pattern 3: Validation Testing

```
1. POST with valid data → 200
2. POST with missing required field → 422
3. POST with invalid data type → 422
4. POST with out-of-range value → 422
5. POST with valid data again → 200
```

---

## Next Steps

- **Test complete workflows?** See [User Progress Flow](user-progress-flow.md) for end-to-end scenarios
- **Need authentication help?** See [Authentication Flow](authentication-flow.md) for token extraction
- **Encountering issues?** See [Troubleshooting](troubleshooting.md) for common problems
- **Automate error tests?** See [Automated Testing](automated-testing.md) for pytest examples

---

## Related Documentation

- **[README](README.md)**: Testing overview and quick start
- **[Public APIs](public-apis.md)**: Test endpoints without authentication
- **[Protected APIs](protected-apis.md)**: Test authenticated endpoints
- **[Troubleshooting](troubleshooting.md)**: Common issues and solutions

---

**Last Updated:** 2024  
**Maintained By:** Prompt Dairy Development Team
