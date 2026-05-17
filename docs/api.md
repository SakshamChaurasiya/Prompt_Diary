# Prompt Dairy — API Documentation

## Base URL

- **Development:** `http://localhost:8000/api/v1`
- **Production:** Set via `NEXT_PUBLIC_API_URL` environment variable

## Authentication

Prompt Dairy uses **Supabase Auth**. The frontend handles signup/login via the Supabase JS client. The backend verifies JWTs for protected endpoints.

**Protected endpoints** require a `Bearer` token in the `Authorization` header:
```
Authorization: Bearer <supabase_jwt_token>
```

---

## Endpoints

### Health Check

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | No | API health check |
| `GET` | `/info` | No | Application metadata |

---

### Articles

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/articles` | No | List all published articles |
| `GET` | `/api/v1/articles/{id}` | No | Get article by ID |
| `GET` | `/api/v1/articles/slug/{slug}` | No | Get article by URL slug |
| `GET` | `/api/v1/articles/system-design` | No | List architecture articles |

**Query Parameters (list):**
- `category` — Filter: `fundamentals`, `techniques`, `architecture`
- `difficulty` — Filter: `beginner`, `intermediate`, `advanced`

---

### Challenges

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/challenges` | No | List all challenges |
| `GET` | `/api/v1/challenges/{id}` | No | Get challenge by ID |

**Query Parameters (list):**
- `difficulty` — Filter: `easy`, `medium`, `hard`
- `category` — Filter: `summarization`, `extraction`, `reasoning`, `role-playing`, `chaining`

---

### Roadmaps

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/roadmaps` | No | List all roadmaps |
| `GET` | `/api/v1/roadmaps/{id}` | No | Get roadmap by ID |

**Query Parameters (list):**
- `level` — Filter: `beginner`, `intermediate`, `advanced`

---

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/auth/me` | Yes | Get current user profile |
| `PUT` | `/api/v1/auth/profile` | Yes | Update user profile |
| `GET` | `/api/v1/auth/status` | Optional | Check auth status |

**Profile Update Body:**
```json
{
  "username": "string (optional)",
  "display_name": "string (optional)",
  "bio": "string (optional)",
  "avatar_url": "string (optional)"
}
```

---

### User Progress

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/user-progress` | Yes | Get all user progress |
| `GET` | `/api/v1/user-progress/stats` | Yes | Get aggregated stats |
| `POST` | `/api/v1/user-progress/article` | Yes | Mark article completed |
| `POST` | `/api/v1/user-progress/challenge` | Yes | Mark challenge completed |

**Mark Article Body:**
```json
{
  "article_id": "uuid"
}
```

**Mark Challenge Body:**
```json
{
  "challenge_id": "uuid",
  "score": 20
}
```

---

### Search

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/search?q=...` | No | Search all content |

**Query Parameters:**
- `q` (required) — Search query (min 2 characters)
- `type` (optional) — Filter: `articles`, `challenges`, `roadmaps`

**Response:**
```json
{
  "articles": [...],
  "challenges": [...],
  "roadmaps": [...],
  "total": 5
}
```

---

### Playground

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/playground/models` | No | List available models |
| `POST` | `/api/v1/playground/run` | Optional | Execute a prompt |

**Run Prompt Body:**
```json
{
  "prompt": "Your prompt text here",
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 500,
  "system_prompt": "Optional system prompt"
}
```

---

## Interactive Docs

When the backend is running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
