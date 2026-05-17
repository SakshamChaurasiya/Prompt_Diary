# Public APIs Testing Guide

This guide provides comprehensive test scenarios for all public API endpoints that don't require authentication. These endpoints can be tested immediately without obtaining a JWT token.

## Table of Contents

1. [Overview](#overview)
2. [Articles Endpoints](#articles-endpoints)
3. [Challenges Endpoints](#challenges-endpoints)
4. [Roadmaps Endpoints](#roadmaps-endpoints)
5. [Search Endpoint](#search-endpoint)
6. [Playground Endpoints](#playground-endpoints)
7. [Common Testing Patterns](#common-testing-patterns)

---

## Overview

### What are Public APIs?

Public APIs are endpoints that **do not require authentication**. Anyone can access them without a JWT token, making them ideal for:

- Browsing available content (articles, challenges, roadmaps)
- Searching across the platform
- Testing the playground with AI models
- Public-facing features

### Testing Prerequisites

- Backend running at `http://localhost:8000`
- Database seeded with test data
- Swagger UI accessible at `http://localhost:8000/docs`

### Quick Start

1. Open Swagger UI: `http://localhost:8000/docs`
2. Navigate to any public endpoint section
3. Click endpoint → "Try it out" → Execute
4. No authorization required!

---

## Articles Endpoints

Articles are educational content pieces covering prompt engineering fundamentals, techniques, and architecture.

### GET /api/v1/articles

List all published articles with optional filtering.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/articles`  
**Authentication:** None required

**Query Parameters:**

| Parameter | Type | Required | Valid Values | Description |
|-----------|------|----------|--------------|-------------|
| `category` | string | No | `fundamentals`, `techniques`, `architecture` | Filter by article category |
| `difficulty` | string | No | `beginner`, `intermediate`, `advanced` | Filter by difficulty level |

#### Test Steps

1. Navigate to Swagger UI → **Articles** section
2. Click **GET /api/v1/articles**
3. Click **"Try it out"**
4. Leave parameters empty (or add filters)
5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "articles": [
    {
      "id": "uuid-here",
      "title": "Introduction to Prompt Engineering",
      "slug": "introduction-to-prompt-engineering",
      "excerpt": "Learn the fundamentals of crafting effective prompts...",
      "category": "fundamentals",
      "difficulty": "beginner",
      "read_time": 5,
      "published": true,
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "uuid-here-2",
      "title": "Advanced Chain-of-Thought Prompting",
      "slug": "advanced-chain-of-thought",
      "excerpt": "Master complex reasoning with chain-of-thought techniques...",
      "category": "techniques",
      "difficulty": "advanced",
      "read_time": 12,
      "published": true,
      "created_at": "2024-01-20T14:30:00Z"
    }
  ]
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `success: true`
- ✅ `articles` array is present
- ✅ Each article has required fields: `id`, `title`, `slug`, `category`, `difficulty`
- ✅ All articles have `published: true`

#### Filter Test: Category

**Test Steps:**
1. Set `category` = `fundamentals`
2. Execute

**Expected:** All returned articles have `"category": "fundamentals"`

**Validation:**
```javascript
// All articles should match the filter
articles.every(article => article.category === "fundamentals")
```

#### Filter Test: Difficulty

**Test Steps:**
1. Set `difficulty` = `beginner`
2. Execute

**Expected:** All returned articles have `"difficulty": "beginner"`

#### Filter Test: Combined

**Test Steps:**
1. Set `category` = `techniques`
2. Set `difficulty` = `intermediate`
3. Execute

**Expected:** All returned articles match BOTH filters

---

### GET /api/v1/articles/system-design

List architecture-focused articles for the System Design module.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/articles/system-design`  
**Authentication:** None required  
**Query Parameters:** None

#### Test Steps

1. Navigate to Swagger UI → **Articles** section
2. Click **GET /api/v1/articles/system-design**
3. Click **"Try it out"** → **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "articles": [
    {
      "id": "uuid-here",
      "title": "Designing Scalable AI Systems",
      "slug": "designing-scalable-ai-systems",
      "category": "architecture",
      "difficulty": "advanced",
      ...
    }
  ]
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ All returned articles have `"category": "architecture"`
- ✅ This is equivalent to calling `/articles?category=architecture`

---

### GET /api/v1/articles/slug/{slug}

Get a single article by its URL slug.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/articles/slug/{slug}`  
**Authentication:** None required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | URL-friendly article identifier |

#### Test Steps

1. First, get a valid slug from the list endpoint:
   - Execute **GET /api/v1/articles**
   - Copy a `slug` value (e.g., `"introduction-to-prompt-engineering"`)
2. Navigate to **GET /api/v1/articles/slug/{slug}**
3. Click **"Try it out"**
4. Enter the slug in the `slug` field
5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "article": {
    "id": "uuid-here",
    "title": "Introduction to Prompt Engineering",
    "slug": "introduction-to-prompt-engineering",
    "excerpt": "Learn the fundamentals...",
    "content": "# Introduction\n\nPrompt engineering is...",
    "category": "fundamentals",
    "difficulty": "beginner",
    "read_time": 5,
    "published": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `success: true`
- ✅ `article` object is present (not an array)
- ✅ Article has full `content` field (not just excerpt)
- ✅ `slug` matches the requested slug

#### Error Test: Invalid Slug

**Test Steps:**
1. Enter a non-existent slug: `"this-article-does-not-exist"`
2. Execute

**Expected Response:**

**Status Code:** `404 Not Found`

```json
{
  "detail": "Article not found"
}
```

---

### GET /api/v1/articles/{article_id}

Get a single article by its ID.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/articles/{article_id}`  
**Authentication:** None required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `article_id` | string (UUID) | Yes | Unique article identifier |

#### Test Steps

1. First, get a valid ID from the list endpoint:
   - Execute **GET /api/v1/articles**
   - Copy an `id` value (UUID format)
2. Navigate to **GET /api/v1/articles/{article_id}**
3. Click **"Try it out"**
4. Paste the ID in the `article_id` field
5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "article": {
    "id": "uuid-here",
    "title": "Introduction to Prompt Engineering",
    "slug": "introduction-to-prompt-engineering",
    "content": "# Introduction\n\nFull article content here...",
    "category": "fundamentals",
    "difficulty": "beginner",
    ...
  }
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ `article.id` matches the requested ID
- ✅ Full article content is included

#### Error Test: Invalid ID

**Test Steps:**
1. Enter a non-existent UUID: `"00000000-0000-0000-0000-000000000000"`
2. Execute

**Expected:** `404 Not Found` with `"detail": "Article not found"`

---

## Challenges Endpoints

Challenges are hands-on prompt engineering exercises with varying difficulty levels.

### GET /api/v1/challenges

List all prompt challenges with optional filtering.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/challenges`  
**Authentication:** None required

**Query Parameters:**

| Parameter | Type | Required | Valid Values | Description |
|-----------|------|----------|--------------|-------------|
| `difficulty` | string | No | `easy`, `medium`, `hard` | Filter by difficulty |
| `category` | string | No | `summarization`, `extraction`, `reasoning`, `role-playing`, `chaining` | Filter by category |

#### Test Steps

1. Navigate to Swagger UI → **Challenges** section
2. Click **GET /api/v1/challenges**
3. Click **"Try it out"**
4. Optionally add filters
5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "challenges": [
    {
      "id": "uuid-here",
      "title": "Summarize a Research Paper",
      "description": "Create a prompt that summarizes academic papers...",
      "difficulty": "easy",
      "category": "summarization",
      "points": 10,
      "estimated_time": 15,
      "created_at": "2024-01-10T09:00:00Z"
    },
    {
      "id": "uuid-here-2",
      "title": "Multi-Step Reasoning Challenge",
      "description": "Design a prompt that solves complex logic puzzles...",
      "difficulty": "hard",
      "category": "reasoning",
      "points": 50,
      "estimated_time": 45,
      "created_at": "2024-01-12T11:00:00Z"
    }
  ]
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `success: true`
- ✅ `challenges` array is present
- ✅ Each challenge has: `id`, `title`, `description`, `difficulty`, `category`, `points`

#### Filter Test: Difficulty

**Test Steps:**
1. Set `difficulty` = `easy`
2. Execute

**Expected:** All challenges have `"difficulty": "easy"`

#### Filter Test: Category

**Test Steps:**
1. Set `category` = `summarization`
2. Execute

**Expected:** All challenges have `"category": "summarization"`

#### Filter Test: Combined

**Test Steps:**
1. Set `difficulty` = `medium`
2. Set `category` = `extraction`
3. Execute

**Expected:** All challenges match both filters

---

### GET /api/v1/challenges/{challenge_id}

Get a single challenge by its ID.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/challenges/{challenge_id}`  
**Authentication:** None required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `challenge_id` | string (UUID) | Yes | Unique challenge identifier |

#### Test Steps

1. Get a valid ID from **GET /api/v1/challenges**
2. Navigate to **GET /api/v1/challenges/{challenge_id}**
3. Click **"Try it out"**
4. Paste the challenge ID
5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "challenge": {
    "id": "uuid-here",
    "title": "Summarize a Research Paper",
    "description": "Create a prompt that summarizes academic papers into concise abstracts...",
    "difficulty": "easy",
    "category": "summarization",
    "points": 10,
    "estimated_time": 15,
    "instructions": "1. Read the paper\n2. Identify key points\n3. Create a summarization prompt...",
    "example_input": "Sample research paper text...",
    "example_output": "Expected summary format...",
    "hints": ["Focus on the abstract and conclusion", "Use structured output"],
    "created_at": "2024-01-10T09:00:00Z"
  }
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ `challenge` object (not array) is present
- ✅ Full challenge details including `instructions`, `example_input`, `example_output`, `hints`
- ✅ `challenge.id` matches requested ID

#### Error Test: Invalid ID

**Expected:** `404 Not Found` with `"detail": "Challenge not found"`

---

## Roadmaps Endpoints

Roadmaps are structured learning paths for different skill levels.

### GET /api/v1/roadmaps

List all learning roadmaps with optional filtering.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/roadmaps`  
**Authentication:** None required

**Query Parameters:**

| Parameter | Type | Required | Valid Values | Description |
|-----------|------|----------|--------------|-------------|
| `level` | string | No | `beginner`, `intermediate`, `advanced` | Filter by skill level |

#### Test Steps

1. Navigate to Swagger UI → **Roadmaps** section
2. Click **GET /api/v1/roadmaps**
3. Click **"Try it out"**
4. Optionally set `level` filter
5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "roadmaps": [
    {
      "id": "uuid-here",
      "title": "Prompt Engineering Fundamentals",
      "description": "Master the basics of prompt engineering...",
      "level": "beginner",
      "estimated_hours": 10,
      "modules": 5,
      "created_at": "2024-01-05T08:00:00Z"
    },
    {
      "id": "uuid-here-2",
      "title": "Advanced Prompt Techniques",
      "description": "Learn sophisticated prompting strategies...",
      "level": "advanced",
      "estimated_hours": 25,
      "modules": 8,
      "created_at": "2024-01-08T10:00:00Z"
    }
  ]
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `success: true`
- ✅ `roadmaps` array is present
- ✅ Each roadmap has: `id`, `title`, `description`, `level`, `estimated_hours`, `modules`

#### Filter Test: Level

**Test Steps:**
1. Set `level` = `beginner`
2. Execute

**Expected:** All roadmaps have `"level": "beginner"`

---

### GET /api/v1/roadmaps/{roadmap_id}

Get a single roadmap by its ID.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/roadmaps/{roadmap_id}`  
**Authentication:** None required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roadmap_id` | string (UUID) | Yes | Unique roadmap identifier |

#### Test Steps

1. Get a valid ID from **GET /api/v1/roadmaps**
2. Navigate to **GET /api/v1/roadmaps/{roadmap_id}**
3. Click **"Try it out"**
4. Paste the roadmap ID
5. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "roadmap": {
    "id": "uuid-here",
    "title": "Prompt Engineering Fundamentals",
    "description": "Master the basics of prompt engineering...",
    "level": "beginner",
    "estimated_hours": 10,
    "modules": [
      {
        "id": "module-1",
        "title": "Introduction to Prompts",
        "order": 1,
        "articles": ["article-id-1", "article-id-2"],
        "challenges": ["challenge-id-1"]
      },
      {
        "id": "module-2",
        "title": "Prompt Structure",
        "order": 2,
        "articles": ["article-id-3"],
        "challenges": ["challenge-id-2", "challenge-id-3"]
      }
    ],
    "created_at": "2024-01-05T08:00:00Z"
  }
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ `roadmap` object (not array) is present
- ✅ Full roadmap details including `modules` array
- ✅ Each module has: `id`, `title`, `order`, `articles`, `challenges`
- ✅ `roadmap.id` matches requested ID

#### Error Test: Invalid ID

**Expected:** `404 Not Found` with `"detail": "Roadmap not found"`

---

## Search Endpoint

Search across all content types (articles, challenges, roadmaps).

### GET /api/v1/search

Search across all platform content.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/search`  
**Authentication:** None required

**Query Parameters:**

| Parameter | Type | Required | Valid Values | Description |
|-----------|------|----------|--------------|-------------|
| `q` | string | **Yes** | Any text (min 2 chars) | Search query |
| `type` | string | No | `articles`, `challenges`, `roadmaps` | Filter by content type |

#### Test Steps

1. Navigate to Swagger UI → **Search** section
2. Click **GET /api/v1/search**
3. Click **"Try it out"**
4. Enter a search query in `q` (e.g., `"prompt"`)
5. Optionally set `type` filter
6. Click **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "articles": [
    {
      "id": "uuid-here",
      "title": "Introduction to Prompt Engineering",
      "slug": "introduction-to-prompt-engineering",
      "excerpt": "Learn the fundamentals...",
      "category": "fundamentals",
      "difficulty": "beginner"
    }
  ],
  "challenges": [
    {
      "id": "uuid-here",
      "title": "Prompt Optimization Challenge",
      "description": "Optimize prompts for better results...",
      "difficulty": "medium",
      "category": "reasoning",
      "points": 25
    }
  ],
  "roadmaps": [
    {
      "id": "uuid-here",
      "title": "Prompt Engineering Fundamentals",
      "description": "Master the basics...",
      "level": "beginner",
      "estimated_hours": 10
    }
  ],
  "total": 3
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `articles`, `challenges`, `roadmaps` arrays
- ✅ `total` field shows sum of all results
- ✅ Search query appears in titles, descriptions, or content of results

#### Test: Search All Content

**Test Steps:**
1. Set `q` = `"prompt"`
2. Leave `type` empty
3. Execute

**Expected:** Results from all three content types

#### Test: Filter by Type (Articles)

**Test Steps:**
1. Set `q` = `"engineering"`
2. Set `type` = `articles`
3. Execute

**Expected:**
- `articles` array has results
- `challenges` and `roadmaps` arrays are empty

#### Test: Filter by Type (Challenges)

**Test Steps:**
1. Set `q` = `"summarize"`
2. Set `type` = `challenges`
3. Execute

**Expected:** Only `challenges` array has results

#### Test: Minimum Query Length

**Test Steps:**
1. Set `q` = `"a"` (1 character)
2. Execute

**Expected Response:**

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

---

## Playground Endpoints

Test AI models with custom prompts (simulated responses in current version).

### GET /api/v1/playground/models

List available AI models for the playground.

#### Request Format

**Method:** GET  
**Path:** `/api/v1/playground/models`  
**Authentication:** None required  
**Query Parameters:** None

#### Test Steps

1. Navigate to Swagger UI → **Playground** section
2. Click **GET /api/v1/playground/models**
3. Click **"Try it out"** → **"Execute"**

#### Expected Response

**Status Code:** `200 OK`

```json
{
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "OpenAI",
      "available": true,
      "description": "Most capable OpenAI model for complex tasks"
    },
    {
      "id": "gpt-3.5-turbo",
      "name": "GPT-3.5 Turbo",
      "provider": "OpenAI",
      "available": true,
      "description": "Fast and cost-effective for simpler tasks"
    },
    {
      "id": "gemini-pro",
      "name": "Gemini Pro",
      "provider": "Google",
      "available": false,
      "description": "Google's advanced multimodal model"
    },
    {
      "id": "claude-3",
      "name": "Claude 3",
      "provider": "Anthropic",
      "available": false,
      "description": "Anthropic's thoughtful AI assistant"
    },
    {
      "id": "llama-3",
      "name": "Llama 3",
      "provider": "Meta (via HuggingFace)",
      "available": false,
      "description": "Open-source model from Meta AI"
    }
  ],
  "total": 5
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ `models` array is present
- ✅ Each model has: `id`, `name`, `provider`, `available`, `description`
- ✅ `available` field indicates if API key is configured
- ✅ `total` matches number of models

---

### POST /api/v1/playground/run

Execute a prompt against an AI model (currently returns simulated responses).

#### Request Format

**Method:** POST  
**Path:** `/api/v1/playground/run`  
**Authentication:** Optional (works without token)

**Request Body:**

```json
{
  "prompt": "string (required, 1-10000 chars)",
  "model": "string (default: gpt-4)",
  "temperature": 0.7,
  "max_tokens": 500,
  "system_prompt": "string (optional)"
}
```

**Field Descriptions:**

| Field | Type | Required | Default | Valid Range | Description |
|-------|------|----------|---------|-------------|-------------|
| `prompt` | string | Yes | - | 1-10000 chars | The prompt text to execute |
| `model` | string | No | `gpt-4` | Any model ID | Model to use for generation |
| `temperature` | float | No | `0.7` | 0.0 - 2.0 | Sampling temperature (higher = more creative) |
| `max_tokens` | int | No | `500` | 1 - 4000 | Maximum tokens to generate |
| `system_prompt` | string | No | `null` | - | Optional system prompt for context |

#### Test Steps

1. Navigate to Swagger UI → **Playground** section
2. Click **POST /api/v1/playground/run**
3. Click **"Try it out"**
4. Enter request body (see examples below)
5. Click **"Execute"**

#### Test: Basic Prompt

**Request Body:**

```json
{
  "prompt": "Explain what prompt engineering is in simple terms.",
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 200
}
```

**Expected Response:**

**Status Code:** `200 OK`

```json
{
  "success": true,
  "response": "Great question! Let me break this down:\n\n## Overview\nThis concept relates to how AI systems process and generate responses...",
  "model": "gpt-4",
  "simulated": true,
  "usage": {
    "input_tokens": 10,
    "output_tokens": 85,
    "total_tokens": 95
  },
  "latency_ms": 125.3,
  "note": "This is a simulated response. Configure LLM API keys for real model integration."
}
```

#### Validation Criteria

- ✅ Status code is 200
- ✅ Response contains `success: true`
- ✅ `response` field contains generated text
- ✅ `simulated: true` indicates this is a mock response
- ✅ `usage` object shows token counts
- ✅ `latency_ms` shows response time

#### Test: Summarization Prompt

**Request Body:**

```json
{
  "prompt": "Summarize the following article: [article text here]",
  "model": "gpt-3.5-turbo",
  "temperature": 0.5,
  "max_tokens": 150
}
```

**Expected:** Response contains a structured summary with key points

#### Test: Code Generation Prompt

**Request Body:**

```json
{
  "prompt": "Write a Python function that calculates the factorial of a number.",
  "model": "gpt-4",
  "temperature": 0.3,
  "max_tokens": 300
}
```

**Expected:** Response contains Python code with explanation

#### Test: JSON Extraction Prompt

**Request Body:**

```json
{
  "prompt": "Extract the following information as JSON: name, category, rating from this text: [text here]",
  "model": "gpt-4",
  "temperature": 0.2,
  "max_tokens": 200
}
```

**Expected:** Response contains structured JSON output

#### Test: With System Prompt

**Request Body:**

```json
{
  "prompt": "What is the capital of France?",
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 100,
  "system_prompt": "You are a helpful geography tutor. Provide concise, educational answers."
}
```

**Expected:** Response is influenced by the system prompt context

#### Error Test: Empty Prompt

**Request Body:**

```json
{
  "prompt": "",
  "model": "gpt-4"
}
```

**Expected Response:**

**Status Code:** `422 Unprocessable Entity`

```json
{
  "detail": [
    {
      "loc": ["body", "prompt"],
      "msg": "ensure this value has at least 1 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

#### Error Test: Invalid Temperature

**Request Body:**

```json
{
  "prompt": "Test prompt",
  "temperature": 3.0
}
```

**Expected:** `422` error indicating temperature must be between 0 and 2

---

## Common Testing Patterns

### Pattern 1: List → Detail Workflow

Test the common pattern of listing items then viewing details:

```
1. GET /api/v1/articles (get list)
2. Copy an article ID from response
3. GET /api/v1/articles/{id} (get details)
4. Verify detail response has more information than list item
```

### Pattern 2: Filter Validation

Verify filters work correctly:

```
1. GET /api/v1/articles (no filters) → count total
2. GET /api/v1/articles?category=fundamentals → count filtered
3. Verify filtered count ≤ total count
4. Verify all results match filter criteria
```

### Pattern 3: Search Relevance

Test search returns relevant results:

```
1. GET /api/v1/search?q=prompt
2. Verify "prompt" appears in titles/descriptions of results
3. Try different queries and verify relevance
```

### Pattern 4: Error Handling

Test error responses:

```
1. Call endpoint with invalid ID → expect 404
2. Call endpoint with invalid parameters → expect 422
3. Verify error messages are descriptive
```

### Pattern 5: Pagination (Future)

When pagination is implemented:

```
1. GET /api/v1/articles?page=1&page_size=10
2. Verify response has pagination metadata
3. GET /api/v1/articles?page=2&page_size=10
4. Verify different results on page 2
```

---

## Response Format Reference

### Success Response Structure

```json
{
  "success": true,
  "data": { ... }
}
```

### List Response Structure

```json
{
  "success": true,
  "items": [ ... ],
  "total": 42
}
```

### Error Response Structure

```json
{
  "detail": "Error message"
}
```

### Validation Error Structure

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

## Next Steps

- **Need authentication?** See [Authentication Flow](authentication-flow.md) to get your JWT token
- **Test protected endpoints?** See [Protected APIs](protected-apis.md) for user profile and progress tracking
- **Test error scenarios?** See [Error Scenarios](error-scenarios.md) for comprehensive error testing
- **Automate tests?** See [Automated Testing](automated-testing.md) for pytest examples

---

## Related Documentation

- **[README](README.md)**: Testing overview and quick start
- **[Authentication Flow](authentication-flow.md)**: JWT token extraction and authorization
- **[API Reference](../api.md)**: Complete endpoint documentation
- **[Troubleshooting](troubleshooting.md)**: Common issues and solutions

---

**Last Updated:** 2024  
**Maintained By:** Prompt Dairy Development Team
