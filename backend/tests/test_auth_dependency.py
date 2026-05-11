"""
Tests for authentication dependency (get_current_user).
"""

import pytest
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient
from jose import jwt

from app.core.security import get_current_user
from app.core.config import settings


# Create a test app with a protected endpoint
app = FastAPI()


@app.get("/protected")
async def protected_endpoint(user_id: str = Depends(get_current_user)):
    """Test endpoint that requires authentication."""
    return {"user_id": user_id, "message": "Access granted"}


# Create test client
client = TestClient(app)


def create_test_token(user_id: str, expired: bool = False) -> str:
    """Helper function to create test JWT tokens."""
    token_data = {
        "sub": user_id,
        "email": "test@example.com",
        "role": "authenticated",
        "aud": "authenticated",
        "exp": datetime.now(timezone.utc) + (
            timedelta(hours=-1) if expired else timedelta(hours=1)
        )
    }
    
    return jwt.encode(
        token_data,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )


def test_get_current_user_with_valid_token():
    """Test that valid token allows access to protected endpoint."""
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    token = create_test_token(user_id)
    
    response = client.get(
        "/protected",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    assert response.json()["user_id"] == user_id
    assert response.json()["message"] == "Access granted"


def test_get_current_user_missing_authorization_header():
    """Test that missing Authorization header returns 401."""
    response = client.get("/protected")
    
    assert response.status_code == 401
    assert "Authorization header missing" in response.json()["detail"]


def test_get_current_user_invalid_header_format():
    """Test that invalid Authorization header format returns 401."""
    # Test without "Bearer" prefix
    response = client.get(
        "/protected",
        headers={"Authorization": "invalid-token"}
    )
    
    assert response.status_code == 401
    assert "Invalid authorization header format" in response.json()["detail"]
    
    # Test with wrong prefix
    response = client.get(
        "/protected",
        headers={"Authorization": "Basic invalid-token"}
    )
    
    assert response.status_code == 401
    assert "Invalid authorization header format" in response.json()["detail"]


def test_get_current_user_expired_token():
    """Test that expired token returns 401."""
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    token = create_test_token(user_id, expired=True)
    
    response = client.get(
        "/protected",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]


def test_get_current_user_invalid_token():
    """Test that invalid token returns 401."""
    response = client.get(
        "/protected",
        headers={"Authorization": "Bearer invalid-jwt-token"}
    )
    
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]


def test_get_current_user_token_with_wrong_signature():
    """Test that token with wrong signature returns 401."""
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    token_data = {
        "sub": user_id,
        "email": "test@example.com",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    
    # Sign with wrong secret
    token = jwt.encode(
        token_data,
        "wrong-secret-key",
        algorithm=settings.JWT_ALGORITHM
    )
    
    response = client.get(
        "/protected",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]


def test_get_current_user_token_missing_sub():
    """Test that token without 'sub' claim returns 401."""
    token_data = {
        "email": "test@example.com",
        "role": "authenticated",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    
    token = jwt.encode(
        token_data,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    response = client.get(
        "/protected",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 401
    # The token will be invalid because decode_supabase_token returns None
    # when 'sub' is missing
    assert "Invalid or expired token" in response.json()["detail"]
