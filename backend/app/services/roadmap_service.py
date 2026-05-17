"""
Roadmap service — business logic for learning roadmaps.

Queries Supabase PostgreSQL for roadmaps data.
Falls back to mock data if Supabase is not configured.
"""

from typing import Optional
from app.core.config import settings


def _get_supabase():
    """Get the Supabase client, or None if not configured."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        return None
    try:
        from app.core.supabase_client import get_supabase_admin
        return get_supabase_admin()
    except Exception:
        return None


def get_all_roadmaps(level: Optional[str] = None) -> dict:
    """Get all roadmaps, optionally filtered by level."""
    supabase = _get_supabase()

    if supabase:
        try:
            query = supabase.table("roadmaps").select("*")
            if level:
                query = query.eq("level", level)
            query = query.order("created_at", desc=True)
            result = query.execute()
            return {
                "roadmaps": result.data or [],
                "total": len(result.data or []),
            }
        except Exception as e:
            print(f"[RoadmapService] Supabase query failed, using mock: {e}")

    # Fallback to mock data
    roadmaps = MOCK_ROADMAPS.copy()
    if level:
        roadmaps = [r for r in roadmaps if r["level"] == level]
    return {
        "roadmaps": roadmaps,
        "total": len(roadmaps),
    }


def get_roadmap_by_id(roadmap_id: str) -> Optional[dict]:
    """Get a single roadmap by ID."""
    supabase = _get_supabase()

    if supabase:
        try:
            result = supabase.table("roadmaps").select("*").eq("id", roadmap_id).single().execute()
            return result.data
        except Exception:
            pass

    for roadmap in MOCK_ROADMAPS:
        if roadmap["id"] == roadmap_id:
            return roadmap
    return None


# ---------------------------------------------------------------------------
# Mock data (fallback when Supabase tables don't exist yet)
# ---------------------------------------------------------------------------

MOCK_ROADMAPS = [
    {
        "id": "rm-001-0000-0000-000000000001",
        "title": "Prompt Engineering Beginner Path",
        "level": "beginner",
        "description": "Start your journey into prompt engineering. Learn the fundamentals of how LLMs work and how to craft effective prompts.",
        "topics": [
            {"order": 1, "title": "What are LLMs?", "description": "Understanding Large Language Models", "article_slug": "intro-to-prompt-engineering"},
            {"order": 2, "title": "Prompt Basics", "description": "Structure and components of a prompt"},
            {"order": 3, "title": "Zero-Shot Prompting", "description": "Prompting without examples", "article_slug": "zero-shot-vs-few-shot"},
            {"order": 4, "title": "Few-Shot Prompting", "description": "Using examples to guide the model", "article_slug": "zero-shot-vs-few-shot"},
            {"order": 5, "title": "Prompt Formatting", "description": "Best practices for formatting prompts"},
            {"order": 6, "title": "Common Mistakes", "description": "Avoiding common prompting pitfalls"},
        ],
        "estimated_hours": 8,
        "created_at": "2025-01-01T00:00:00Z",
    },
    {
        "id": "rm-002-0000-0000-000000000002",
        "title": "Intermediate Prompt Techniques",
        "level": "intermediate",
        "description": "Level up your prompting skills with advanced techniques like Chain-of-Thought, role prompting, and output formatting.",
        "topics": [
            {"order": 1, "title": "Chain-of-Thought", "description": "Step-by-step reasoning prompts", "article_slug": "chain-of-thought-prompting"},
            {"order": 2, "title": "Role Prompting", "description": "Assigning personas to the AI"},
            {"order": 3, "title": "Output Formatting", "description": "Getting structured outputs (JSON, tables, lists)"},
            {"order": 4, "title": "Prompt Chaining", "description": "Connecting multiple prompts together"},
            {"order": 5, "title": "Temperature & Parameters", "description": "Controlling model behavior"},
            {"order": 6, "title": "Evaluation", "description": "How to evaluate prompt quality"},
        ],
        "estimated_hours": 12,
        "created_at": "2025-01-15T00:00:00Z",
    },
    {
        "id": "rm-003-0000-0000-000000000003",
        "title": "Advanced AI Architecture",
        "level": "advanced",
        "description": "Master production AI systems — RAG pipelines, agent architectures, and enterprise AI workflows.",
        "topics": [
            {"order": 1, "title": "RAG Architecture", "description": "Retrieval-Augmented Generation systems", "article_slug": "rag-architecture-deep-dive"},
            {"order": 2, "title": "Vector Databases", "description": "Storing and searching embeddings"},
            {"order": 3, "title": "AI Agents", "description": "Building autonomous AI systems", "article_slug": "building-ai-agent-systems"},
            {"order": 4, "title": "Multi-Agent Systems", "description": "Coordinating multiple AI agents"},
            {"order": 5, "title": "Enterprise AI", "description": "Production deployment patterns"},
            {"order": 6, "title": "AI Safety", "description": "Guardrails and responsible AI"},
        ],
        "estimated_hours": 20,
        "created_at": "2025-02-01T00:00:00Z",
    },
]
