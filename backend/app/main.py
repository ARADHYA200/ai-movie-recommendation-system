from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze, visualization
app = FastAPI(title="AI Movie Taste DNA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later production me restrict karenge
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(visualization.router)

@app.get("/")
def root():
    return {"message": "AI Movie Taste DNA Backend Running"}