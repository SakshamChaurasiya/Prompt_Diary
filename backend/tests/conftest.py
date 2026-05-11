"""
Pytest configuration and fixtures.
"""

import os
import pytest

# Set test environment variables before any app modules are imported
os.environ['JWT_SECRET'] = 'test-jwt-secret-for-unit-tests-12345'
os.environ['JWT_ALGORITHM'] = 'HS256'
os.environ['SUPABASE_URL'] = 'https://test.supabase.co'
os.environ['SUPABASE_ANON_KEY'] = 'test-anon-key'
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'test-service-role-key'
