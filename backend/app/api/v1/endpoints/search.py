"""
Search API endpoint.

GET /search?q=...  — Search articles, challenges, and roadmaps
"""

from fastapi import APIRouter, Query
from typing import Optional

from app.core.config import settings

router = APIRouter(prefix="/search", tags=["Search"])


def _get_supabase():
    """Get the Supabase client, or None if not configured."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        return None
    try:
        from app.core.supabase_client import get_supabase_admin
        return get_supabase_admin()
    except Exception:
        return None


@router.get("")
async def search(
    q: str = Query(..., min_length=2, description="Search query (minimum 2 characters)"),
    type: Optional[str] = Query(None, description="Filter by type: articles, challenges, roadmaps"),
):
    """
    Search across all content on the platform.

    Searches articles (title, excerpt, content), challenges (title, description),
    and roadmaps (title, description). Returns matched items grouped by type.
    """
    query = q.strip().lower()
    results = {"articles": [], "challenges": [], "roadmaps": [], "total": 0}

    supabase = _get_supabase()

    if supabase:
        try:
            if not type or type == "articles":
                article_result = (
                    supabase.table("articles")
                    .select("id, title, slug, excerpt, category, difficulty")
                    .eq("published", True)
                    .or_(f"title.ilike.%{query}%,excerpt.ilike.%{query}%,content.ilike.%{query}%")
                    .limit(20)
                    .execute()
                )
                results["articles"] = article_result.data or []

            if not type or type == "challenges":
                challenge_result = (
                    supabase.table("challenges")
                    .select("id, title, description, difficulty, category, points")
                    .or_(f"title.ilike.%{query}%,description.ilike.%{query}%")
                    .limit(20)
                    .execute()
                )
                results["challenges"] = challenge_result.data or []

            if not type or type == "roadmaps":
                roadmap_result = (
                    supabase.table("roadmaps")
                    .select("id, title, description, level, estimated_hours")
                    .or_(f"title.ilike.%{query}%,description.ilike.%{query}%")
                    .limit(10)
                    .execute()
                )
                results["roadmaps"] = roadmap_result.data or []

            results["total"] = (
                len(results["articles"])
                + len(results["challenges"])
                + len(results["roadmaps"])
            )
            return results

        except Exception as e:
            # Fall through to mock search
            pass

    # Fallback: search mock data
    from app.services.article_service import MOCK_ARTICLES
    from app.services.challenge_service import MOCK_CHALLENGES
    from app.services.roadmap_service import MOCK_ROADMAPS

    if not type or type == "articles":
        results["articles"] = [
            {
                "id": a["id"],
                "title": a["title"],
                "slug": a["slug"],
                "excerpt": a["excerpt"],
                "category": a["category"],
                "difficulty": a["difficulty"],
            }
            for a in MOCK_ARTICLES
            if query in a["title"].lower()
            or query in a.get("excerpt", "").lower()
            or query in a.get("content", "").lower()
        ]

    if not type or type == "challenges":
        results["challenges"] = [
            {
                "id": c["id"],
                "title": c["title"],
                "description": c["description"],
                "difficulty": c["difficulty"],
                "category": c["category"],
                "points": c["points"],
            }
            for c in MOCK_CHALLENGES
            if query in c["title"].lower()
            or query in c["description"].lower()
        ]

    if not type or type == "roadmaps":
        results["roadmaps"] = [
            {
                "id": r["id"],
                "title": r["title"],
                "description": r["description"],
                "level": r["level"],
                "estimated_hours": r["estimated_hours"],
            }
            for r in MOCK_ROADMAPS
            if query in r["title"].lower()
            or query in r.get("description", "").lower()
        ]

    results["total"] = (
        len(results["articles"])
        + len(results["challenges"])
        + len(results["roadmaps"])
    )
    return results
