from datetime import datetime, timedelta
from typing import Annotated
from bcrypt import checkpw
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select, insert, update
from sqlalchemy.ext.asyncio import AsyncSession
import jwt

from database import get_async_session
from models.models import users, roles
from config import JWT_ALG, JWT_KEY
from schemas.users import AuthData, UserData, UserId

# Тут я всё по туториалу сделал, только структуру упростил и БД поменял:
# https://www.youtube.com/watch?v=I11jbMOCY0c

# Эта штука, по сути, своего рода middleware для авторизации -- если в заголовках
# есть токен, достаёт его для дальнейшей проверки нами, если нет, кидает 401
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl='auth/oauth2' # Этот URL нужен только для Swagger, чтобы он знал как логиниться!
)


async def auth_user(
    login_data: AuthData,
    session: AsyncSession = Depends(get_async_session),
) -> UserId | None:
    # Проверяем что такой юзер существует
    command = select(
        users.c.id, users.c.password, roles.c.name
    ).where(
        users.c.email == login_data.email
    ).join(
        roles, roles.c.id == users.c.role_id
    )
    user_raw = await session.execute(command)

    # SELECT, очевишце, в БД ничего не меняет, поэтому он тут не нужен!

    user_res = user_raw.first()
    if not (user_res):
        return None

    # Теперь проверяем что хэши паролей совпадают
    if not checkpw(
        login_data.password.encode('utf-8'), user_res.password.encode('utf-8')
    ):
        return None

    # Наконец, возвращаем данные для создания JWT
    return UserId(
        id=user_res.id,
    )


def create_jwt(data: dict):
    to_encode = data.copy()
    to_encode.update({
        'exp': datetime.utcnow() + timedelta(minutes=60)
    })

    encoded_jwt = jwt.encode(to_encode, JWT_KEY, algorithm=JWT_ALG)
    return encoded_jwt


async def get_user_data(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: AsyncSession = Depends(get_async_session),
) -> UserData:
    try:
        # Если в JWT будет ошибка сигнатур/декода, она проявится здесь же
        payload = jwt.decode(token, JWT_KEY, algorithms=[JWT_ALG])

        # НЕ ЗАБЫВАЕМ ПЕРЕВЕСТИ STR ПОЛЕЗНОЙ НАГРУЗКИ ОБРАТНО В INT
        # ИНАЧЕ ОШИБКАМИ НАЧНЁТ ХАРКАТЬСЯ УЖЕ SQLALCHEMY
        uid = int(payload.get('sub'))
    except:
        raise HTTPException(
            status_code=401,
            detail='Токен входа повреждён либо истёк. Выполните вход повторно.',
            headers={
                'WWW-Authenticate': 'Bearer'
            },
        )

    # Проверяем что такой юзер существует
    command = select(
        users.c.email, roles.c.name
    ).where(
        users.c.id == uid
    ).join(
        roles, roles.c.id == users.c.role_id
    )
    user_raw = await session.execute(command)

    user_res = user_raw.first()
    if not (user_res):
        raise HTTPException(
            status_code=401,
            detail='Такого пользователя не существует.',
            headers={
                'WWW-Authenticate': 'Bearer'
            },
        )

    # Наконец, возвращаем объект с данными пользователя
    return UserData(
        email=user_res.email,
        role=user_res.name,
    )
