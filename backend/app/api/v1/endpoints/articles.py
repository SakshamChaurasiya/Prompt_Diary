"""
Articles API endpoints.

GET /articles             — List all articles (with optional filters)
GET /articles/system-design — List architecture articles
GET /articles/slug/{slug} — Get a single article by URL slug (MUST be before /{article_id})
GET /articles/{id}        — Get a single article by ID
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.services.article_service import get_all_articles, get_article_by_id, get_article_by_slug

router = APIRouter(prefix="/articles", tags=["Articles"])


@router.get("")
async def list_articles(
    category: Optional[str] = Query(None, description="Filter by category (fundamentals, techniques, architecture)"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty (beginner, intermediate, advanced)"),
):
    """
    List all published articles.

    Optional filters:
    - **category**: fundamentals, techniques, architecture
    - **difficulty**: beginner, intermediate, advanced
    """
    result = get_all_articles(category=category, difficulty=difficulty)
    return result


@router.get("/system-design")
async def list_system_design_articles():
    """List architecture-focused articles for the System Design module."""
    return get_all_articles(category="architecture")


# IMPORTANT: This route MUST be registered before /{article_id} so FastAPI
# doesn't interpret "slug" as an article ID.
@router.get("/slug/{slug}")
async def get_article_by_slug_endpoint(slug: str):
    """Get a single article by its URL slug."""
    article = get_article_by_slug(slug)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("/{article_id}")
async def get_article(article_id: str):
    """Get a single article by its ID."""
    article = get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

