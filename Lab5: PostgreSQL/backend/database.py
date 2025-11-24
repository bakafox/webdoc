from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine
from sqlalchemy.orm import declarative_base, DeclarativeMeta, sessionmaker

from config import DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# Base = declarative_base()

# Корче тут мы создаём фабрику неблокирующих асинхронных сессий
engine = create_async_engine(DATABASE_URL)
session_maker = sessionmaker(engine, class_=AsyncSession)

# А тут мы эти сессии выдаём как одноразовые для кажого запроса
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with session_maker() as session:
        yield session
