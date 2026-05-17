# Protected APIs Testing Guide

This guide provides comprehensive test scenarios for all protected API endpoints that require JWT authentication. You must obtain and authorize with a JWT token before testing these endpoints.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Authentication Endpoints](#authentication-endpoints)
4. [User Progress Endpoints](#user-progress-endpoints)
5. [Common Testing Patterns](#common-testing-patterns)

---

## Overview

### What are Protected APIs?

Protected APIs are endpoints that **require authentication** via a JWT token. These endpoints:

- Return `401 Unauthorized` if no token is provided
- Return `401 Unauthorized` if the token is invalid or expired
- Access user-specific data (profile, progress, stats)
- Modify user data (update profile, mark progress)

### Use Cases

- User profile management
- Learning progress tracking
- Personal statistics and achievements
- User-specific content

---

## Prerequisites

Before testing protected endpoints, you must:

1. ✅ **Backend running** at `http://localhost:8000`
2. ✅ **Frontend running** at `http://localhost:3000`
3. ✅ **JWT token obtained** from frontend (see [Authentication Flow](authentication-flow.md))
4. ✅ **Swagger UI authorized** with Bearer token

### Quick Authorization Steps

If you haven't authorized yet:

1. Go to `http://localhost:3000/login` and log in
2. Extract JWT token from DevTools (see [Authentication Flow](authentication-flow.md))
3. Open Swagger UI: `http://localhost:8000/docs`
4. Click **"Authorize"** button (top-right)
5. Enter: `Bearer YOUR_ACCESS_TOKEN`
6. Click **"Authorize"** → **"Close"**

---

## Authentication Endpoints

Endpoints for managing user authentication and profile.

### GET /api/v1/auth/me

Get the current authenticated user's profile.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/auth/me`  
**Authentication:** **Required** (JWT token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:** None

#### Test Steps

1. Ensure you're authorized in Swagger UI (see [Prerequisites](#prerequisites))
2. Navigate to **Authentication** section
3. Click **GET /api/v1/auth/me**
4. Click **"Try it out"** → **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "user": {
    "id": "user-uuid-here",
    "email": "user@example.com",
    "role": "authenticated",
    "profile": {
      "id": "profile-uuid",
      "username": "johndoe",
      "display_name": "John Doe",
      "bio": "Prompt engineering enthusiast",
      "avatar_url": "https://example.com/avatar.jpg",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T14:30:00Z"
    }
  }
}
```

**Note:** If the user is newly created, `profile` may be `null` until the database trigger creates it.

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `success: true`
- ✅ `user` object is present
- ✅ `user.id` matches the JWT token's `sub` claim
- ✅ `user.email` matches your login email
- ✅ `user.role` is `"authenticated"`
- ✅ `user.profile` is either an object or `null`

#### Error Test: No Authorization

**Test Steps:**
1. In Swagger UI, click **"Authorize"** → **"Logout"**
2. Try executing **GET /api/v1/auth/me**

**Expected Response:**

**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Authorization header missing"
}
```

#### Error Test: Invalid Token

**Test Steps:**
1. Click **"Authorize"**
2. Enter: `Bearer invalid-token-here`
3. Try executing **GET /api/v1/auth/me**

**Expected Response:**

**Status Code:** `401 Unauthorized`

```json
{
  "detail": "Invalid or expired token"
}
```

---

### PUT /api/v1/auth/profile

Update the current user's profile.

#### Request Format

**Method:** PUT  
**Path:** `/api/v1/auth/profile`  
**Authentication:** **Required** (JWT token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request Body:**

```json
{
  "username": "string (optional)",
  "display_name": "string (optional)",
  "bio": "string (optional)",
  "avatar_url": "string (optional)"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | No | Unique username (lowercase, alphanumeric, underscores) |
| `display_name` | string | No | Display name shown to other users |
| `bio` | string | No | User biography or description |
| `avatar_url` | string | No | URL to user's avatar image |

**Note:** Only include fields you want to update. Omitted fields remain unchanged.

#### Test Steps

1. Ensure you're authorized in Swagger UI
2. Navigate to **Authentication** section
3. Click **PUT /api/v1/auth/profile**
4. Click **"Try it out"**
5. Enter request body (see examples below)
6. Click **"Execute"**

#### Test: Update Display Name

**Request Body:**

```json
{
  "display_name": "Jane Smith"
}
```

**Expected Response:**

**Status Code:** `200 OK`

```json
{
  "message": "Profile updated successfully",
  "success": true
}
```

**Validation:**
1. Execute **GET /api/v1/auth/me**
2. Verify `profile.display_name` is now `"Jane Smith"`

#### Test: Update Multiple Fields

**Request Body:**

```json
{
  "username": "janesmith",
  "display_name": "Jane Smith",
  "bio": "AI researcher and prompt engineering expert",
  "avatar_url": "https://example.com/jane-avatar.jpg"
}
```

**Expected Response:**

**Status Code:** `200 OK`

```json
{
  "message": "Profile updated successfully",
  "success": true
}
```

**Validation:**
1. Execute **GET /api/v1/auth/me**
2. Verify all fields are updated

#### Test: Update Single Field

**Request Body:**

```json
{
  "bio": "Updated bio text"
}
```

**Expected:** Only `bio` is updated, other fields remain unchanged

#### Test: Empty Update

**Request Body:**

```json
{}
```

**Expected Response:**

**Status Code:** `200 OK`

```json
{
  "message": "No fields to update",
  "success": true
}
```

#### Error Test: Without Authorization

**Expected:** `401 Unauthorized` with `"detail": "Authorization header missing"`

---

### GET /api/v1/auth/status

Check authentication status (works for both authenticated and unauthenticated requests).

#### Request Format

**Method:** GET  
**Path:** `/api/v1/auth/status`  
**Authentication:** **Optional** (works with or without token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN (optional)
```

**Query Parameters:** None

#### Test Steps

1. Navigate to **Authentication** section
2. Click **GET /api/v1/auth/status**
3. Click **"Try it out"** → **"Execute"**

#### Test: With Authentication

**Prerequisites:** Authorized in Swagger UI

**Expected Response:**

**Status Code:** `200 OK`

```json
{
  "authenticated": true,
  "user_id": "user-uuid-here",
  "email": "user@example.com"
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ `authenticated` is `true`
- ✅ `user_id` matches your user ID
- ✅ `email` matches your login email

#### Test: Without Authentication

**Test Steps:**
1. Click **"Authorize"** → **"Logout"** (if authorized)
2. Execute **GET /api/v1/auth/status**

**Expected Response:**

**Status Code:** `200 OK`

```json
{
  "authenticated": false
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ `authenticated` is `false`
- ✅ No `user_id` or `email` fields present

---

## User Progress Endpoints

Endpoints for tracking learning progress (articles read, challenges completed, stats).

### GET /api/v1/user-progress

Get the current user's complete learning progress.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/user-progress`  
**Authentication:** **Required** (JWT token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:** None

#### Test Steps

1. Ensure you're authorized in Swagger UI
2. Navigate to **User Progress** section
3. Click **GET /api/v1/user-progress**
4. Click **"Try it out"** → **"Execute"**

#### Expected Response (New User)

**Status Code:** `200 OK`

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

#### Expected Response (User with Progress)

**Status Code:** `200 OK`

```json
{
  "success": true,
  "progress": {
    "articles_completed": 3,
    "articles": [
      {
        "id": "progress-uuid-1",
        "user_id": "user-uuid",
        "article_id": "article-uuid-1",
        "completed": true,
        "completed_at": "2024-01-15T10:30:00Z"
      },
      {
        "id": "progress-uuid-2",
        "user_id": "user-uuid",
        "article_id": "article-uuid-2",
        "completed": true,
        "completed_at": "2024-01-16T14:20:00Z"
      },
      {
        "id": "progress-uuid-3",
        "user_id": "user-uuid",
        "article_id": "article-uuid-3",
        "completed": true,
        "completed_at": "2024-01-17T09:15:00Z"
      }
    ],
    "challenges_completed": 2,
    "challenges": [
      {
        "id": "challenge-progress-uuid-1",
        "user_id": "user-uuid",
        "challenge_id": "challenge-uuid-1",
        "completed": true,
        "score": 25,
        "completed_at": "2024-01-18T11:00:00Z"
      },
      {
        "id": "challenge-progress-uuid-2",
        "user_id": "user-uuid",
        "challenge_id": "challenge-uuid-2",
        "completed": true,
        "score": 50,
        "completed_at": "2024-01-19T16:45:00Z"
      }
    ],
    "total_points": 75
  }
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `success: true`
- ✅ `progress` object is present
- ✅ `articles_completed` count matches `articles` array length
- ✅ `challenges_completed` count matches `challenges` array length
- ✅ `total_points` equals sum of all challenge scores
- ✅ All progress items have `user_id` matching current user

#### Error Test: Without Authorization

**Expected:** `401 Unauthorized` with `"detail": "Authorization header missing"`

---

### POST /api/v1/user-progress/article

Mark an article as completed for the current user.

#### Request Format

**Method:** POST  
**Path:** `/api/v1/user-progress/article`  
**Authentication:** **Required** (JWT token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request Body:**

```json
{
  "article_id": "string (required, UUID)"
}
```

#### Test Steps

1. **Get a valid article ID:**
   - Execute **GET /api/v1/articles** (public endpoint)
   - Copy an `id` from the response
2. Ensure you're authorized in Swagger UI
3. Navigate to **User Progress** section
4. Click **POST /api/v1/user-progress/article**
5. Click **"Try it out"**
6. Enter request body with the article ID
7. Click **"Execute"**

#### Test: Mark Article Completed

**Request Body:**

```json
{
  "article_id": "PASTE_VALID_ARTICLE_ID_HERE"
}
```

**Expected Response:**

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Article marked as completed"
}
```

#### Validation

1. Execute **GET /api/v1/user-progress**
2. Verify the article appears in the `articles` array
3. Verify `articles_completed` count increased by 1

#### Test: Idempotency (Mark Same Article Twice)

**Test Steps:**
1. Mark an article as completed (first time)
2. Mark the same article as completed again (second time)

**Expected:**
- Both requests return `200 OK`
- **GET /api/v1/user-progress** shows the article only once
- `articles_completed` count does not increase on second request

**Validation:** The endpoint uses `upsert` with `on_conflict`, so marking the same article twice is safe and idempotent.

#### Error Test: Invalid Article ID

**Request Body:**

```json
{
  "article_id": "00000000-0000-0000-0000-000000000000"
}
```

**Expected:** Request succeeds (backend doesn't validate article existence), but the article ID won't match any real article.

#### Error Test: Without Authorization

**Expected:** `401 Unauthorized`

---

### POST /api/v1/user-progress/challenge

Mark a challenge as completed for the current user.

#### Request Format

**Method:** POST  
**Path:** `/api/v1/user-progress/challenge`  
**Authentication:** **Required** (JWT token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request Body:**

```json
{
  "challenge_id": "string (required, UUID)",
  "score": 0
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `challenge_id` | string (UUID) | Yes | ID of the completed challenge |
| `score` | integer | No | Points earned (default: 0) |

#### Test Steps

1. **Get a valid challenge ID:**
   - Execute **GET /api/v1/challenges** (public endpoint)
   - Copy an `id` and note the `points` value
2. Ensure you're authorized in Swagger UI
3. Navigate to **User Progress** section
4. Click **POST /api/v1/user-progress/challenge**
5. Click **"Try it out"**
6. Enter request body with challenge ID and score
7. Click **"Execute"**

#### Test: Mark Challenge Completed with Score

**Request Body:**

```json
{
  "challenge_id": "PASTE_VALID_CHALLENGE_ID_HERE",
  "score": 25
}
```

**Expected Response:**

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Challenge marked as completed"
}
```

#### Validation

1. Execute **GET /api/v1/user-progress**
2. Verify the challenge appears in the `challenges` array
3. Verify `challenges_completed` count increased by 1
4. Verify `total_points` increased by the score value (25)

#### Test: Mark Challenge Without Score

**Request Body:**

```json
{
  "challenge_id": "PASTE_VALID_CHALLENGE_ID_HERE"
}
```

**Expected:**
- Request succeeds
- Score defaults to `0`
- Challenge is marked completed but adds 0 points

#### Test: Different Score Values

**Test Steps:**
1. Mark challenge with `score: 10`
2. Mark another challenge with `score: 50`
3. Mark another challenge with `score: 100`

**Validation:**
- Execute **GET /api/v1/user-progress/stats**
- Verify `total_points` equals sum of all scores (160)

#### Test: Idempotency (Mark Same Challenge Twice)

**Test Steps:**
1. Mark a challenge with `score: 25` (first time)
2. Mark the same challenge with `score: 50` (second time)

**Expected:**
- Both requests return `200 OK`
- The challenge appears only once in progress
- The score is updated to the latest value (50)

**Note:** Unlike articles, challenge progress can be updated with a new score.

#### Error Test: Without Authorization

**Expected:** `401 Unauthorized`

---

### GET /api/v1/user-progress/stats

Get the current user's aggregated statistics.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/user-progress/stats`  
**Authentication:** **Required** (JWT token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:** None

#### Test Steps

1. Ensure you're authorized in Swagger UI
2. Navigate to **User Progress** section
3. Click **GET /api/v1/user-progress/stats**
4. Click **"Try it out"** → **"Execute"**

#### Expected Response (New User)

**Status Code:** `200 OK`

```json
{
  "success": true,
  "stats": {
    "articles_completed": 0,
    "challenges_completed": 0,
    "total_points": 0,
    "level": "Newcomer"
  }
}
```

#### Expected Response (User with Progress)

**Status Code:** `200 OK`

```json
{
  "success": true,
  "stats": {
    "articles_completed": 5,
    "challenges_completed": 3,
    "total_points": 125,
    "level": "Advanced"
  }
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `success: true`
- ✅ `stats` object is present
- ✅ `articles_completed` is a non-negative integer
- ✅ `challenges_completed` is a non-negative integer
- ✅ `total_points` is a non-negative integer
- ✅ `level` matches the level calculation based on points

#### Level Calculation

The `level` field is calculated based on `total_points`:

| Points Range | Level |
|--------------|-------|
| 0 - 9 | Newcomer |
| 10 - 49 | Beginner |
| 50 - 99 | Intermediate |
| 100 - 199 | Advanced |
| 200+ | Expert |

#### Test: Level Progression

**Test Steps:**
1. Check initial stats (should be "Newcomer" with 0 points)
2. Mark a challenge completed with `score: 15`
3. Check stats again (should be "Beginner" with 15 points)
4. Mark more challenges to reach 50 points
5. Check stats (should be "Intermediate")
6. Continue to 100 points (should be "Advanced")
7. Continue to 200 points (should be "Expert")

**Validation:** Level updates correctly as points increase

#### Test: Stats After Marking Progress

**Test Steps:**
1. Execute **GET /api/v1/user-progress/stats** (note initial values)
2. Mark an article completed
3. Execute **GET /api/v1/user-progress/stats** again
4. Verify `articles_completed` increased by 1

**Test Steps:**
1. Note initial `total_points`
2. Mark a challenge completed with `score: 30`
3. Execute **GET /api/v1/user-progress/stats** again
4. Verify `total_points` increased by 30
5. Verify `challenges_completed` increased by 1

#### Error Test: Without Authorization

**Expected:** `401 Unauthorized`

---

## Common Testing Patterns

### Pattern 1: Complete Progress Tracking Workflow

Test the full user progress flow from start to finish:

```
1. GET /api/v1/user-progress (verify initial empty state)
2. POST /api/v1/user-progress/article (mark article completed)
3. GET /api/v1/user-progress (verify article appears)
4. POST /api/v1/user-progress/challenge (mark challenge completed with score)
5. GET /api/v1/user-progress (verify challenge appears)
6. GET /api/v1/user-progress/stats (verify stats updated)
7. Verify level calculation based on total points
```

See [User Progress Flow](user-progress-flow.md) for detailed step-by-step guide.

### Pattern 2: Profile Management

Test profile creation and updates:

```
1. GET /api/v1/auth/me (check initial profile state)
2. PUT /api/v1/auth/profile (update display_name)
3. GET /api/v1/auth/me (verify update)
4. PUT /api/v1/auth/profile (update multiple fields)
5. GET /api/v1/auth/me (verify all updates)
```

### Pattern 3: Authorization Testing

Test authentication requirements:

```
1. Logout from Swagger UI
2. Try GET /api/v1/auth/me → expect 401
3. Try POST /api/v1/user-progress/article → expect 401
4. Authorize with valid token
5. Try same endpoints → expect 200
6. Authorize with invalid token
7. Try endpoints → expect 401
```

### Pattern 4: Idempotency Testing

Test that repeated operations are safe:

```
1. Mark article X as completed (first time)
2. Mark article X as completed (second time)
3. Verify article appears only once in progress
4. Mark challenge Y with score 25 (first time)
5. Mark challenge Y with score 50 (second time)
6. Verify challenge score is updated to 50
```

### Pattern 5: Stats Aggregation

Test that stats correctly aggregate progress:

```
1. GET /api/v1/user-progress/stats (note initial values)
2. Mark 3 articles completed
3. Mark 2 challenges completed (scores: 25, 50)
4. GET /api/v1/user-progress/stats
5. Verify articles_completed = 3
6. Verify challenges_completed = 2
7. Verify total_points = 75
8. Verify level matches point range
```

---

## Response Format Reference

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Message Response

```json
{
  "success": true,
  "message": "Operation completed successfully"
}
```

### Error Response (401 Unauthorized)

```json
{
  "detail": "Authorization header missing"
}
```

or

```json
{
  "detail": "Invalid or expired token"
}
```

### Error Response (500 Internal Server Error)

```json
{
  "detail": "Failed to update profile: [error details]"
}
```

---

## Next Steps

- **Complete workflow testing?** See [User Progress Flow](user-progress-flow.md) for end-to-end scenarios
- **Test error scenarios?** See [Error Scenarios](error-scenarios.md) for comprehensive error testing
- **Token issues?** See [Authentication Flow](authentication-flow.md) for token extraction help
- **Troubleshooting?** See [Troubleshooting](troubleshooting.md) for common issues

---

## Related Documentation

- **[README](README.md)**: Testing overview and quick start
- **[Authentication Flow](authentication-flow.md)**: JWT token extraction and authorization
- **[Public APIs](public-apis.md)**: Test endpoints without authentication
- **[User Progress Flow](user-progress-flow.md)**: End-to-end progress tracking workflow
- **[API Reference](../api.md)**: Complete endpoint documentation

---

**Last Updated:** 2024  
**Maintained By:** Prompt Dairy Development Team
