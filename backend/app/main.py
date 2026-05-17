"""
Prompt Dairy — FastAPI Application Entry Point

This is the main application file that initializes the FastAPI app,
configures CORS, and includes all API routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="Learning platform for Prompt Engineering, AI Systems, and LLM Workflows",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration — allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint — confirms the API is running."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "0.1.0",
        "message": "Welcome to Prompt Dairy API 🧠🥛",
    }


@app.get("/info", tags=["Health"])
async def app_info():
    """Returns application metadata."""
    return {
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "api_version": "v1",
        "docs": "/docs",
        "endpoints": {
            "articles": "/api/v1/articles",
            "challenges": "/api/v1/challenges",
            "roadmaps": "/api/v1/roadmaps",
            "auth": "/api/v1/auth",
            "user_progress": "/api/v1/user-progress",
            "search": "/api/v1/search",
            "playground": "/api/v1/playground",
        },
    }
