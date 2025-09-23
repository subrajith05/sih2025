# app/llm/career_path.py
import os
from langchain_google_genai import GoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_chroma import Chroma
from chromadb import CloudClient
from dotenv import load_dotenv

load_dotenv()

CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
TENANT_ID = os.getenv("TENANT_ID")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

print(CHROMA_API_KEY, TENANT_ID, DATABASE_NAME  , COLLECTION_NAME)

def get_embeddings():
    return GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

def load_vectorstore():
    client = CloudClient(api_key=CHROMA_API_KEY, tenant=TENANT_ID, database=DATABASE_NAME)
    embeddings = get_embeddings()
    vectorstore = Chroma(collection_name=COLLECTION_NAME, embedding_function=embeddings, client=client)
    return vectorstore

def get_llm():
    return GoogleGenerativeAI(
        model="models/gemini-1.5-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.3
    )

def get_learning_path(vectorstore, user_job, llm):
    template = """
You are an expert career guidance assistant for NCVET job roles. 
The user will only provide the name of a job role they are interested in. 
Your task is to generate a **personalized learning path** and retrieve the **NQR job level**.

Follow this priority order:
1. Use the RAG vector database (NCVET/NQR PDFs) as the **main source of truth**.
2. If relevant information is missing in RAG, use your own knowledge of career pathways.
3. If still insufficient, you may rely on web knowledge.

Answer in the following format:

============================================================
        JOB ROLE LEARNING PATH RECOMMENDATION
============================================================

Job Role: {question}

NQR Job Level: <just say the specified_or_predicted job level only no other explanation is needed>

Learning Path:
1. <step 1 with details>
2. <step 2 with details>
3. <step 3 with details>
...

============================================================

Context:
{context}

Question:
I want to work in this job: {question}
"""

    QA_CHAIN_PROMPT = PromptTemplate(input_variables=["context", "question"], template=template)

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
        return_source_documents=True
    )

    response = qa_chain({"query": user_job})
    return response
