# Prompt Diary Project Status

This document explains what is currently working in the Prompt Diary project, how the full stack is structured, what an admin can do today, and what still remains to be built.

## Current Status

Prompt Diary is a working full-stack learning and practice platform for prompt engineering, AI systems, and LLM workflows.

The project currently has:

- Next.js frontend
- FastAPI backend
- Supabase/PostgreSQL database
- Supabase Auth integration
- Dynamic content APIs
- Learning articles
- Prompt challenges
- Learning roadmaps
- System design learning section
- Prompt playground page
- User dashboard and progress APIs

Local development URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Backend API docs: `http://localhost:8000/docs`

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js App Router, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| API Style | REST |
| Local Frontend Server | `npm run dev` |
| Local Backend Server | `uvicorn app.main:app --reload` |

## Project Structure

```text
Prompt_Diary/
├── frontend/
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   └── package.json
├── backend/
│   ├── app/api/v1/endpoints/
│   ├── app/core/
│   ├── app/models/
│   ├── app/schemas/
│   ├── app/services/
│   └── requirements.txt
├── database/
│   ├── migrations/
│   └── seed/
├── docs/
├── assets/
└── PROJECT_STATUS.md
```

## Working User Features

### Home Page

The home page introduces the platform and links users to the main learning modules.

URL:

```text
http://localhost:3000/
```

### Articles

Users can browse and read learning articles.

URLs:

```text
http://localhost:3000/articles
http://localhost:3000/articles/[slug]
```

Backend APIs:

```text
GET /api/v1/articles
GET /api/v1/articles/{article_id}
GET /api/v1/articles/slug/{slug}
GET /api/v1/articles/system-design
```

Articles are dynamic. They are loaded from the backend, and the backend reads from Supabase when configured.

### Challenges

Users can browse prompt-writing challenges and open individual challenge pages.

URLs:

```text
http://localhost:3000/challenges
http://localhost:3000/challenges/[id]
```

Backend APIs:

```text
GET /api/v1/challenges
GET /api/v1/challenges/{challenge_id}
```

Challenge detail pages currently show:

- Challenge title
- Description
- Difficulty
- Category
- Points
- Starter prompt/context
- Expected output
- Hints
- Prompt attempt UI

### Roadmaps

Users can view structured learning paths.

URL:

```text
http://localhost:3000/roadmaps
```

Backend APIs:

```text
GET /api/v1/roadmaps
GET /api/v1/roadmaps/{roadmap_id}
```

Roadmaps include:

- Beginner/intermediate/advanced paths
- Topics
- Estimated hours
- Links toward learning content

### System Design

Users can explore AI system architecture learning material.

URL:

```text
http://localhost:3000/system-design
```

This section displays:

- AI system architecture flow
- System design checklist
- Architecture-focused article links

### Prompt Playground

Users can open the playground page and test prompts.

URL:

```text
http://localhost:3000/playground
```

Backend APIs:

```text
POST /api/v1/playground/run
GET /api/v1/playground/models
```

Current playground behavior is basic/simulated unless real LLM API keys are configured.

### Search

Users can search across learning content.

URL:

```text
http://localhost:3000/search
```

Backend API:

```text
GET /api/v1/search?q=...
```

### Auth

The frontend has login, signup, and auth callback pages.

URLs:

```text
http://localhost:3000/login
http://localhost:3000/signup
http://localhost:3000/auth/callback
```

Auth is powered by Supabase Auth when Supabase environment variables are configured.

### Dashboard

Logged-in users can access the dashboard.

URL:

```text
http://localhost:3000/dashboard
```

The dashboard is designed to show:

- User identity
- Articles completed
- Challenges completed
- Total points
- Level
- Recent learning activity

Backend APIs:

```text
GET /api/v1/user-progress
GET /api/v1/user-progress/stats
POST /api/v1/user-progress/article
POST /api/v1/user-progress/challenge
```

## Working Backend Features

The backend is a FastAPI app.

Main backend file:

```text
backend/app/main.py
```

API router:

```text
backend/app/api/v1/router.py
```

Backend endpoint groups:

- Articles
- Challenges
- Roadmaps
- Auth
- User progress
- Search
- Playground

Backend health check:

```text
GET /
GET /info
```

## Working Database Tables

The database schema is defined in:

```text
database/migrations/
```

Main tables:

- `profiles`
- `articles`
- `challenges`
- `roadmaps`
- `user_progress`
- `challenge_progress`

Seed data exists in:

```text
database/migrations/003_seed_data.sql
database/seed/seed_data.sql
```

## Current Admin Workflow

There is no website admin panel yet.

Today, admin management is done through Supabase directly.

Admins can use Supabase Table Editor or SQL Editor to manage:

- Articles
- Challenges
- Roadmaps
- Users/profiles
- Progress records
- Challenge progress

### Add Article

Admins can insert into the `articles` table.

Required/common fields:

- `title`
- `slug`
- `content`
- `excerpt`
- `category`
- `difficulty`
- `tags`
- `published`

Example:

```sql
insert into public.articles
(title, slug, content, excerpt, category, difficulty, tags, published)
values
(
  'My New Prompt Article',
  'my-new-prompt-article',
  '# My New Prompt Article

Article content here...',
  'Short summary of the article.',
  'fundamentals',
  'beginner',
  array['prompting', 'ai'],
  true
);
```

