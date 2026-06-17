from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas.request_schema import RecommendRequest
from app.schemas.response_schema import GenresResponse, MovieResponse, RecommendResponse
from app.services.movie_service import get_all_genres, get_recommendations_for_movies, get_top_rated, get_trending

router = APIRouter(tags=["Recommendations"])


@router.get("/recommendations", response_model=RecommendResponse)
def get_recommendations(
    movies: str = Query(..., description="Comma-separated movie titles"),
    limit: int = Query(10, ge=1, le=50),
):
    movie_list = [m.strip() for m in movies.split(",") if m.strip()]
    if not movie_list:
        raise HTTPException(status_code=400, detail="Provide at least one movie title")
    return get_recommendations_for_movies(movie_list, limit=limit)


@router.post("/recommend", response_model=RecommendResponse)
def recommend(data: RecommendRequest):
    movies = [m.strip() for m in data.movies if m.strip()]
    if not movies:
        raise HTTPException(status_code=400, detail="Provide at least one movie title")
    return get_recommendations_for_movies(movies, limit=data.limit)


@router.get("/genres", response_model=GenresResponse)
def get_genres():
    genres = get_all_genres()
    return {"genres": genres, "total": len(genres)}


@router.get("/trending", response_model=list[MovieResponse])
def trending(limit: int = Query(20, ge=1, le=50)):
    return get_trending(limit=limit)


@router.get("/top-rated", response_model=list[MovieResponse])
def top_rated(limit: int = Query(20, ge=1, le=50)):
    return get_top_rated(limit=limit)
