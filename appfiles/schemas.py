from pydantic import BaseModel, EmailStr

#user schema
class User(BaseModel):
    name: str
    email: EmailStr
    password: str

#schema to display user details
class ShowUser(BaseModel):
    name: str
    email: EmailStr

    class Config:
        from_attributes = True

#schema for getting login data
class LoginUser(BaseModel):
    user: str
    password: str

#schema for returning token
class Token(BaseModel):
    access_token: str
    token_type: str

#schema for token request
class TokenData(BaseModel):
    email: str | None = None