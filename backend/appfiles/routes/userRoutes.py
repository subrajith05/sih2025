from fastapi import APIRouter, Depends, HTTPException, status
from .. import  models, schemas, database, utils
from sqlalchemy.orm import Session
from ..schemas import JobRecommendation, JobRequest
from ..llm import learning_path_generator

router = APIRouter(tags=["User"])

#Adding skills to the user profile
@router.post("/addSkill")
def add_skill(request: schemas.AddSkills, 
              db: Session = Depends(database.get_db), 
              current_user: models.User = Depends(utils.get_current_user)):
    id = current_user.id
    for i in range(len(request.skills)):
        new_skill = models.Skills(
            user_id = id,
            skill = request.skills[i]
        )
        '''if new_skill == db.query(models.Skills).filter(models.Skills.user_id==id and models.Skills.skill==request.skills[i]).first():
            continue'''
        db.add(new_skill)
        db.commit()
        db.refresh(new_skill)
    db.close()
    return {"user_id": id, "skills": request.skills}

#Adding job preferences to the user profile
@router.post("/addJob")
def add_skill(request: schemas.AddJobs, 
              db: Session = Depends(database.get_db), 
              current_user: models.User = Depends(utils.get_current_user)):
    id = current_user.id
    for i in range(len(request.jobs)):
        new_job = models.Jobs(
            user_id = id,
            job = request.jobs[i]
        )
        '''if new_job == db.query(models.Jobs).filter(models.Jobs.user_id==id and models.Jobs.skill==request.jobs[i]).first():
            continue'''
        db.add(new_job)
        db.commit()
        db.refresh(new_job)
    db.close()
    return {"user_id": id, "jobs": request.jobs}

#Returning user profile
@router.get("/profile")
def get_user_profile(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    skill_list = db.query(models.Skills).filter(models.Skills.user_id == current_user.id).with_entities(models.Skills.skill).all()
    skills = [s[0] for s in skill_list]
    job_list = db.query(models.Jobs).filter(models.Jobs.user_id == current_user.id).with_entities(models.Jobs.job).all()
    jobs = [j[0] for j in job_list]

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "skills": skills,
        "jobs": jobs
    }

@router.put("/edit/profile")
def edit_user_profile(
    request: schemas.EditProfile,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(utils.get_current_user) 
):
    if request.name:
        current_user.name = request.name
    
    if request.email:
        user_exists = db.query(models.User).filter(models.User.email == request.email).first()
        if user_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken",
            )
        else:
            current_user.email = request.email
    
    if request.skills is not None:
        existing_skills = { s.skill for s in current_user.addskill }
        for skill in request.skills:
            if skill not in existing_skills:
                db.add(models.Skills(user_id=current_user.id, skill=skill))
    
    if request.jobs is not None:
        existing_jobs = { j.job for j in current_user.addjob }
        for job in request.jobs:
            if job not in existing_jobs:
                db.add(models.Jobs(user_id=current_user.id, job=job))
    
    db.commit()
    db.refresh(current_user)
    
    skills = [s.skill for s in current_user.addskill]
    jobs = [j.job for j in current_user.addjob]
    
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "skills": skills,
        "jobs": jobs
    }

@router.post("/learning-path", response_model=JobRecommendation)
def get_learning_path(
    request: JobRequest
):
    try:
        vectorstore = learning_path_generator.load_vectorstore()
        llm = learning_path_generator.get_llm()
        response = learning_path_generator.get_learning_path(vectorstore, request.job_role, llm)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            content=str(e)
        )
