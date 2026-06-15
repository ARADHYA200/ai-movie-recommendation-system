from pydantic import BaseModel
from typing import List, Dict, Optional


class TraitsResponse(BaseModel):
    """Movie taste traits with percentage values."""
    name: str
    value: int
    description: str


class GenreAffinityResponse(BaseModel):
    """Genre preference breakdown."""
    genre: str
    percentage: int
    movie_count: int


class RecommendationResponse(BaseModel):
    """Individual movie recommendation."""
    title: str
    reason: str
    match_score: float


class PersonalityDNAResponse(BaseModel):
    """Complete personality DNA analysis."""
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
    """Single data point for visualization."""
    title: str
    cluster: int
    pca_x: float
    pca_y: float
    genre: str


class VisualizationResponse(BaseModel):
    """Cluster visualization data."""
    data: List[VisualizationDataPoint]
    total_movies: int
    cluster_count: int
