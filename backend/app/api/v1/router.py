"""
Central API v1 router.

Aggregates all endpoint routers into a single router
that is included in the main FastAPI app.
"""

from fastapi import APIRouter

from app.api.v1.endpoints.articles import router as articles_router
from app.api.v1.endpoints.challenges import router as challenges_router
from app.api.v1.endpoints.roadmaps import router as roadmaps_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.user_progress import router as user_progress_router
from app.api.v1.endpoints.search import router as search_router
from app.api.v1.endpoints.playground import router as playground_router

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(articles_router)
api_router.include_router(challenges_router)
api_router.include_router(roadmaps_router)
api_router.include_router(auth_router)
api_router.include_router(user_progress_router)
api_router.include_router(search_router)
api_router.include_router(playground_router)