After adding an article, it appears on:

```text
http://localhost:3000/articles
```

### Add Challenge

Admins can insert into the `challenges` table.

Required/common fields:

- `title`
- `description`
- `difficulty`
- `category`
- `starter_prompt`
- `expected_output`
- `hints`
- `points`

Example:

```sql
insert into public.challenges
(title, description, difficulty, category, starter_prompt, expected_output, hints, points)
values
(
  'Rewrite for Tone',
  'Create a prompt that rewrites a formal email into a friendly Slack message.',
  'easy',
  'transformation',
  'Rewrite this formal email as a friendly Slack message...',
  'A concise Slack-style message preserving all key information.',
  array['Mention tone clearly', 'Preserve dates and names', 'Set a length limit'],
  10
);
```

After adding a challenge, it appears on:

```text
http://localhost:3000/challenges
```

### Add Roadmap

Admins can insert into the `roadmaps` table.

Required/common fields:

- `title`
- `level`
- `description`
- `topics`
- `estimated_hours`

Example:

```sql
insert into public.roadmaps
(title, level, description, topics, estimated_hours)
values
(
  'Prompt Engineering Mastery',
  'advanced',
  'A deep learning path for advanced prompting and AI workflows.',
  '[
    {"order": 1, "title": "Prompt Security", "description": "Understand prompt injection"},
    {"order": 2, "title": "Evaluation", "description": "Learn prompt scoring and testing"}
  ]'::jsonb,
  15
);
```

## Environment Variables

Backend environment file:

```text
backend/.env
```

Important backend variables:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=
GEMINI_API_KEY=
```

Frontend environment file:

```text
frontend/.env.local
```

Important frontend variables:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
API_URL=http://localhost:8000/api/v1
```

## How To Run Locally

### Start Backend

```cmd
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Backend should run at:

```text
http://localhost:8000
```

### Start Frontend

```cmd
cd frontend
npm run dev
```

Frontend should run at:

```text
http://localhost:3000
```

## What Is Dynamic Today

The following content is dynamic through backend APIs and Supabase:

- Articles
- Article detail pages
- Challenges
- Challenge detail pages
- Roadmaps
- System design article list
- User progress
- User stats

If the backend or Supabase is unavailable, several frontend pages have fallback demo data so the UI still loads.

## What Is Not Finished Yet

### Admin Panel

There is no frontend admin dashboard yet.

Remaining admin features:

- `/admin` dashboard
- Admin login/role check
- Create article UI
- Edit article UI
- Delete/unpublish article UI
- Create challenge UI
- Edit challenge UI
- Delete challenge UI
- Create roadmap UI
- Edit roadmap UI
- User management UI
- View user progress
- View challenge submissions

### Auto-Evaluation

Auto-evaluation is not fully implemented yet.

Current challenge attempt UI does not truly grade prompts with an LLM.

Planned Phase 4 flow:

1. User submits prompt attempt.
2. Backend receives submission.
3. Backend sends challenge details and user prompt to an LLM.
4. LLM returns:
   - Score
   - Feedback
   - Strengths
   - Improvements
   - Suggested better prompt
5. Backend stores the result in `challenge_progress`.
6. Frontend shows the evaluation result to the user.

Suggested future API:

```text
POST /api/v1/challenges/{challenge_id}/evaluate
```

Suggested response shape:

```json
{
  "success": true,
  "score": 82,
  "feedback": "Your prompt is clear but needs a stricter output format.",
  "strengths": ["Clear task", "Good constraints"],
  "improvements": ["Add examples", "Specify JSON schema"],
  "suggested_prompt": "Rewrite..."
}
```

### Human Review Workflow

Human review is not implemented yet.

Remaining features:

- Store submitted prompts
- Admin/reviewer queue
- Reviewer comments
- Manual score
- Approval/rejection status
- Review history

### Playground With Real LLMs

The playground exists, but production LLM behavior depends on API keys and backend implementation.

Remaining features:

- Real OpenAI/Gemini model calls
- Model selector connected to backend
- Token/cost estimates
- Prompt history
- Save prompt experiments
- Error handling for provider failures

### Search Upgrade

Current search is basic.

Future improvements:

- Full-text search
- Filters
- Search ranking
- Meilisearch integration
- Highlight matched text

### Production Readiness

Remaining deployment tasks:

- Configure production Supabase project
- Configure deployed backend URL
- Configure deployed frontend URL
- Set CORS origins
- Set secure JWT secret
- Add logging
- Add monitoring
- Add tests
- Add CI/CD
- Add role-based access control

## Recommended Next Steps

1. Build `/admin` routes.
2. Add admin role support.
3. Build article create/edit forms.
4. Build challenge create/edit forms.
5. Build roadmap editor.
6. Add challenge submission storage.
7. Add LLM-based auto-evaluation.
8. Add human review queue.
9. Add production deployment configuration.

## Summary

Prompt Diary is currently a functional full-stack learning platform foundation.

Users can browse learning content, challenges, roadmaps, system design material, and use the dashboard/progress flow when auth is configured.

Admins can manage content today through Supabase, but a proper website-based admin panel is still pending.

The most important remaining work is:

- Admin dashboard
- Dynamic content creation UI
- Auto-evaluation
- Human review workflow
- Production deployment hardening
