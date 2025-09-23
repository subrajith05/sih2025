from appfiles.routes import userRoutes, authRoutes, skillsRoutes
import uvicorn
from fastapi import FastAPI
from appfiles import models, database
from dotenv import load_dotenv
import os

load_dotenv()

models.Base.metadata.create_all(database.engine)


app = FastAPI()

app.include_router(authRoutes.router, prefix="/auth")
app.include_router(userRoutes.router, prefix="/user")
app.include_router(skillsRoutes.router, prefix="/skills")

if __name__=="__main__":
  uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8000,
    reload=True
  )