from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy import select, insert, update
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_async_session
from models.models import pages, kpi
from schemas.pages import Page, PageTime
from schemas.users import UserData
from users import get_user_data

router = APIRouter(prefix='/pages')

FORBIDDEN_PIDS = [
    'create', 'statistics',
    'welcome', 'posts', 'invert', 'stas',
    'auth', 'login', 'register',
]


@router.post('/create')
async def crate_page(
    page: Page,
    session: AsyncSession = Depends(get_async_session),
    user: UserData = Depends(get_user_data),
):
    if (user.role != 'admin'):
        return JSONResponse(
            { 'error': 'Создание новых страниц доступно только админам, ня!' },
            status_code=403,
        )

    if not page.id.strip():
        return JSONResponse(
            { 'error': 'ID страницы не может быть пустым.' },
            status_code=400,
        )
    elif page.id in FORBIDDEN_PIDS:
        return JSONResponse(
            { 'error': 'Этот ID страницы является зарезервированным.' },
            status_code=400,
        )

    try:
        # Важно помнить, что SQLAlchemy работает В РЕЖИМЕ ТРАНЗАКЦИЙ!
        # По сути, передача сессии является аналогом BEGIN; в psql.

        # Сперва задаём в ORMном стиле запрос SQL для выполнения...
        command = insert(pages).values(
            id=page.id,
            title=page.title,
            body=page.body,
        )

        # ...затем, собственно, исполняем её...
        await session.execute(command)

        # (аналогично для связанной таблицы kpi)
        command = insert(kpi).values(
            page_id=page.id,
            views=0,
            time_spent=0,
            last_visit=None,
        )
        await session.execute(command)

        # ...и, наконец, применяем изменения (аналог COMMIT; в psql).
        await session.commit()

        return JSONResponse(
            { 'pid': page.id },
            status_code=201,
        )
    except Exception as e:
        return JSONResponse(
            { 'error': str(e) },
            status_code=500,
        )

@router.get('/')
async def get_pages_overview(
    session: AsyncSession = Depends(get_async_session),
    _user: UserData = Depends(get_user_data),
):
    try:
        command = select(pages.c.id, pages.c.title)
        pages_raw = await session.execute(command)

        # SELECT, очевишце, в БД ничего не меняет, поэтому он тут не нужен.
        # await session.commit()

        # Преобразование из AlchemySQL в преобразовывемый в JSON тип
        pages_res = [
            { 'id': r.id, 'title': r.title }
            for r in pages_raw.all()
        ]

        return JSONResponse(
            pages_res,
            status_code=200,
        )
    except Exception as e:
        return JSONResponse(
            { 'error': str(e) },
            status_code=500,
        )

@router.get('/statistics')
async def get_statistics(
    session: AsyncSession = Depends(get_async_session),
    user: UserData = Depends(get_user_data),
):
    if (user.role != 'admin'):
        return JSONResponse(
            { 'error': 'Стастистику можно смотреть только админам, ня!' },
            status_code=403,
        )

    try:
        command = select(
            pages.c.id, pages.c.title,
            kpi.c.views, kpi.c.time_spent, kpi.c.last_visit,
        ).join(
            kpi, kpi.c.page_id == pages.c.id
        )
        stas_raw = await session.execute(command)

        stas_res = [
            {
                'id': r.id, 'title': r.title, 
                'views': r.views, 'time_spent': r.time_spent,
                'last_visit': None if not r.last_visit else int(r.last_visit.timestamp()),
            }
            for r in stas_raw.all()
        ]

        return JSONResponse(
            stas_res,
            status_code=200,
        )
    except Exception as e:
        return JSONResponse(
            { 'error': str(e) },
            status_code=500,
        )

@router.get('/{pid}')
async def get_page(
    pid: str,
    session: AsyncSession = Depends(get_async_session),
    _user: UserData = Depends(get_user_data),
):
    try:
        command = select(pages).where(
            pages.c.id == pid
        )
        page_raw = await session.execute(command)

        command = update(kpi).where(
            kpi.c.page_id == pid
        ).values(
            views=(kpi.c.views + 1),
            last_visit=(datetime.now())
        )
        await session.execute(command)

        await session.commit()

        page_res = page_raw.first()
        if not (page_res):
            return JSONResponse(
                { 'error': 'Указанная страница не существует.' },
                status_code=404,
            )

        return JSONResponse(
            { 'id': page_res.id, 'title': page_res.title, 'body': page_res.body },
            status_code=200,
        )
    except Exception as e:
        return JSONResponse(
            { 'error': str(e) },
            status_code=500,
        )

@router.post('/{pid}/time')
async def increment_page_time(
    pid: str,
    page_time: PageTime,
    session: AsyncSession = Depends(get_async_session),
    _user: UserData = Depends(get_user_data),
):
    if (type(page_time.time_spent) is not int) or (page_time.time_spent <= 0):
        return JSONResponse(
            { 'error': 'Проведённое на странице время в секундах должно быть положительным числом!' },
            status_code=400,
        )

    try:
        command = update(kpi).where(
            kpi.c.page_id == pid
        ).values(
            time_spent=(kpi.c.time_spent + page_time.time_spent)
        )
        await session.execute(command)

        await session.commit()

        # Ничего не возвращаем (потому что ну а зачем...)
        return Response(
            status_code=200,
        )
    except Exception as e:
        return JSONResponse(
            { 'error': str(e) },
            status_code=500,
        )
