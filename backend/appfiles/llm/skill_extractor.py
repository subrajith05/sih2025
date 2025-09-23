# app/llm/skill_extractor.py
import os
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

def get_llm():
    """Initialize Google Gemini LLM."""
    return GoogleGenerativeAI(
        model="models/gemini-1.5-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.3
    )

def extract_user_skills(user_description: str, llm):
    """
    Extracts skills from the user's description using LLM.
    Returns comma-separated skills.
    """
    template = """
You are an AI skill extractor.

**Task:**
Read the user's description and extract only the SKILLS they have.

**Rules:**
1. Only return skills, no job roles or tasks.
2. Output the skills in a comma-separated list, no brackets, no extra text.
3. Do not add explanations.

User Description:
{description}

Extracted Skills (comma-separated):
"""
    prompt = PromptTemplate(input_variables=["description"], template=template)

    # LangChain piping
    chain = prompt | llm
    response = chain.invoke({"description": user_description})
    skills = [s.strip() for s in response.split(",") if s.strip()]
    return skills
