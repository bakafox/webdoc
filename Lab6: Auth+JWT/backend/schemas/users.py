from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class UserData(BaseModel):
    # id: int
    email: str
    role: str

# Для пущей безопасности в JWT теперь хранится только uid
class UserId(BaseModel):
    id: int

class AuthData(BaseModel):
    email: str
    password: str
