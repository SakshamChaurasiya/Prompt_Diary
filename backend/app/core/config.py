"""
Application configuration using pydantic-settings.

Loads environment variables from .env file and provides
typed access to all configuration values.
"""

from pydantic_settings import BaseSettings
from typing import Optional
import warnings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    APP_NAME: str = "Prompt Dairy"
    APP_ENV: str = "development"
    FRONTEND_URL: str = "http://localhost:3000"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    DATABASE_URL: str = ""

    # JWT
    JWT_SECRET: str = "dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # LLM APIs (Phase 4)
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

    def is_supabase_configured(self) -> bool:
        """
        Check if Supabase is properly configured with non-placeholder values.
        
        Returns:
            bool: True if all required Supabase environment variables are set
                  and not placeholder values, False otherwise.
        """
        placeholder_values = [
            "",
            "your-supabase-url",
            "your-supabase-anon-key",
            "your-supabase-service-role-key",
            "your-project-url",
            "your-anon-key",
            "your-service-role-key",
        ]
        
        # Check if all required Supabase variables are set
        if not self.SUPABASE_URL or not self.SUPABASE_ANON_KEY or not self.SUPABASE_SERVICE_ROLE_KEY:
            return False
        
        # Check if any variable contains placeholder values
        if (self.SUPABASE_URL.lower() in placeholder_values or
            self.SUPABASE_ANON_KEY.lower() in placeholder_values or
            self.SUPABASE_SERVICE_ROLE_KEY.lower() in placeholder_values):
            return False
        
        return True

    def is_jwt_configured(self) -> bool:
        """
        Check if JWT settings are properly configured.
        
        Returns:
            bool: True if JWT_SECRET is set and not a placeholder value,
                  False otherwise.
        """
        placeholder_values = [
            "",
            "dev-secret-change-in-production",
            "your-jwt-secret",
            "change-me",
            "secret",
        ]
        
        # Check if JWT_SECRET is set and not a placeholder
        if not self.JWT_SECRET or self.JWT_SECRET in placeholder_values:
            return False
        
        # Verify JWT_ALGORITHM is set to HS256 for Supabase compatibility
        if self.JWT_ALGORITHM != "HS256":
            warnings.warn(
                f"JWT_ALGORITHM is set to '{self.JWT_ALGORITHM}' but Supabase uses 'HS256'. "
                "Token validation may fail.",
                UserWarning
            )
        
        return True

    def validate_configuration(self) -> None:
        """
        Validate configuration and issue warnings for missing or placeholder values.
        
        This method should be called during application startup to alert developers
        about configuration issues.
        """
        if not self.is_supabase_configured():
            warnings.warn(
                "Supabase is not properly configured. Authentication features will be unavailable. "
                "Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY "
                "environment variables with valid values.",
                UserWarning
            )
        
        if not self.is_jwt_configured():
            warnings.warn(
                "JWT_SECRET is not properly configured. Token validation will fail. "
                "Please set JWT_SECRET environment variable to your Supabase project's JWT secret.",
                UserWarning
            )


# Global settings instance
settings = Settings()

# Validate configuration on module load
settings.validate_configuration()
