from typing import Optional

from fastapi import APIRouter, Query

from app.schemas.response_schema import SearchResponse
from app.services.movie_service import search_movies

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=SearchResponse)
def search(
    q: str = Query("", description="Search query"),
    genre: Optional[str] = Query(None),
    min_rating: Optional[float] = Query(None, ge=0, le=10),
    max_rating: Optional[float] = Query(None, ge=0, le=10),
    year: Optional[int] = Query(None, ge=1900, le=2030),
    min_year: Optional[int] = Query(None, ge=1900, le=2030),
    max_year: Optional[int] = Query(None, ge=1900, le=2030),
    language: Optional[str] = Query(None),
    sort_by: str = Query("popularity", pattern="^(popularity|rating|title|year)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return search_movies(
        query=q,
        genre=genre,
        min_rating=min_rating,
        max_rating=max_rating,
        year=year,
        min_year=min_year,
        max_year=max_year,
        language=language,
        sort_by=sort_by,
        page=page,
        limit=limit,
    )
