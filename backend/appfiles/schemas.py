from pydantic import BaseModel, EmailStr
from typing import List, Optional

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
    refresh_token: str
    token_type: str

#schema for token request
class TokenData(BaseModel):
    email: str | None = None

#schema for adding skills
class AddSkills(BaseModel):
    skills: List[str]

#schema for adding jobs
class AddJobs(BaseModel):
    jobs: List[str]

#schema for returning user profile
class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    skills: List[str]
    jobs: List[str]
    
class EditProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    skills: Optional[List[str]] = None
    jobs: Optional[List[str]] = None



################################ Skills route ######################################

class UserDescription(BaseModel):
    description: str

class SkillList(BaseModel):
    skills: List[str]


################################## Careers route #######################################

class JobRequest(BaseModel):
    job_role: str

class JobRecommendation(BaseModel):
    result: str