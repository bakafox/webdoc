from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from routers.auth import router as auth_router
from routers.image import router as image_router
from routers.pages import router as pages_router
from routers.posts import router as posts_router


# ЗАПУСК: fastapi run main.py

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(auth_router)

app.include_router(image_router)

app.include_router(pages_router)

app.include_router(posts_router)
