"""
Database session management.

Provides async database engine and session for PostgreSQL via asyncpg.
Connects to Supabase's PostgreSQL database using DATABASE_URL.
"""

from typing import AsyncGenerator, Optional
from app.core.config import settings

# Will be lazily initialized
_engine = None
_async_session = None


def _init_engine():
    """Initialize the database engine and session factory lazily."""
    global _engine, _async_session

    if _engine is not None:
        return

    if not settings.DATABASE_URL:
        return

    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
    from sqlmodel.ext.asyncio.session import AsyncSession

    _engine = create_async_engine(
        settings.DATABASE_URL,
        echo=(settings.APP_ENV == "development"),
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
    )
    _async_session = async_sessionmaker(
        _engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )


async def get_db() -> AsyncGenerator:
    """
    Dependency that provides an async database session.

    Usage:
        @router.get("/items")
        async def get_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    if not settings.DATABASE_URL:
        yield None
        return

    _init_engine()

    if _async_session is None:
        yield None
        return

    async with _async_session() as session:
        try:
            yield session
        finally:
            await session.close()
