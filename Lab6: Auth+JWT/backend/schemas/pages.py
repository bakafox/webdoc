from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class Page(BaseModel):
    id: str = ''
    title: str = 'Страница'
    body: str = '<main>Здесь ничего нет.</main>'

class Kpi(BaseModel):
    id: int = 0
    page_id: str = ''
    views: int = 0
    time_spent: int = 0
    last_visit: Optional[datetime] = None

class PageTime(BaseModel):
    time_spent: int = 0

