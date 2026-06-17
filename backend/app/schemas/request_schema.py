from typing import List, Optional

from pydantic import BaseModel, Field


class MovieInput(BaseModel):
    movies: List[str] = Field(..., min_length=1, description="List of favorite movie titles")


class RecommendRequest(BaseModel):
    movies: List[str] = Field(..., min_length=1)
    limit: int = Field(default=10, ge=1, le=50)
