"""
Authentication API endpoints.

With Supabase Auth, the frontend handles signup/login directly via the
Supabase JS client. The backend's role is to:
  1. Verify the JWT token that Supabase issues
  2. Return the authenticated user's profile
  3. Provide a profile update endpoint

POST /auth/signup    — No longer needed (Supabase handles this on frontend)
POST /auth/login     — No longer needed (Supabase handles this on frontend)
GET  /auth/me        — Get current user's profile (requires JWT)
PUT  /auth/profile   — Update current user's profile (requires JWT)
"""

from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, get_optional_user
from app.core.supabase_client import get_supabase_admin
from app.schemas.user import UserResponse, MessageResponse

from typing import Optional
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])


class ProfileUpdate(BaseModel):
    """Schema for updating user profile fields."""
    username: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


@router.get("/me", response_model=dict)
async def get_me(user: dict = Depends(get_current_user)):
    """
    Get the current authenticated user's profile.

    Requires a valid Supabase JWT in the Authorization header.
    Returns the user's profile from the profiles table.
    """
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token — no user ID")

    try:
        supabase = get_supabase_admin()
        result = supabase.table("profiles").select("*").eq("id", user_id).single().execute()

        return {
            "success": True,
            "user": {
                "id": user_id,
                "email": user.get("email"),
                "role": user.get("role", "authenticated"),
                "profile": result.data if result.data else None,
            },
        }
    except Exception:
        # Profile might not exist yet (race condition with trigger)
        return {
            "success": True,
            "user": {
                "id": user_id,
                "email": user.get("email"),
                "role": user.get("role", "authenticated"),
                "profile": None,
            },
        }


@router.put("/profile", response_model=MessageResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    user: dict = Depends(get_current_user),
):
    """
    Update the current user's profile.

    Only updates fields that are provided (non-null).
    """
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token — no user ID")

    # Build update dict with only provided fields
    update_data = {k: v for k, v in profile_data.model_dump().items() if v is not None}

    if not update_data:
        return MessageResponse(message="No fields to update", success=True)

    try:
        supabase = get_supabase_admin()
        supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        return MessageResponse(message="Profile updated successfully", success=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")


@router.get("/status")
async def auth_status(user: Optional[dict] = Depends(get_optional_user)):
    """
    Check authentication status.
    Works for both authenticated and unauthenticated requests.
    """
    if user:
        return {
            "authenticated": True,
            "user_id": user.get("sub"),
            "email": user.get("email"),
        }
    return {"authenticated": False}
