from fastapi import APIRouter, Depends, HTTPException, status
from .. import  models, schemas, database, utils
from sqlalchemy.orm import Session
from ..schemas import UserDescription, SkillList
from ..llm import skill_extractor
from fastapi.responses import JSONResponse

router = APIRouter(tags=["Skills"])

get_db = database.get_db

# API to extract all skills from description and store it
@router.post("/extract")
def extract_skills(
  request: UserDescription,
  db: Session = Depends(get_db),
  current_user: models.User = Depends(utils.get_current_user)
):
  llm_instance = skill_extractor.get_llm()
  skills = skill_extractor.extract_user_skills(request.description, llm_instance)

  existing_skills = { s.skill for s in current_user.addskill }
  for skill in skills:
    if skill not in existing_skills:
      db.add(models.Skills(user_id=current_user.id, skill=skill))

  return JSONResponse(
    status_code=200,
    content="Succcess"
  )