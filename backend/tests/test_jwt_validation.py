"""
Tests for JWT token validation functions.
"""

import pytest
from datetime import datetime, timedelta, timezone
from jose import jwt

from app.core.security import decode_supabase_token
from app.core.config import settings


# Use the test JWT secret from conftest.py
TEST_JWT_SECRET = settings.JWT_SECRET
TEST_JWT_ALGORITHM = settings.JWT_ALGORITHM


def test_decode_valid_supabase_token():
    """Test decoding a valid Supabase JWT token."""
    # Create a valid token with user ID in 'sub' claim
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    token_data = {
        "sub": user_id,
        "email": "test@example.com",
        "role": "authenticated",
        "aud": "authenticated",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    
    # Create token using test secret
    token = jwt.encode(
        token_data,
        TEST_JWT_SECRET,
        algorithm=TEST_JWT_ALGORITHM
    )
    
    # Decode the token
    payload = decode_supabase_token(token)
    
    # Verify the payload is returned and contains expected data
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["email"] == "test@example.com"


def test_decode_expired_token():
    """Test that expired tokens are rejected."""
    # Create an expired token
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    token_data = {
        "sub": user_id,
        "email": "test@example.com",
        "exp": datetime.now(timezone.utc) - timedelta(hours=1)  # Expired 1 hour ago
    }
    
    token = jwt.encode(
        token_data,
        TEST_JWT_SECRET,
        algorithm=TEST_JWT_ALGORITHM
    )
    
    # Attempt to decode expired token
    payload = decode_supabase_token(token)
    
    # Should return None for expired token
    assert payload is None


def test_decode_invalid_signature():
    """Test that tokens with invalid signatures are rejected."""
    # Create a token with a different secret
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
        algorithm=TEST_JWT_ALGORITHM
    )
    
    # Attempt to decode with correct secret (via fixture)
    payload = decode_supabase_token(token)
    
    # Should return None for invalid signature
    assert payload is None


def test_decode_malformed_token():
    """Test that malformed tokens are rejected."""
    # Test with completely invalid token string
    payload = decode_supabase_token("not-a-valid-jwt-token")
    assert payload is None
    
    # Test with empty string
    payload = decode_supabase_token("")
    assert payload is None
    
    # Test with partial JWT (missing signature)
    payload = decode_supabase_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0")
    assert payload is None


def test_decode_token_missing_sub_claim():
    """Test that tokens without 'sub' claim are rejected."""
    # Create a token without 'sub' claim
    token_data = {
        "email": "test@example.com",
        "role": "authenticated",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    
    token = jwt.encode(
        token_data,
        TEST_JWT_SECRET,
        algorithm=TEST_JWT_ALGORITHM
    )
    
    # Attempt to decode token without 'sub'
    payload = decode_supabase_token(token)
    
    # Should return None when 'sub' claim is missing
    assert payload is None


def test_decode_token_with_user_metadata():
    """Test decoding token with additional user metadata."""
    # Create a token with user metadata (typical Supabase structure)
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    token_data = {
        "sub": user_id,
        "email": "test@example.com",
        "role": "authenticated",
        "aud": "authenticated",
        "user_metadata": {
            "username": "testuser",
            "avatar_url": "https://example.com/avatar.jpg"
        },
        "app_metadata": {
            "provider": "google"
        },
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    
    token = jwt.encode(
        token_data,
        TEST_JWT_SECRET,
        algorithm=TEST_JWT_ALGORITHM
    )
    
    payload = decode_supabase_token(token)
    
    # Verify all metadata is preserved
    assert payload is not None
    assert payload["sub"] == user_id
    assert payload["user_metadata"]["username"] == "testuser"
    assert payload["app_metadata"]["provider"] == "google"
