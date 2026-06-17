from typing import Optional

from app.ml.recommender import movie_to_dict, match_user_movies, compute_recommendations
from app.ml.vectorizer import get_dataset
from app.utils.cache import cached

movies_df, _ = get_dataset()


def get_all_genres():
    genres = set()
    for genre_list in movies_df["genre_list"]:
        genres.update(genre_list)
    return sorted(genres)


@cached(ttl_seconds=600)
def list_movies(page: int = 1, limit: int = 20, genre: Optional[str] = None):
    df = movies_df.copy()
    if genre:
        df = df[df["genre_list"].apply(lambda g: genre in g)]

    total = len(df)
    start = (page - 1) * limit
    end = start + limit
    page_df = df.iloc[start:end]

    return {
        "movies": [movie_to_dict(row) for _, row in page_df.iterrows()],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
    }


@cached(ttl_seconds=600)
def get_movie_by_id(movie_id: int):
    match = movies_df[movies_df["id"] == movie_id]
    if match.empty:
        return None
    return movie_to_dict(match.iloc[0])


def search_movies(
    query: str = "",
    genre: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None,
    year: Optional[int] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    language: Optional[str] = None,
    sort_by: str = "popularity",
    page: int = 1,
    limit: int = 20,
):
    df = movies_df.copy()

    if query.strip():
        q = query.lower().strip()
        df = df[
            df["title"].str.lower().str.contains(q, na=False)
            | df["overview"].str.lower().str.contains(q, na=False)
            | df["cast_list"].apply(lambda c: any(q in name.lower() for name in c))
            | df["director"].str.lower().str.contains(q, na=False)
        ]

    if genre:
        df = df[df["genre_list"].apply(lambda g: genre in g)]

    if min_rating is not None:
        df = df[df["vote_average"] >= min_rating]
    if max_rating is not None:
        df = df[df["vote_average"] <= max_rating]

    if year is not None:
        df = df[df["release_year"] == year]
    if min_year is not None:
        df = df[df["release_year"] >= min_year]
    if max_year is not None:
        df = df[df["release_year"] <= max_year]

    if language:
        df = df[df["original_language"] == language.lower()]

    sort_map = {
        "popularity": ("popularity", False),
        "rating": ("vote_average", False),
        "title": ("title", True),
        "year": ("release_year", False),
    }
    sort_col, ascending = sort_map.get(sort_by, ("popularity", False))
    df = df.sort_values(by=sort_col, ascending=ascending, na_position="last")

    total = len(df)
    start = (page - 1) * limit
    end = start + limit
    page_df = df.iloc[start:end]

    return {
        "movies": [movie_to_dict(row) for _, row in page_df.iterrows()],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
        "query": query,
    }


@cached(ttl_seconds=300)
def get_trending(limit: int = 20):
    df = movies_df.sort_values(by="popularity", ascending=False).head(limit)
    return [movie_to_dict(row) for _, row in df.iterrows()]


@cached(ttl_seconds=300)
def get_top_rated(limit: int = 20, min_votes: int = 100):
    df = movies_df[movies_df["vote_count"] >= min_votes]
    df = df.sort_values(by="vote_average", ascending=False).head(limit)
    return [movie_to_dict(row) for _, row in df.iterrows()]


def get_recommendations_for_movies(movies: list, limit: int = 10):
    indices, matched = match_user_movies(movies)
    if not indices:
        return {"recommendations": [], "movies_matched": 0, "matched_titles": []}
    recs = compute_recommendations(indices, limit=limit)
    return {
        "recommendations": recs,
        "movies_matched": len(matched),
        "matched_titles": matched,
    }
