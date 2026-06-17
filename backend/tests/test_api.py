import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_get_movies():
    response = client.get("/movies?page=1&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "movies" in data
    assert len(data["movies"]) <= 5


def test_get_movie_by_id():
    list_resp = client.get("/movies?limit=1")
    movie_id = list_resp.json()["movies"][0]["id"]
    response = client.get(f"/movies/{movie_id}")
    assert response.status_code == 200
    assert response.json()["id"] == movie_id


def test_get_movie_not_found():
    response = client.get("/movies/999999999")
    assert response.status_code == 404


def test_search():
    response = client.get("/search?q=avatar")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


def test_search_with_filters():
    response = client.get("/search?genre=Action&min_rating=7&sort_by=rating")
    assert response.status_code == 200


def test_genres():
    response = client.get("/genres")
    assert response.status_code == 200
    assert len(response.json()["genres"]) > 0


def test_trending():
    response = client.get("/trending?limit=5")
    assert response.status_code == 200
    assert len(response.json()) <= 5


def test_top_rated():
    response = client.get("/top-rated?limit=5")
    assert response.status_code == 200
    assert len(response.json()) <= 5


def test_recommend_post():
    response = client.post("/recommend", json={"movies": ["Inception", "Interstellar"], "limit": 5})
    assert response.status_code == 200
    data = response.json()
    assert data["movies_matched"] >= 1
    assert len(data["recommendations"]) > 0


def test_recommend_get():
    response = client.get("/recommendations?movies=Inception,Interstellar&limit=5")
    assert response.status_code == 200


def test_analyze():
    response = client.post("/analyze/", json={"movies": ["Inception", "The Dark Knight"]})
    assert response.status_code == 200
    data = response.json()
    assert data["movies_analyzed"] >= 1
    assert len(data["recommendations"]) > 0


def test_analyze_empty():
    response = client.post("/analyze/", json={"movies": []})
    assert response.status_code == 422


def test_visualize():
    response = client.get("/visualize/")
    assert response.status_code == 200
    assert len(response.json()["data"]) > 0
