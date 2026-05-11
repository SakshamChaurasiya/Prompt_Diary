"""
Integration test for protected endpoint using get_current_user dependency.
"""

import pytest
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from jose import jwt

from app.main import app
from app.core.config import settings


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


def test_protected_endpoint_with_valid_token():
    """Test that /auth/me endpoint works with valid token."""
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    token = create_test_token(user_id)
    
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["authenticated"] is True
    assert "Successfully authenticated" in data["message"]


def test_protected_endpoint_without_token():
    """Test that /auth/me endpoint returns 401 without token."""
    response = client.get("/api/v1/auth/me")
    
    assert response.status_code == 401
    assert "Authorization header missing" in response.json()["detail"]


def test_protected_endpoint_with_invalid_token():
    """Test that /auth/me endpoint returns 401 with invalid token."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid-token"}
    )
    
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]


def test_protected_endpoint_with_expired_token():
    """Test that /auth/me endpoint returns 401 with expired token."""
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    token = create_test_token(user_id, expired=True)
    
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]
