
from pydantic import BaseModel, Field


class ResumeMatchRequest(BaseModel):
    job_description: str = Field(
        min_length=50,
        max_length=20_000,
        description="The job description to evaluate against",
    )
