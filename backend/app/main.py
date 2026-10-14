import logging
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from typing import Annotated

from app.services.resume_parser import (
    ResumeParsingError,
    extract_resume_text,
)

from app.services.resume_matcher import match_resume
from app.schemas.match import ResumeMatchResponse
from app.services.ai_service import generate_response
from app.core.config import settings

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Resume Parser API",
    description="AI-powered resume and job description matching",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str


@app.get('/api/v1/health')
async def health_check():
    return {
        "status": 'ok',
        "message": "Resume Parser API is running"
    }


@app.post(
    "/api/v1/matches",
    response_model=ResumeMatchResponse,
)
async def create_match(
    job_description: Annotated[
        str,
        Form(min_length=50, max_length=20_000),
    ],
    file: UploadFile = File(...),
):
    filename = file.filename or ""

    if not filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported.",
        )

    file_bytes = await file.read(5 * 1024 * 1024 + 1)
    await file.close()

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Resume must be 5 MB or smaller.",
        )

    try:
        resume_text = extract_resume_text(
            filename,
            file_bytes,
        )

        return await match_resume(
            job_description=job_description,
            resume_text=resume_text,
        )

    except ResumeParsingError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        # Log the exception server-side in production.
        raise HTTPException(
            status_code=502,
            detail="The AI matching service failed.",
        ) from exc
