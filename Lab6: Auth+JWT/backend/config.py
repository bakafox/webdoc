from dotenv import load_dotenv
import os


load_dotenv()

DB_HOST = os.environ.get('DB_HOST') or ''
DB_PORT = os.environ.get('DB_PORT') or ''
DB_NAME = os.environ.get('DB_NAME') or ''
DB_USER = os.environ.get('DB_USER') or ''
DB_PASS = os.environ.get('DB_PASS') or ''

JWT_KEY = os.environ.get('JWT_KEY') or ''
JWT_ALG = os.environ.get('JWT_ALG') or ''
