"""
Authentication API endpoints.

POST /auth/signup    — Register a new user
POST /auth/login     — Login and get access token
GET  /auth/me        — Get current user info (protected endpoint example)
"""

from fastapi import APIRouter, HTTPException, Depends
from supabase import create_client, Client
from app.schemas.user import UserSignup, UserLogin, MessageResponse
from app.core.security import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_supabase_client() -> Client:
    """
    Create and return a Supabase client instance.
    
    Returns:
        Supabase client configured with URL and service role key
        
    Raises:
        HTTPException(500): If Supabase is not properly configured
    """
    if not settings.is_supabase_configured():
        raise HTTPException(
            status_code=500,
            detail="Supabase is not properly configured. Please contact the administrator."
        )
    
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


@router.post("/signup", response_model=MessageResponse)
async def signup(user_data: UserSignup):
    """
    Register a new user account.

    Creates a new user in Supabase Auth with the provided email and password.
    Optionally stores username in user metadata.
    
    Args:
        user_data: User signup information (email, password, optional username)
        
    Returns:
        Success message with user email
        
    Raises:
        HTTPException(400): If user already exists or validation fails
        HTTPException(500): If Supabase is not configured or signup fails
    """
    try:
        supabase = get_supabase_client()
        
        # Prepare user metadata
        user_metadata = {}
        if user_data.username:
            user_metadata["username"] = user_data.username
        if user_data.display_name:
            user_metadata["display_name"] = user_data.display_name
        
        # Create user in Supabase Auth
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": user_metadata
            } if user_metadata else {}
        })
        
        # Check if signup was successful
        if response.user:
            return MessageResponse(
                message=f"Account created successfully for {user_data.email}. Please check your email to confirm your account.",
                success=True
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Failed to create user account. Please try again."
            )
            
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle Supabase-specific errors
        error_message = str(e)
        
        # Check for common error patterns
        if "already registered" in error_message.lower() or "already exists" in error_message.lower():
            raise HTTPException(
                status_code=400,
                detail="An account with this email already exists."
            )
        elif "password" in error_message.lower():
            raise HTTPException(
                status_code=400,
                detail="Password does not meet requirements. Please use at least 6 characters."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create user account: {error_message}"
            )


@router.post("/login")
async def login(user_data: UserLogin):
    """
    Login with email and password.

    Authenticates user credentials via Supabase Auth and returns a JWT token
    on successful authentication.
    
    Args:
        user_data: User login credentials (email and password)
        
    Returns:
        JWT access token and user information
        
    Raises:
        HTTPException(400): If credentials are invalid
        HTTPException(500): If Supabase is not configured or login fails
    """
    try:
        supabase = get_supabase_client()
        
        # Authenticate with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })
        
        # Check if login was successful
        if response.session and response.session.access_token:
            return {
                "access_token": response.session.access_token,
                "token_type": "bearer",
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "user_metadata": response.user.user_metadata
                }
            }
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid credentials. Please check your email and password."
            )
            
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle Supabase-specific errors
        error_message = str(e)
        
        # Check for common error patterns
        if "invalid" in error_message.lower() or "credentials" in error_message.lower() or "password" in error_message.lower():
            raise HTTPException(
                status_code=400,
                detail="Invalid credentials. Please check your email and password."
            )
        elif "not found" in error_message.lower() or "user" in error_message.lower():
            raise HTTPException(
                status_code=400,
                detail="Invalid credentials. Please check your email and password."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to authenticate: {error_message}"
            )


@router.get("/me")
async def get_current_user_info(user_id: str = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    This is a protected endpoint that demonstrates the use of the get_current_user
    dependency. It requires a valid JWT token in the Authorization header.
    
    Returns:
        User ID and a success message
        
    Raises:
        HTTPException(401): If the token is missing or invalid
    """
    return {
        "user_id": user_id,
        "message": "Successfully authenticated",
        "authenticated": True
    }
