from fastapi import APIRouter, Depends
from .. import  models, schemas, database, utils
from sqlalchemy.orm import Session

router = APIRouter(
    tags=["Profile"],
    prefix='/profile'
)

#Adding skills to the user profile
@router.post("/addskill")
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
@router.post("/addjob")
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
@router.get("/")
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