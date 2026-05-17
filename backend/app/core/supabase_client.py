"""
Supabase client for backend operations.

Uses the SERVICE_ROLE_KEY for admin operations (bypasses RLS).
Uses the ANON_KEY for operations that should respect RLS.
"""

from supabase import create_client, Client
from app.core.config import settings


def get_supabase_admin() -> Client:
    """
    Get a Supabase client with admin (service_role) privileges.
    This bypasses RLS — use only for backend operations that need full access.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


def get_supabase_client() -> Client:
    """
    Get a Supabase client with anon privileges.
    This respects RLS policies.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
