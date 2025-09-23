from fastapi import FastAPI
from appfiles.routes import auth, profile
from appfiles import models, database

models.Base.metadata.create_all(database.engine)


app = FastAPI()

app.include_router(auth.router)
app.include_router(profile.router)