"""
Unit tests for the auth login endpoint with Supabase integration.
"""

import pytest
from fastapi import HTTPException
from unittest.mock import Mock, patch
from app.api.v1.endpoints.auth import login
from app.schemas.user import UserLogin


class TestLoginEndpoint:
    """Tests for the login endpoint."""
    
    @pytest.mark.asyncio
    async def test_successful_login(self):
        """Test successful user login with valid credentials."""
        user_data = UserLogin(
            email="test@example.com",
            password="password123"
        )
        
        # Mock Supabase client and response
        mock_user = Mock()
        mock_user.id = "user-123"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {"username": "testuser"}
        
        mock_session = Mock()
        mock_session.access_token = "jwt-token-abc123"
        
        mock_response = Mock()
        mock_response.user = mock_user
        mock_response.session = mock_session
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_in_with_password.return_value = mock_response
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            result = await login(user_data)
            
            assert result["access_token"] == "jwt-token-abc123"
            assert result["token_type"] == "bearer"
            assert result["user"]["id"] == "user-123"
            assert result["user"]["email"] == "test@example.com"
            assert result["user"]["user_metadata"]["username"] == "testuser"
            
            # Verify Supabase was called correctly
            mock_supabase.auth.sign_in_with_password.assert_called_once_with({
                "email": "test@example.com",
                "password": "password123"
            })
    
    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self):
        """Test login fails with invalid credentials."""
        user_data = UserLogin(
            email="test@example.com",
            password="wrongpassword"
        )
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid login credentials")
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await login(user_data)
            
            assert exc_info.value.status_code == 400
            assert "Invalid credentials" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_login_user_not_found(self):
        """Test login fails when user does not exist."""
        user_data = UserLogin(
            email="nonexistent@example.com",
            password="password123"
        )
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_in_with_password.side_effect = Exception("User not found")
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await login(user_data)
            
            assert exc_info.value.status_code == 400
            assert "Invalid credentials" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_login_no_session_returned(self):
        """Test login fails when Supabase returns no session."""
        user_data = UserLogin(
            email="test@example.com",
            password="password123"
        )
        
        mock_response = Mock()
        mock_response.session = None
        mock_response.user = Mock()
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_in_with_password.return_value = mock_response
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await login(user_data)
            
            assert exc_info.value.status_code == 400
            assert "Invalid credentials" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_login_no_access_token(self):
        """Test login fails when session has no access token."""
        user_data = UserLogin(
            email="test@example.com",
            password="password123"
        )
        
        mock_session = Mock()
        mock_session.access_token = None
        
        mock_response = Mock()
        mock_response.session = mock_session
        mock_response.user = Mock()
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_in_with_password.return_value = mock_response
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await login(user_data)
            
            assert exc_info.value.status_code == 400
            assert "Invalid credentials" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_login_password_error(self):
        """Test login handles password-related errors."""
        user_data = UserLogin(
            email="test@example.com",
            password="wrongpassword"
        )
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_in_with_password.side_effect = Exception("Invalid password")
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await login(user_data)
            
            assert exc_info.value.status_code == 400
            assert "Invalid credentials" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_login_generic_error(self):
        """Test login handles generic errors appropriately."""
        user_data = UserLogin(
            email="test@example.com",
            password="password123"
        )
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_in_with_password.side_effect = Exception("Network error")
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            with pytest.raises(HTTPException) as exc_info:
                await login(user_data)
            
            assert exc_info.value.status_code == 500
            assert "Failed to authenticate" in exc_info.value.detail
            assert "Network error" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_login_supabase_not_configured(self):
        """Test login fails gracefully when Supabase is not configured."""
        user_data = UserLogin(
            email="test@example.com",
            password="password123"
        )
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client') as mock_get_client:
            mock_get_client.side_effect = HTTPException(
                status_code=500,
                detail="Supabase is not properly configured. Please contact the administrator."
            )
            
            with pytest.raises(HTTPException) as exc_info:
                await login(user_data)
            
            assert exc_info.value.status_code == 500
            assert "not properly configured" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_login_with_user_metadata(self):
        """Test login returns user metadata when available."""
        user_data = UserLogin(
            email="test@example.com",
            password="password123"
        )
        
        # Mock user with rich metadata
        mock_user = Mock()
        mock_user.id = "user-456"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {
            "username": "testuser",
            "display_name": "Test User",
            "avatar_url": "https://example.com/avatar.jpg"
        }
        
        mock_session = Mock()
        mock_session.access_token = "jwt-token-xyz789"
        
        mock_response = Mock()
        mock_response.user = mock_user
        mock_response.session = mock_session
        
        mock_supabase = Mock()
        mock_supabase.auth.sign_in_with_password.return_value = mock_response
        
        with patch('app.api.v1.endpoints.auth.get_supabase_client', return_value=mock_supabase):
            result = await login(user_data)
            
            assert result["user"]["user_metadata"]["username"] == "testuser"
            assert result["user"]["user_metadata"]["display_name"] == "Test User"
            assert result["user"]["user_metadata"]["avatar_url"] == "https://example.com/avatar.jpg"
