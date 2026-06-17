import ast
from pathlib import Path

import pandas as pd

DATA_DIR = Path(__file__).resolve().parents[2] / "data"


def parse_json_list(value):
    try:
        parsed = ast.literal_eval(value) if isinstance(value, str) else value
        return parsed if isinstance(parsed, list) else []
    except (ValueError, SyntaxError, TypeError):
        return []


def extract_genres(genre_str):
    return [g.get("name", "") for g in parse_json_list(genre_str) if g.get("name")]


def extract_keywords(keyword_str):
    return [k.get("name", "") for k in parse_json_list(keyword_str) if k.get("name")]


def extract_cast(cast_str, limit=5):
    cast = parse_json_list(cast_str)
    return [c.get("name", "") for c in cast[:limit] if c.get("name")]


def extract_director(crew_str):
    crew = parse_json_list(crew_str)
    directors = [c.get("name", "") for c in crew if c.get("job") == "Director" and c.get("name")]
    return directors[0] if directors else ""


def extract_year(release_date):
    if pd.isna(release_date) or not str(release_date).strip():
        return None
    try:
        return int(str(release_date)[:4])
    except (ValueError, TypeError):
        return None


def load_movies_dataset():
    movies_path = DATA_DIR / "tmdb_5000_movies.csv"
    credits_path = DATA_DIR / "tmdb_5000_credits.csv"

    movies_df = pd.read_csv(movies_path)
    credits_df = pd.read_csv(credits_path)

    credits_df = credits_df.rename(columns={"movie_id": "id"})
    movies_df = movies_df.merge(credits_df[["id", "cast", "crew"]], on="id", how="left")

    movies_df["genre_list"] = movies_df["genres"].apply(extract_genres)
    movies_df["keyword_list"] = movies_df["keywords"].apply(extract_keywords)
    movies_df["cast_list"] = movies_df["cast"].apply(extract_cast)
    movies_df["director"] = movies_df["crew"].apply(extract_director)
    movies_df["release_year"] = movies_df["release_date"].apply(extract_year)
    movies_df["vote_average"] = pd.to_numeric(movies_df["vote_average"], errors="coerce").fillna(0)
    movies_df["popularity"] = pd.to_numeric(movies_df["popularity"], errors="coerce").fillna(0)
    movies_df["vote_count"] = pd.to_numeric(movies_df["vote_count"], errors="coerce").fillna(0)
    movies_df["original_language"] = movies_df["original_language"].fillna("en")

    movies_df["genres_text"] = movies_df["genre_list"].apply(lambda g: " ".join(g))
    movies_df["keywords_text"] = movies_df["keyword_list"].apply(lambda k: " ".join(k))
    movies_df["cast_text"] = movies_df["cast_list"].apply(lambda c: " ".join(c))
    movies_df["director_text"] = movies_df["director"].fillna("")

    movies_df["content"] = (
        movies_df["title"].fillna("")
        + " "
        + movies_df["overview"].fillna("")
        + " "
        + movies_df["genres_text"]
        + " "
        + movies_df["keywords_text"]
        + " "
        + movies_df["cast_text"]
        + " "
        + movies_df["director_text"]
    )

    movies_df = movies_df.dropna(subset=["title", "overview"]).reset_index(drop=True)
    movies_df["id"] = movies_df["id"].astype(int)

    return movies_df
