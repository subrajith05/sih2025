from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#Database path
SQLALCHEMY_DATABASE_URL = "sqlite:///./LearningPath"

#Database connection
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

#Creating a Session object
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

#Function for api to connect to the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()