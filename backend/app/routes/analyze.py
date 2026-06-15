from fastapi import APIRouter, HTTPException
from app.schemas.request_schema import MovieInput
from app.schemas.response_schema import PersonalityDNAResponse
from app.services.dna_service import generate_dna

router = APIRouter(prefix="/analyze", tags=["Analysis"])


@router.post("/", response_model=PersonalityDNAResponse)
def analyze_movies(data: MovieInput):
    """
    Analyze user's favorite movies and generate personality DNA.
    """
    if not data.movies or all(not m.strip() for m in data.movies):
        raise HTTPException(status_code=400, detail="Please provide at least one movie title")
    
    # Filter out empty strings
    movies = [m.strip() for m in data.movies if m.strip()]
    
    try:
        result = generate_dna(movies)
        # Map old key names to new ones if needed
        response_data = {
            "personality_type": result.get("personality_type", ""),
            "personality_archetype": result.get("personality_archetype", ""),
            "description": result.get("description", ""),
            "dna_score": result.get("dna_score", 0),
            "confidence_score": result.get("confidence_score", 0.0),
            "traits": result.get("traits", []),
            "genre_affinity": result.get("genre_affinity", []),
            "recommendations": result.get("recommendations", []),
            "movies_analyzed": result.get("movies_analyzed", 0),
        }
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing movies: {str(e)}")