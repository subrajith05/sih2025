from .database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

#Users table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    password = Column(String, nullable=False)

    addskill = relationship("Skills", back_populates="skill_author")
    addjob = relationship("Jobs", back_populates="job_author")
    addskillreco = relationship("RecommendedSkills", back_populates="skill_recommendation")
    addjobreco = relationship("RecommendedJobs", back_populates="job_recommendation")

#Skills table
class Skills(Base):
    __tablename__ = "skills"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    skill = Column(String, primary_key=True)

    skill_author = relationship("User", back_populates="addskill")

#JobPreference table
class Jobs(Base):
    __tablename__ = "jobs"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    job = Column(String, primary_key=True)

    job_author = relationship("User", back_populates="addjob")

#Skill recommendation table
class RecommendedSkills(Base):
    __tablename__ = "recommended_skills"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    skill_reco = Column(String, primary_key=True)

    skill_recommendation = relationship("User", back_populates="addskillreco")

#Job recommendation table
class RecommendedJobs(Base):
    __tablename__ = "recommended_jobs"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    job_reco = Column(String, primary_key=True)

    job_recommendation = relationship("User", back_populates="addjobreco")