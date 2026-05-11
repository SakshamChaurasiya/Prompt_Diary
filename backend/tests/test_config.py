"""
Unit tests for configuration validation.

Tests the Settings class validation methods to ensure proper
detection of missing or placeholder environment variables.
"""

import pytest
from unittest.mock import patch
from app.core.config import Settings


class TestSupabaseConfiguration:
    """Test Supabase configuration validation."""

    def test_is_supabase_configured_with_valid_values(self):
        """Test that valid Supabase configuration is detected."""
        settings = Settings(
            SUPABASE_URL="https://abc123.supabase.co",
            SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
            SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service"
        )
        assert settings.is_supabase_configured() is True

    def test_is_supabase_configured_with_empty_url(self):
        """Test that empty SUPABASE_URL is detected."""
        settings = Settings(
            SUPABASE_URL="",
            SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
            SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service"
        )
        assert settings.is_supabase_configured() is False

    def test_is_supabase_configured_with_empty_anon_key(self):
        """Test that empty SUPABASE_ANON_KEY is detected."""
        settings = Settings(
            SUPABASE_URL="https://abc123.supabase.co",
            SUPABASE_ANON_KEY="",
            SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service"
        )
        assert settings.is_supabase_configured() is False

    def test_is_supabase_configured_with_empty_service_role_key(self):
        """Test that empty SUPABASE_SERVICE_ROLE_KEY is detected."""
        settings = Settings(
            SUPABASE_URL="https://abc123.supabase.co",
            SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
            SUPABASE_SERVICE_ROLE_KEY=""
        )
        assert settings.is_supabase_configured() is False

    def test_is_supabase_configured_with_placeholder_url(self):
        """Test that placeholder SUPABASE_URL is detected."""
        settings = Settings(
            SUPABASE_URL="your-supabase-url",
            SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
            SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service"
        )
        assert settings.is_supabase_configured() is False

    def test_is_supabase_configured_with_placeholder_anon_key(self):
        """Test that placeholder SUPABASE_ANON_KEY is detected."""
        settings = Settings(
            SUPABASE_URL="https://abc123.supabase.co",
            SUPABASE_ANON_KEY="your-anon-key",
            SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service"
        )
        assert settings.is_supabase_configured() is False

    def test_is_supabase_configured_with_placeholder_service_role_key(self):
        """Test that placeholder SUPABASE_SERVICE_ROLE_KEY is detected."""
        settings = Settings(
            SUPABASE_URL="https://abc123.supabase.co",
            SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
            SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
        )
        assert settings.is_supabase_configured() is False


class TestJWTConfiguration:
    """Test JWT configuration validation."""

    def test_is_jwt_configured_with_valid_secret(self):
        """Test that valid JWT configuration is detected."""
        settings = Settings(
            JWT_SECRET="my-secure-jwt-secret-key-12345",
            JWT_ALGORITHM="HS256"
        )
        assert settings.is_jwt_configured() is True

    def test_is_jwt_configured_with_empty_secret(self):
        """Test that empty JWT_SECRET is detected."""
        settings = Settings(
            JWT_SECRET="",
            JWT_ALGORITHM="HS256"
        )
        assert settings.is_jwt_configured() is False

    def test_is_jwt_configured_with_dev_placeholder(self):
        """Test that dev placeholder JWT_SECRET is detected."""
        settings = Settings(
            JWT_SECRET="dev-secret-change-in-production",
            JWT_ALGORITHM="HS256"
        )
        assert settings.is_jwt_configured() is False

    def test_is_jwt_configured_with_generic_placeholder(self):
        """Test that generic placeholder JWT_SECRET is detected."""
        settings = Settings(
            JWT_SECRET="your-jwt-secret",
            JWT_ALGORITHM="HS256"
        )
        assert settings.is_jwt_configured() is False

    def test_is_jwt_configured_with_wrong_algorithm(self):
        """Test that non-HS256 algorithm triggers warning but still validates."""
        settings = Settings(
            JWT_SECRET="my-secure-jwt-secret-key-12345",
            JWT_ALGORITHM="RS256"
        )
        # Should still return True but would have issued a warning
        assert settings.is_jwt_configured() is True


class TestConfigurationValidation:
    """Test overall configuration validation."""

    def test_validate_configuration_with_missing_supabase(self):
        """Test that validation warns about missing Supabase configuration."""
        settings = Settings(
            SUPABASE_URL="",
            SUPABASE_ANON_KEY="",
            SUPABASE_SERVICE_ROLE_KEY="",
            JWT_SECRET="my-secure-jwt-secret-key-12345"
        )
        
        with pytest.warns(UserWarning, match="Supabase is not properly configured"):
            settings.validate_configuration()

    def test_validate_configuration_with_missing_jwt(self):
        """Test that validation warns about missing JWT configuration."""
        settings = Settings(
            SUPABASE_URL="https://abc123.supabase.co",
            SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
            SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service",
            JWT_SECRET="dev-secret-change-in-production"
        )
        
        with pytest.warns(UserWarning, match="JWT_SECRET is not properly configured"):
            settings.validate_configuration()

    def test_validate_configuration_with_all_valid(self):
        """Test that validation passes with all valid configuration."""
        settings = Settings(
            SUPABASE_URL="https://abc123.supabase.co",
            SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
            SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service",
            JWT_SECRET="my-secure-jwt-secret-key-12345",
            JWT_ALGORITHM="HS256"
        )
        
        # Should not raise any warnings
        settings.validate_configuration()
