from typing import Annotated
from bcrypt import hashpw, gensalt
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, insert, update
from sqlalchemy.ext.asyncio import AsyncSession
import re

from database import get_async_session
from models.models import users, roles
from schemas.users import AuthData, Token
from users import auth_user, create_jwt, get_user_data

router = APIRouter(prefix='/auth')


@router.post('/login')
async def login(
    login_data: AuthData,
    session: AsyncSession = Depends(get_async_session),
):
    auth = await auth_user(
        login_data,
        session,
    )
    if auth == None:
        return JSONResponse(
            { 'error': 'Неверный e-mail либо пароль.' },
            status_code=401,
        )

    # ОБЯЗАТЕЛЬНО STR ИНАЧЕ JWTPY НАЧНЁТ ХАРКАТЬСЯ ОШИБКАМИ!!
    access_token = create_jwt(
        data={"sub": str(auth.id)},
    )
    return Token(
        access_token=access_token,
        token_type='bearer',
        expires_in=(60 * 60)
    )

# Эта вариация используется только для Auth Bearer,
# поскольку ему, вместо JSON-а, нужна именно FormData.
@router.post('/oauth2')
async def login_oauth2(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: AsyncSession = Depends(get_async_session),
):
    login_token = await login(
        AuthData(
            email=form_data.username,
            password=form_data.password
        ),
        session
    )
    return login_token

@router.post('/register')
async def register(
    login_data: AuthData,
    session: AsyncSession = Depends(get_async_session),
):
    try:
        command = select(users).where(
            users.c.email == login_data.email
        )

        existing = await session.execute(command)
        if existing.first():
            return JSONResponse(
                {'error': 'Пользователь с таким e-mail уже существует.'},
                status_code=400,
            )
        
        # https://habr.com/ru/articles/175375/
        if not re.fullmatch(r'/.+@.+\..+/i', login_data.email):
            return JSONResponse(
                {'error': 'Пожалуйста, введите корректный e-mail.'},
                status_code=400,
            )

        # Хэшируем пароль!!!
        hashed_pw = hashpw(
            login_data.password.encode('utf-8'), gensalt() # Ген. СЛУЧАЙНУЮ соль
        ).decode('utf-8')

        command = insert(users).values(
            email=login_data.email,
            password=hashed_pw,
            role_id=2, # Роль 1 = админ, роль 2 = простой пользователь
        )
        await session.execute(command)

        await session.commit()

        # Если всё прошло успешно, оформляем вход в систему
        auth = await auth_user(login_data, session)

        if auth == None:
            return JSONResponse(
                { 'error': 'Эта ошибка никогда не случится, но типизатор так не думает.' },
                status_code=401,
            )

        access_token = create_jwt(
            data={"sub": auth.id},
        )
        return Token(
            access_token=access_token,
            token_type='bearer',
            expires_in=(60 * 60)
        )
    except Exception as e:
        return JSONResponse(
            { 'error': str(e) },
            status_code=500,
        )

@router.get('/status')
async def check_login(
    user = Depends(get_user_data),
):
    # Просто возвращаем UserData, о 401 позаботится oauth2_scheme
    return JSONResponse(
        { 'email': user.email, 'role': user.role },
        status_code=200,
    )
