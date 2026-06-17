from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analyze, movies, recommendations, search, visualization

app = FastAPI(
    title="AI Movie Taste DNA API",
    description="Movie recommendation and taste analysis API powered by TMDB 5000 dataset",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(visualization.router)
app.include_router(movies.router)
app.include_router(search.router)
app.include_router(recommendations.router)


@app.get("/")
def root():
    return {
        "message": "AI Movie Taste DNA Backend Running",
        "version": "2.0.0",
        "endpoints": {
            "movies": "GET /movies, GET /movies/{id}",
            "search": "GET /search",
            "recommendations": "GET /recommendations, POST /recommend",
            "genres": "GET /genres",
            "trending": "GET /trending",
            "top_rated": "GET /top-rated",
            "analyze": "POST /analyze/",
            "visualize": "GET /visualize/",
        },
    }
