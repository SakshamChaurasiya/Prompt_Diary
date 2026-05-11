# 🧠 Prompt Dairy

> A learning + practice ecosystem for **Prompt Engineering, AI Systems, and LLM Workflows**.

Think GeeksforGeeks, but for AI — learn the theory, practice prompt writing, explore AI architectures, and experiment in a live playground.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js (App Router) + TypeScript + TailwindCSS v4 |
| **Backend** | Python + FastAPI + REST APIs |
| **Database** | PostgreSQL via Supabase (free tier) |
| **Auth** | Supabase Auth |
| **Search** | Meilisearch (Phase 2) |
| **Hosting** | Vercel (frontend) · Railway/Fly.io (backend) · Supabase (database) |

---

## 📁 Project Structure

```
prompt-dairy/
├── frontend/       # Next.js application
├── backend/        # FastAPI application
├── database/       # SQL migrations & seed data
├── docs/           # Architecture & design documents
└── assets/         # Static assets (logos, images)
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v18+ and npm
- **Python** 3.10+
- **Git**
- **Supabase account** (free tier) — [Sign up here](https://supabase.com)

### 1. Clone the repo
```bash
git clone https://github.com/your-org/prompt-dairy.git
cd prompt-dairy
```

### 2. Configure Authentication

**⚠️ Important:** Before running the application, you need to set up Supabase authentication.

Follow the comprehensive setup guide: **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)**

Quick summary:
1. Create a Supabase project
2. Copy environment variables to `frontend/.env.local` and `backend/.env`
3. (Optional) Configure Google and GitHub OAuth providers

### 3. Start the Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

### 5. Test Authentication

Visit `http://localhost:3000/signup` to create an account or `http://localhost:3000/login` to sign in.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) | Complete guide for setting up Supabase authentication with OAuth providers |
| [backend/CONFIGURATION_SETUP.md](./backend/CONFIGURATION_SETUP.md) | Backend configuration and environment variable validation |
| [docs/architecture.md](./docs/architecture.md) | System architecture and design decisions |

### Environment Variables

**Frontend** (`frontend/.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anonymous key

**Backend** (`backend/.env`):
- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_ANON_KEY` — Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key (keep secret!)
- `JWT_SECRET` — Your Supabase JWT secret (must match Supabase project)
- `JWT_ALGORITHM` — Set to `HS256` for Supabase compatibility

See example files:
- `frontend/.env.local.example`
- `backend/.env.example`

---

## 📌 Modules

| Module | Description | Status |
|--------|-------------|--------|
| Learning Platform | Articles, tutorials, prompt patterns | 🔄 Phase 2 |
| Prompt Challenges | Practice prompt writing | 🔄 Phase 2 |
| Learning Roadmaps | Structured learning paths | 🔄 Phase 2 |
| Prompt Playground | Interactive prompt testing | 🔄 Phase 4 |
| System Design | AI architecture guides | 🔄 Phase 2 |

---

## 🌿 Git Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `dev` | Integration branch |
| `feature/*` | Feature branches (e.g., `feature/articles`) |

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

## 👥 Team

Built by the Prompt Dairy intern development team.
