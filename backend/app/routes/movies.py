from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas.response_schema import MovieListResponse, MovieResponse
from app.services.movie_service import get_movie_by_id, list_movies

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("", response_model=MovieListResponse)
def get_movies(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    genre: Optional[str] = Query(None),
):
    return list_movies(page=page, limit=limit, genre=genre)


@router.get("/{movie_id}", response_model=MovieResponse)
def get_movie(movie_id: int):
    movie = get_movie_by_id(movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail=f"Movie with id {movie_id} not found")
    return movie
