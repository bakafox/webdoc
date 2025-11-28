from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class Page(BaseModel):
    pid: str = ''
    title: str = 'Страница'
    body: str = '<main>Здесь ничего нет.</main>'

class Kpi(BaseModel):
    kid: int = 0
    pid: str = ''
    views: int = 0
    time_spent: int = 0
    last_visit: Optional[datetime] = None

class PageTime(BaseModel):
    time_spent: int = 0
