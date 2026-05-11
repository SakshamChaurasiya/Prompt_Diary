"""
Security utilities for JWT token handling and password hashing.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Header, HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def decode_supabase_token(token: str) -> Optional[dict]:
    """
    Decode and validate a Supabase JWT token.
    
    Validates the JWT signature using the JWT_SECRET from configuration,
    checks token expiration, and extracts user information from the token payload.
    
    Args:
        token: JWT token string from the Authorization header
        
    Returns:
        Token payload dictionary containing user_id and other claims if valid.
        Returns None if the token is invalid, expired, or malformed.
        
    Example:
        >>> token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        >>> payload = decode_supabase_token(token)
        >>> if payload:
        ...     user_id = payload.get("sub")
        ...     print(f"User ID: {user_id}")
    """
    try:
        # Decode and validate the JWT token
        # This will automatically check:
        # - Signature validity using JWT_SECRET
        # - Token expiration (exp claim)
        # - Token structure and format
        # Note: We pass options to skip audience validation since Supabase
        # tokens may have different audience values depending on the context
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_aud": False}
        )
        
        # Extract user ID from the 'sub' (subject) claim
        # Supabase stores the user UUID in the 'sub' claim
        user_id = payload.get("sub")
        
        if not user_id:
            # Token is valid but missing required 'sub' claim
            return None
            
        return payload
        
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.JWTClaimsError:
        # Invalid claims (e.g., wrong audience, issuer)
        return None
    except jwt.JWTError:
        # Invalid signature or malformed token
        return None
    except Exception:
        # Catch any other unexpected errors
        return None


async def get_current_user(authorization: str = Header(None)) -> str:
    """
    FastAPI dependency to extract and validate JWT token from Authorization header.
    
    This dependency is used to protect API endpoints that require authentication.
    It extracts the JWT token from the Authorization header, validates it using
    decode_supabase_token(), and returns the user ID if the token is valid.
    
    Args:
        authorization: Authorization header value (e.g., "Bearer <token>")
        
    Returns:
        User ID (UUID string) extracted from the validated token
        
    Raises:
        HTTPException(401): If the Authorization header is missing, malformed,
                           or contains an invalid/expired token
                           
    Example:
        >>> @router.get("/protected")
        >>> async def protected_endpoint(user_id: str = Depends(get_current_user)):
        ...     return {"user_id": user_id, "message": "Access granted"}
    """
    # Check if Authorization header is present
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract token from "Bearer <token>" format
    parts = authorization.split()
    
    # Validate Authorization header format
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = parts[1]
    
    # Validate the token using decode_supabase_token
    payload = decode_supabase_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user ID from the 'sub' claim
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_id
