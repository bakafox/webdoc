from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime, ForeignKey

# https://www.geeksforgeeks.org/python/describing-databases-with-metadata-sqlalchemy/
# https://www.datacamp.com/tutorial/sqlalchemy-tutorial-examples/
metadata = MetaData()


pages = Table(
    'pages',
    metadata,
    Column('id', String, primary_key=True, unique=True),
    Column('title', String, default='Страница'),
    Column('body', String, default='<main>Здесь ничего нет.</main>'),
)

kpi = Table(
    'kpi',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('page_id', String, ForeignKey('pages.id')),
    Column('views', Integer, default=0),
    Column('time_spent', Integer, default=0),
    Column('last_visit', DateTime, default=None),
)

roles = Table(
    'roles',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('name', String, unique=True),
)

users = Table(
    'users',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('email', String, unique=True),
    Column('password', String),
    Column('role_id', Integer, ForeignKey('roles.id')),
)
