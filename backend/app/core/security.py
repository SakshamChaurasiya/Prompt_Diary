"""
Security utilities for Supabase JWT verification.

Supabase issues JWTs when users sign in. The backend verifies these tokens
to authenticate API requests — it does NOT issue its own tokens.
"""

from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.core.config import settings

# Bearer token extractor
security_scheme = HTTPBearer(auto_error=False)


def verify_supabase_token(token: str) -> Optional[dict]:
    """
    Verify and decode a Supabase JWT access token.

    Supabase JWTs are signed with the JWT_SECRET from your project settings.
    The 'sub' field contains the user's UUID (auth.users.id).

    Note: Some Supabase projects omit the 'aud' claim — we try with audience
    first and fall back to decoding without it so both formats are supported.
    """
    # First attempt: strict verification with audience claim
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            audience="authenticated",
        )
        return payload
    except JWTError:
        pass

    # Second attempt: decode without audience (some Supabase project configs)
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_aud": False},
        )
        return payload
    except JWTError:
        return None


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
) -> dict:
    """
    FastAPI dependency — extracts and verifies the Supabase JWT from the
    Authorization header. Returns the decoded payload with user info.

    Usage in endpoints:
        @router.get("/protected")
        async def protected_route(user: dict = Depends(get_current_user)):
            user_id = user["sub"]  # UUID from auth.users
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated — provide a Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_supabase_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
) -> Optional[dict]:
    """
    FastAPI dependency — same as get_current_user but returns None
    instead of raising an error. Use for routes that work for both
    authenticated and unauthenticated users.
    """
    if not credentials:
        return None

    return verify_supabase_token(credentials.credentials)
