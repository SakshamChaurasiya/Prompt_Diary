# User Progress Flow Testing Guide

This guide provides a complete end-to-end workflow for testing the learning progress tracking system. Follow these steps sequentially to verify the entire user progress feature works correctly.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Complete Test Workflow](#complete-test-workflow)
4. [Level Progression Testing](#level-progression-testing)
5. [Validation Checklist](#validation-checklist)

---

## Overview

### What is User Progress Tracking?

The user progress system tracks:
- **Articles completed**: Articles the user has read
- **Challenges completed**: Challenges the user has solved with scores
- **Total points**: Sum of all challenge scores
- **User level**: Calculated based on total points (Newcomer → Beginner → Intermediate → Advanced → Expert)

### Testing Goals

This workflow verifies:
- ✅ Initial empty state for new users
- ✅ Article completion tracking
- ✅ Challenge completion with score tracking
- ✅ Progress aggregation and statistics
- ✅ Level calculation based on points
- ✅ Idempotency (marking same item twice)

---

## Prerequisites

Before starting this workflow:

1. ✅ **Backend running** at `http://localhost:8000`
2. ✅ **Database seeded** with test data
3. ✅ **JWT token obtained** from frontend login
4. ✅ **Swagger UI authorized** with Bearer token

**Quick Authorization:**
```
1. Go to http://localhost:3000/login and log in
2. Extract JWT token from DevTools (see Authentication Flow guide)
3. Open http://localhost:8000/docs
4. Click "Authorize" → Enter "Bearer YOUR_TOKEN" → Authorize
```

---

## Complete Test Workflow

Follow these steps in order to test the complete user progress flow.

### Step 1: Check Initial State

**Objective:** Verify new user has empty progress.

#### Test Steps

1. Navigate to Swagger UI → **User Progress** section
2. Click **GET /api/v1/user-progress**
3. Click **"Try it out"** → **"Execute"**

#### Expected Response

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

#### Validation

- ✅ Status code is 200
- ✅ `articles_completed` is 0
- ✅ `articles` array is empty
- ✅ `challenges_completed` is 0
- ✅ `challenges` array is empty
- ✅ `total_points` is 0

**Note:** If you've already marked progress, you'll see existing data. Consider using a fresh user account for this test.

---

### Step 2: Get Valid Article ID

**Objective:** Obtain a valid article ID from the database.

#### Test Steps

1. Navigate to **Articles** section (public endpoint)
2. Click **GET /api/v1/articles**
3. Click **"Try it out"** → **"Execute"**
4. **Copy an article ID** from the response

#### Example Response

```json
{
  "success": true,
  "articles": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Introduction to Prompt Engineering",
      "slug": "introduction-to-prompt-engineering",
      ...
    }
  ]
}
```

**Copy this ID:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

### Step 3: Mark Article as Completed

**Objective:** Mark an article as completed and verify it's tracked.

#### Test Steps

1. Navigate to **User Progress** section
2. Click **POST /api/v1/user-progress/article**
3. Click **"Try it out"**
4. Enter request body:

```json
{
  "article_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Article marked as completed"
}
```

#### Validation

- ✅ Status code is 200
- ✅ Success message received
- ✅ No errors in response

---

### Step 4: Verify Article Progress

**Objective:** Confirm the article appears in user progress.

#### Test Steps

1. Click **GET /api/v1/user-progress**
2. Click **"Try it out"** → **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "progress": {
    "articles_completed": 1,
    "articles": [
      {
        "id": "progress-uuid",
        "user_id": "your-user-uuid",
        "article_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "completed": true,
        "completed_at": "2024-01-20T10:30:00Z"
      }
    ],
    "challenges_completed": 0,
    "challenges": [],
    "total_points": 0
  }
}
```

#### Validation

- ✅ `articles_completed` is now 1 (increased from 0)
- ✅ `articles` array has 1 item
- ✅ Article ID matches the one we marked
- ✅ `completed` is `true`
- ✅ `completed_at` timestamp is present
- ✅ `user_id` matches your user ID

---

### Step 5: Get Valid Challenge ID

**Objective:** Obtain a valid challenge ID from the database.

#### Test Steps

1. Navigate to **Challenges** section (public endpoint)
2. Click **GET /api/v1/challenges**
3. Click **"Try it out"** → **"Execute"**
4. **Copy a challenge ID** and note its **points** value

#### Example Response

```json
{
  "success": true,
  "challenges": [
    {
      "id": "c1d2e3f4-g5h6-7890-ijkl-mn1234567890",
      "title": "Summarize a Research Paper",
      "difficulty": "easy",
      "points": 10,
      ...
    }
  ]
}
```

**Copy this ID:** `c1d2e3f4-g5h6-7890-ijkl-mn1234567890`  
**Note points:** `10`

---

### Step 6: Mark Challenge as Completed

**Objective:** Mark a challenge as completed with a score.

#### Test Steps

1. Navigate to **User Progress** section
2. Click **POST /api/v1/user-progress/challenge**
3. Click **"Try it out"**
4. Enter request body:

```json
{
  "challenge_id": "c1d2e3f4-g5h6-7890-ijkl-mn1234567890",
  "score": 25
}
```

**Note:** You can use any score value. The challenge's `points` field is just a reference; the actual score you submit is what counts.

5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Challenge marked as completed"
}
```

#### Validation

- ✅ Status code is 200
- ✅ Success message received

---

### Step 7: Verify Challenge Progress

**Objective:** Confirm the challenge appears in user progress with the correct score.

#### Test Steps

1. Click **GET /api/v1/user-progress**
2. Click **"Try it out"** → **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "progress": {
    "articles_completed": 1,
    "articles": [ ... ],
    "challenges_completed": 1,
    "challenges": [
      {
        "id": "challenge-progress-uuid",
        "user_id": "your-user-uuid",
        "challenge_id": "c1d2e3f4-g5h6-7890-ijkl-mn1234567890",
        "completed": true,
        "score": 25,
        "completed_at": "2024-01-20T11:00:00Z"
      }
    ],
    "total_points": 25
  }
}
```

#### Validation

- ✅ `challenges_completed` is now 1 (increased from 0)
- ✅ `challenges` array has 1 item
- ✅ Challenge ID matches the one we marked
- ✅ `score` is 25 (the value we submitted)
- ✅ `total_points` is 25 (sum of all challenge scores)
- ✅ `completed_at` timestamp is present

---

### Step 8: Check User Statistics

**Objective:** Verify aggregated statistics are calculated correctly.

#### Test Steps

1. Navigate to **User Progress** section
2. Click **GET /api/v1/user-progress/stats**
3. Click **"Try it out"** → **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "stats": {
    "articles_completed": 1,
    "challenges_completed": 1,
    "total_points": 25,
    "level": "Beginner"
  }
}
```

#### Validation

- ✅ `articles_completed` matches progress count (1)
- ✅ `challenges_completed` matches progress count (1)
- ✅ `total_points` matches sum of challenge scores (25)
- ✅ `level` is calculated correctly based on points

**Level Calculation:**
- 0-9 points: "Newcomer"
- 10-49 points: "Beginner" ← **We're here with 25 points**
- 50-99 points: "Intermediate"
- 100-199 points: "Advanced"
- 200+ points: "Expert"

---

### Step 9: Test Idempotency (Mark Same Article Twice)

**Objective:** Verify marking the same article twice doesn't create duplicates.

#### Test Steps

1. Navigate to **POST /api/v1/user-progress/article**
2. Mark the **same article** from Step 3 again:

```json
{
  "article_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

3. Execute

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Article marked as completed"
}
```

**Note:** The response is the same, but no duplicate is created.

---

### Step 10: Verify No Duplicate Article

**Objective:** Confirm the article still appears only once.

#### Test Steps

1. Click **GET /api/v1/user-progress**
2. Execute

#### Expected Response

```json
{
  "success": true,
  "progress": {
    "articles_completed": 1,
    "articles": [
      {
        "article_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        ...
      }
    ],
    ...
  }
}
```

#### Validation

- ✅ `articles_completed` is still 1 (not 2)
- ✅ `articles` array has only 1 item
- ✅ The article appears only once
- ✅ Idempotency is working correctly

---

### Step 11: Mark Additional Progress

**Objective:** Add more articles and challenges to test level progression.

#### Test Steps

1. **Mark 2 more articles as completed:**
   - Get 2 more article IDs from **GET /api/v1/articles**
   - Mark each with **POST /api/v1/user-progress/article**

2. **Mark 2 more challenges with higher scores:**
   - Get 2 more challenge IDs from **GET /api/v1/challenges**
   - Mark first with `score: 30`
   - Mark second with `score: 50`

#### Expected Total After This Step

- Articles completed: 3
- Challenges completed: 3
- Total points: 25 + 30 + 50 = 105

---

### Step 12: Verify Level Progression

**Objective:** Confirm level changes as points increase.

#### Test Steps

1. Click **GET /api/v1/user-progress/stats**
2. Execute

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "stats": {
    "articles_completed": 3,
    "challenges_completed": 3,
    "total_points": 105,
    "level": "Advanced"
  }
}
```

#### Validation

- ✅ `articles_completed` is 3
- ✅ `challenges_completed` is 3
- ✅ `total_points` is 105
- ✅ `level` is "Advanced" (100-199 points)

**Level changed from "Beginner" (25 points) to "Advanced" (105 points)!**

---

### Step 13: Verify Final State

**Objective:** Confirm all progress is accurately tracked.

#### Test Steps

1. Click **GET /api/v1/user-progress**
2. Execute

#### Expected Response

```json
{
  "success": true,
  "progress": {
    "articles_completed": 3,
    "articles": [
      { "article_id": "...", ... },
      { "article_id": "...", ... },
      { "article_id": "...", ... }
    ],
    "challenges_completed": 3,
    "challenges": [
      { "challenge_id": "...", "score": 25, ... },
      { "challenge_id": "...", "score": 30, ... },
      { "challenge_id": "...", "score": 50, ... }
    ],
    "total_points": 105
  }
}
```

#### Validation

- ✅ All 3 articles are listed
- ✅ All 3 challenges are listed with correct scores
- ✅ `total_points` equals sum of all scores (25 + 30 + 50 = 105)
- ✅ No duplicates exist
- ✅ All timestamps are present

---

## Level Progression Testing

### Level Thresholds

| Level | Points Required | Description |
|-------|----------------|-------------|
| **Newcomer** | 0 - 9 | Just starting out |
| **Beginner** | 10 - 49 | Learning the basics |
| **Intermediate** | 50 - 99 | Building skills |
| **Advanced** | 100 - 199 | Proficient user |
| **Expert** | 200+ | Master level |

### Test: Progress Through All Levels

**Objective:** Verify level calculation at each threshold.

#### Test Steps

1. **Start at Newcomer (0 points)**
   - Check stats → Level: "Newcomer"

2. **Reach Beginner (10 points)**
   - Mark challenge with `score: 10`
   - Check stats → Level: "Beginner"

3. **Reach Intermediate (50 points)**
   - Mark challenges totaling 40 more points
   - Check stats → Level: "Intermediate"

4. **Reach Advanced (100 points)**
   - Mark challenges totaling 50 more points
   - Check stats → Level: "Advanced"

5. **Reach Expert (200 points)**
   - Mark challenges totaling 100 more points
   - Check stats → Level: "Expert"

#### Validation

- ✅ Level changes at correct point thresholds
- ✅ Level never decreases (points only increase)
- ✅ Level calculation is consistent

---

## Validation Checklist

Use this checklist to verify the complete user progress flow:

### Initial State
- [ ] New user has 0 articles completed
- [ ] New user has 0 challenges completed
- [ ] New user has 0 total points
- [ ] New user level is "Newcomer"

### Article Tracking
- [ ] Can mark article as completed
- [ ] Article appears in progress list
- [ ] `articles_completed` count increases
- [ ] Marking same article twice doesn't create duplicate
- [ ] `completed_at` timestamp is recorded

### Challenge Tracking
- [ ] Can mark challenge as completed with score
- [ ] Challenge appears in progress list with correct score
- [ ] `challenges_completed` count increases
- [ ] `total_points` increases by challenge score
- [ ] Marking same challenge twice updates the score

### Statistics
- [ ] Stats endpoint returns correct counts
- [ ] `total_points` equals sum of all challenge scores
- [ ] Level is calculated correctly based on points
- [ ] Stats update immediately after marking progress

### Level Progression
- [ ] Level starts at "Newcomer" (0 points)
- [ ] Level changes to "Beginner" at 10 points
- [ ] Level changes to "Intermediate" at 50 points
- [ ] Level changes to "Advanced" at 100 points
- [ ] Level changes to "Expert" at 200 points

### Idempotency
- [ ] Marking same article twice is safe (no duplicate)
- [ ] Marking same challenge twice updates score (no duplicate)
- [ ] Progress counts remain accurate after duplicate attempts

### Error Handling
- [ ] Returns 401 if not authenticated
- [ ] Handles invalid article/challenge IDs gracefully
- [ ] Returns descriptive error messages

---

## Common Issues and Solutions

### Issue: Progress Not Updating

**Symptoms:**
- Marked article/challenge but progress count didn't increase
- Stats show 0 despite marking progress

**Solutions:**
1. Verify you're authorized with a valid JWT token
2. Check that the article/challenge ID is valid (from GET endpoints)
3. Refresh the progress endpoint (GET /user-progress)
4. Check backend logs for errors

### Issue: Level Not Changing

**Symptoms:**
- Total points increased but level stayed the same

**Solutions:**
1. Verify points are at the threshold for next level
2. Check level calculation logic (see thresholds above)
3. Refresh stats endpoint (GET /user-progress/stats)

### Issue: Duplicate Progress Items

**Symptoms:**
- Same article appears multiple times in progress

**Solutions:**
1. This shouldn't happen due to `upsert` with `on_conflict`
2. Check database constraints on `user_progress` table
3. Report as a bug if duplicates persist

---

## Next Steps

- **Test error scenarios?** See [Error Scenarios](error-scenarios.md) for comprehensive error testing
- **Need authentication help?** See [Authentication Flow](authentication-flow.md) for token extraction
- **Automate this workflow?** See [Automated Testing](automated-testing.md) for pytest examples
- **Encountering issues?** See [Troubleshooting](troubleshooting.md) for common problems

---

## Related Documentation

- **[README](README.md)**: Testing overview and quick start
- **[Protected APIs](protected-apis.md)**: Detailed documentation for user progress endpoints
- **[Public APIs](public-apis.md)**: Get article and challenge IDs for testing
- **[Authentication Flow](authentication-flow.md)**: JWT token extraction and authorization

---

**Last Updated:** 2024  
**Maintained By:** Prompt Dairy Development Team
