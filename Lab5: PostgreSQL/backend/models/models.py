from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

# https://www.geeksforgeeks.org/python/describing-databases-with-metadata-sqlalchemy/
# https://www.datacamp.com/tutorial/sqlalchemy-tutorial-examples/
metadata = MetaData()

pages = Table(
    'pages',
    metadata,
    Column('pid', String, primary_key=True, unique=True),
    Column('title', String, default='Страница'),
    Column('body', String, default='<main>Здесь ничего нет.</main>'),
)

kpi = Table(
    'kpi',
    metadata,
    Column('kid', Integer, primary_key=True, autoincrement=True),
    Column('pid', String, ForeignKey('pages.pid')),
    Column('views', Integer, default=0),
    Column('time_spent', Integer, default=0),
    Column('last_visit', DateTime, default=None),
)
