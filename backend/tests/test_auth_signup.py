"""
Unit tests for the auth signup endpoint with Supabase integration.
"""

import pytest
from fastapi import HTTPException
from unittest.mock import Mock, patch, MagicMock
from app.api.v1.endpoints.auth import signup, get_supabase_client
from app.schemas.user import UserSignup, MessageResponse


class TestGetSupabaseClient:
    """Tests for the get_supabase_client helper function."""
    
    def test_raises_exception_when_not_configured(self):
        """Test that get_supabase_client raises HTTPException when Supabase is not configured."""
        with patch('app.api.v1.endpoints.auth.settings') as mock_settings:
            mock_settings.is_supabase_configured.return_value = False
            
            with pytest.raises(HTTPException) as exc_info:
                get_supabase_client()
            
            assert exc_info.value.status_code == 500
            assert "not properly configured" in exc_info.value.detail
    
    def test_creates_client_when_configured(self):
        """Test that get_supabase_client creates a client when properly configured."""
        with patch('app.api.v1.endpoints.auth.settings') as mock_settings, \
             patch('app.api.v1.endpoints.auth.create_client') as mock_create_client:
            
            mock_settings.is_supabase_configured.return_value = True
            mock_settings.SUPABASE_URL = "https://test.supabase.co"
            mock_settings.SUPABASE_SERVICE_ROLE_KEY = "test-key"
            mock_client = Mock()
            mock_create_client.return_value = mock_client
            
            result = get_supabase_client()
            
            assert result == mock_client
            mock_create_client.assert_called_once_with(
                "https://test.supabase.co",
                "test-key"
            )


class TestSignupEndpoint:
    """Tests for the signup endpoint."""
    
    @pytest.mark.asyncio
    async def test_successful_signup(self):
        """Test successful user signup with valid credentials."""
        user_data = UserSignup(
            email="test@example.com",
            password="password123",
            username="testuser"
        )
        
        # Mock Supabase client and response
        mock_user = Mock()
        mock_user.id = "user-123"
        mock_response = Mock()
        mock_response.user = mock_user
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_up.return_value = mock_response
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            result = await signup(user_data)
            
            assert isinstance(result, MessageResponse)
            assert result.success is True
            assert "test@example.com" in result.message
            assert "check your email" in result.message.lower()
            
            # Verify Supabase was called correctly
            mock_supabase.auth.sign_up.assert_called_once()
            call_args = mock_supabase.auth.sign_up.call_args[0][0]
            assert call_args["email"] == "test@example.com"
            assert call_args["password"] == "password123"
            assert call_args["options"]["data"]["username"] == "testuser"
    
    @pytest.mark.asyncio
    async def test_signup_with_display_name(self):
        """Test signup with both username and display_name."""
        user_data = UserSignup(
            email="test@example.com",
            password="password123",
            username="testuser",
            display_name="Test User"
        )
        
        mock_user = Mock()
        mock_response = Mock()
        mock_response.user = mock_user
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_up.return_value = mock_response
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            result = await signup(user_data)
            
            assert result.success is True
            
            # Verify metadata includes both username and display_name
            call_args = mock_supabase.auth.sign_up.call_args[0][0]
            assert call_args["options"]["data"]["username"] == "testuser"
            assert call_args["options"]["data"]["display_name"] == "Test User"
    
    @pytest.mark.asyncio
    async def test_signup_without_metadata(self):
        """Test signup without optional username or display_name."""
        user_data = UserSignup(
            email="test@example.com",
            password="password123"
        )
        
        mock_user = Mock()
        mock_response = Mock()
        mock_response.user = mock_user
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_up.return_value = mock_response
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            result = await signup(user_data)
            
            assert result.success is True
            
            # Verify options is empty dict when no metadata
            call_args = mock_supabase.auth.sign_up.call_args[0][0]
            assert call_args["options"] == {}
    
    @pytest.mark.asyncio
    async def test_signup_user_already_exists(self):
        """Test signup fails when user already exists."""
        user_data = UserSignup(
            email="existing@example.com",
            password="password123"
        )
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_up.side_effect = Exception("User already registered")
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await signup(user_data)
            
            assert exc_info.value.status_code == 400
            assert "already exists" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_signup_password_validation_error(self):
        """Test signup fails with password validation error from Supabase."""
        user_data = UserSignup(
            email="test@example.com",
            password="password123"  # Valid length but Supabase rejects it
        )
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_up.side_effect = Exception("Password is too weak")
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await signup(user_data)
            
            assert exc_info.value.status_code == 400
            assert "password" in exc_info.value.detail.lower()
    
    @pytest.mark.asyncio
    async def test_signup_no_user_returned(self):
        """Test signup fails when Supabase returns no user."""
        user_data = UserSignup(
            email="test@example.com",
            password="password123"
        )
        
        mock_response = Mock()
        mock_response.user = None
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_up.return_value = mock_response
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await signup(user_data)
            
            assert exc_info.value.status_code == 400
            assert "Failed to create user account" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_signup_generic_error(self):
        """Test signup handles generic errors appropriately."""
        user_data = UserSignup(
            email="test@example.com",
            password="password123"
        )
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_up.side_effect = Exception("Network error")
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await signup(user_data)
            
            assert exc_info.value.status_code == 500
            assert "Network error" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_signup_supabase_not_configured(self):
        """Test signup fails gracefully when Supabase is not configured."""
        user_data = UserSignup(
            email="test@example.com",
            password="password123"
        )
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client') as mock_get_client:
            mock_get_client.side_effect = HTTPException(
                status_code=500,
                detail="Supabase is not properly configured. Please contact the administrator."
            )
            
            with pytest.raises(HTTPException) as exc_info:
                await signup(user_data)
            
            assert exc_info.value.status_code == 500
            assert "not properly configured" in exc_info.value.detail
