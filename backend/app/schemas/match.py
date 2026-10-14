from pydantic import BaseModel, Field

class MatchCriterion(BaseModel):
    name: str
    score: int = Field(ge=0, le=100)
    weight: int = Field(ge=0, le= 100)
    explanation: str


class ResumeMatchResponse(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    summary: str
    matched_skills: list[str]
    missing_skills: list[str]
    strengths: list[str]
    concerns: list[str]
    criteria: list[MatchCriterion]