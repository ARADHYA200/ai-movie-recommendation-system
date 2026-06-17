from typing import List, Optional

from pydantic import BaseModel


class TraitsResponse(BaseModel):
    name: str
    value: int
    description: str


class GenreAffinityResponse(BaseModel):
    genre: str
    percentage: int
    movie_count: int


class RecommendationResponse(BaseModel):
    id: int
    title: str
    overview: Optional[str] = ""
    genres: List[str] = []
    vote_average: float = 0.0
    popularity: float = 0.0
    release_year: Optional[int] = None
    director: str = ""
    cast: List[str] = []
    reason: str
    match_score: float


class PersonalityDNAResponse(BaseModel):
    personality_type: str
    personality_archetype: str
    description: str
    dna_score: float
    confidence_score: float
    traits: List[TraitsResponse]
    genre_affinity: List[GenreAffinityResponse]
    recommendations: List[RecommendationResponse]
    movies_analyzed: int


class VisualizationDataPoint(BaseModel):
    title: str
    cluster: int
    pca_x: float
    pca_y: float
    genre: str


class VisualizationResponse(BaseModel):
    data: List[VisualizationDataPoint]
    total_movies: int
    cluster_count: int


class MovieResponse(BaseModel):
    id: int
    title: str
    overview: str
    genres: List[str]
    keywords: List[str] = []
    cast: List[str] = []
    director: str = ""
    vote_average: float
    vote_count: int = 0
    popularity: float
    release_year: Optional[int] = None
    original_language: str = "en"
    tagline: str = ""


class MovieListResponse(BaseModel):
    movies: List[MovieResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class SearchResponse(BaseModel):
    movies: List[MovieResponse]
    total: int
    page: int
    limit: int
    total_pages: int
    query: str = ""


class GenresResponse(BaseModel):
    genres: List[str]
    total: int


class RecommendResponse(BaseModel):
    recommendations: List[RecommendationResponse]
    movies_matched: int
    matched_titles: List[str] = []


class ErrorResponse(BaseModel):
    detail: str
