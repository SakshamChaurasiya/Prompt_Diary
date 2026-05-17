"""
User Progress API endpoints.

GET  /user-progress         — Get current user's progress (all completed articles/challenges)
POST /user-progress/article — Mark an article as completed
POST /user-progress/challenge — Mark a challenge as completed
GET  /user-progress/stats   — Get user's overall stats (total completed, points, etc.)
"""

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel

from app.core.security import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/user-progress", tags=["User Progress"])


class ArticleProgressRequest(BaseModel):
    """Mark an article as completed."""
    article_id: str


class ChallengeProgressRequest(BaseModel):
    """Mark a challenge as completed."""
    challenge_id: str
    score: Optional[int] = None


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
async def get_user_progress(user: dict = Depends(get_current_user)):
    """
    Get the current user's complete learning progress.

    Returns articles completed, challenges completed, and overall stats.
    """
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token — no user ID")

    supabase = _get_supabase()

    if supabase:
        try:
            # Get article progress
            article_result = (
                supabase.table("user_progress")
                .select("*")
                .eq("user_id", user_id)
                .eq("completed", True)
                .execute()
            )

            # Get challenge progress
            challenge_result = (
                supabase.table("challenge_progress")
                .select("*")
                .eq("user_id", user_id)
                .execute()
            )

            articles_completed = article_result.data or []
            challenges_completed = challenge_result.data or []

            total_points = sum(c.get("score", 0) for c in challenges_completed)

            return {
                "success": True,
                "progress": {
                    "articles_completed": len(articles_completed),
                    "articles": articles_completed,
                    "challenges_completed": len(challenges_completed),
                    "challenges": challenges_completed,
                    "total_points": total_points,
                },
            }
        except Exception as e:
            # Table might not exist yet — return empty progress
            pass

    # Fallback: empty progress
    return {
        "success": True,
        "progress": {
            "articles_completed": 0,
            "articles": [],
            "challenges_completed": 0,
            "challenges": [],
            "total_points": 0,
        },
    }


@router.post("/article")
async def mark_article_completed(
    data: ArticleProgressRequest,
    user: dict = Depends(get_current_user),
):
    """Mark an article as completed for the current user."""
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token — no user ID")

    supabase = _get_supabase()

    if supabase:
        try:
            supabase.table("user_progress").upsert(
                {
                    "user_id": user_id,
                    "article_id": data.article_id,
                    "completed": True,
                    "completed_at": datetime.now(timezone.utc).isoformat(),
                },
                on_conflict="user_id,article_id",
            ).execute()

            return {"success": True, "message": "Article marked as completed"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to update progress: {str(e)}")

    return {"success": True, "message": "Progress recorded (offline mode)"}


@router.post("/challenge")
async def mark_challenge_completed(
    data: ChallengeProgressRequest,
    user: dict = Depends(get_current_user),
):
    """Mark a challenge as completed for the current user."""
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token — no user ID")

    supabase = _get_supabase()

    if supabase:
        try:
            supabase.table("challenge_progress").upsert(
                {
                    "user_id": user_id,
                    "challenge_id": data.challenge_id,
                    "completed": True,
                    "score": data.score or 0,
                    "completed_at": datetime.now(timezone.utc).isoformat(),
                },
                on_conflict="user_id,challenge_id",
            ).execute()

            return {"success": True, "message": "Challenge marked as completed"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to update progress: {str(e)}")

    return {"success": True, "message": "Progress recorded (offline mode)"}


@router.get("/stats")
async def get_user_stats(user: dict = Depends(get_current_user)):
    """
    Get the current user's aggregated stats.

    Returns total articles read, challenges solved, points, and streak info.
    """
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token — no user ID")

    supabase = _get_supabase()

    if supabase:
        try:
            article_result = (
                supabase.table("user_progress")
                .select("id", count="exact")
                .eq("user_id", user_id)
                .eq("completed", True)
                .execute()
            )

            challenge_result = (
                supabase.table("challenge_progress")
                .select("score", count="exact")
                .eq("user_id", user_id)
                .execute()
            )

            articles_count = article_result.count or 0
            challenges_data = challenge_result.data or []
            challenges_count = challenge_result.count or 0
            total_points = sum(c.get("score", 0) for c in challenges_data)

            return {
                "success": True,
                "stats": {
                    "articles_completed": articles_count,
                    "challenges_completed": challenges_count,
                    "total_points": total_points,
                    "level": _calculate_level(total_points),
                },
            }
        except Exception:
            pass

    return {
        "success": True,
        "stats": {
            "articles_completed": 0,
            "challenges_completed": 0,
            "total_points": 0,
            "level": "Newcomer",
        },
    }


def _calculate_level(points: int) -> str:
    """Calculate user level based on total points."""
    if points >= 200:
        return "Expert"
    elif points >= 100:
        return "Advanced"
    elif points >= 50:
        return "Intermediate"
    elif points >= 10:
        return "Beginner"
    return "Newcomer"
