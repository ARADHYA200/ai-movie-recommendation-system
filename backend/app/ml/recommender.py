import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.ml.vectorizer import get_dataset
from app.ml.clustering import get_cluster_for_movies
from app.utils.ml_helpers import (
    fuzzy_match_movie,
    classify_personality_archetype,
    calculate_trait_values,
    calculate_genre_affinity,
)

movies_df, tfidf_matrix = get_dataset()

CLUSTER_PERSONALITY_MAP = {
    0: "Dark Psychological Explorer",
    1: "Epic Adventure Seeker",
    2: "Romantic Dreamer",
    3: "Sci-Fi Visionary",
    4: "Action Adrenaline Junkie",
    5: "Drama Depth Lover",
}

SIMILARITY_WEIGHT = 0.45
GENRE_WEIGHT = 0.20
RATING_WEIGHT = 0.15
POPULARITY_WEIGHT = 0.10
KEYWORD_WEIGHT = 0.10


def _normalize_series(values):
    arr = np.array(values, dtype=float)
    min_val, max_val = arr.min(), arr.max()
    if max_val - min_val < 1e-9:
        return np.ones_like(arr)
    return (arr - min_val) / (max_val - min_val)


def _genre_overlap_score(user_genres, movie_genres):
    if not user_genres or not movie_genres:
        return 0.0
    user_set = set(user_genres)
    movie_set = set(movie_genres)
    return len(user_set & movie_set) / len(user_set | movie_set)


def _keyword_overlap_score(user_keywords, movie_keywords):
    if not user_keywords or not movie_keywords:
        return 0.0
    user_set = set(user_keywords)
    movie_set = set(movie_keywords)
    return len(user_set & movie_set) / max(len(user_set), 1)


def _build_recommendation_reason(row, user_genres, user_directors):
    reasons = []
    movie_genres = row.get("genre_list", [])
    shared_genres = set(user_genres) & set(movie_genres)
    if shared_genres:
        reasons.append(f"Shares your love for {', '.join(list(shared_genres)[:2])}")

    director = row.get("director", "")
    if director and director in user_directors:
        reasons.append(f"Directed by {director}, a filmmaker you enjoy")

    cast = row.get("cast_list", [])
    if cast:
        reasons.append(f"Features {cast[0]}")

    rating = row.get("vote_average", 0)
    if rating >= 7.5:
        reasons.append("Highly rated by audiences")

    if not reasons:
        reasons.append("Matches your cinematic taste profile")

    return " · ".join(reasons[:2])


def match_user_movies(user_movies):
    indices = []
    matched_titles = []
    for movie in user_movies:
        matched = fuzzy_match_movie(movie, movies_df["title"].tolist(), threshold=0.5)
        if matched:
            match_idx = movies_df[movies_df["title"] == matched].index[0]
            if match_idx not in indices:
                indices.append(match_idx)
                matched_titles.append(matched)
    return indices, matched_titles


def compute_recommendations(indices, limit=10, exclude_indices=None):
    if not indices:
        return []

    exclude = set(exclude_indices or indices)
    user_vector = np.asarray(tfidf_matrix[indices].mean(axis=0))
    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()

    user_genres = []
    user_keywords = []
    user_directors = []
    for idx in indices:
        row = movies_df.iloc[idx]
        user_genres.extend(row["genre_list"])
        user_keywords.extend(row["keyword_list"])
        if row.get("director"):
            user_directors.append(row["director"])

    user_genres = list(set(user_genres))
    user_keywords = list(set(user_keywords))
    user_directors = list(set(user_directors))

    candidate_indices = [
        i for i in range(len(movies_df)) if i not in exclude
    ]

    genre_scores = [_genre_overlap_score(user_genres, movies_df.iloc[i]["genre_list"]) for i in candidate_indices]
    keyword_scores = [_keyword_overlap_score(user_keywords, movies_df.iloc[i]["keyword_list"]) for i in candidate_indices]
    rating_scores = _normalize_series([movies_df.iloc[i]["vote_average"] for i in candidate_indices])
    popularity_scores = _normalize_series([movies_df.iloc[i]["popularity"] for i in candidate_indices])
    content_scores = [similarity_scores[i] for i in candidate_indices]

    combined_scores = []
    for j, idx in enumerate(candidate_indices):
        score = (
            SIMILARITY_WEIGHT * content_scores[j]
            + GENRE_WEIGHT * genre_scores[j]
            + KEYWORD_WEIGHT * keyword_scores[j]
            + RATING_WEIGHT * rating_scores[j]
            + POPULARITY_WEIGHT * popularity_scores[j]
        )
        combined_scores.append((idx, score))

    combined_scores.sort(key=lambda x: x[1], reverse=True)
    top = combined_scores[:limit]

    recommendations = []
    for idx, score in top:
        row = movies_df.iloc[idx]
        recommendations.append({
            "id": int(row["id"]),
            "title": row["title"],
            "overview": row["overview"][:200] + "..." if len(str(row["overview"])) > 200 else row["overview"],
            "genres": row["genre_list"],
            "vote_average": round(float(row["vote_average"]), 1),
            "popularity": round(float(row["popularity"]), 2),
            "release_year": int(row["release_year"]) if row["release_year"] else None,
            "director": row.get("director", ""),
            "cast": row.get("cast_list", [])[:3],
            "reason": _build_recommendation_reason(row, user_genres, user_directors),
            "match_score": round(float(score), 3),
        })

    return recommendations


def movie_to_dict(row):
    tagline = row.get("tagline", "")
    if tagline is None or (isinstance(tagline, float) and np.isnan(tagline)):
        tagline = ""
    overview = row.get("overview", "")
    if overview is None or (isinstance(overview, float) and np.isnan(overview)):
        overview = ""
    director = row.get("director", "")
    if director is None or (isinstance(director, float) and np.isnan(director)):
        director = ""
    return {
        "id": int(row["id"]),
        "title": row["title"],
        "overview": overview,
        "genres": row["genre_list"],
        "keywords": row["keyword_list"][:8],
        "cast": row["cast_list"],
        "director": director,
        "vote_average": round(float(row["vote_average"]), 1),
        "vote_count": int(row["vote_count"]),
        "popularity": round(float(row["popularity"]), 2),
        "release_year": int(row["release_year"]) if row["release_year"] and not (isinstance(row["release_year"], float) and np.isnan(row["release_year"])) else None,
        "original_language": row["original_language"],
        "tagline": str(tagline),
    }


def analyze_user_taste(user_movies: list) -> dict:
    indices, matched_titles = match_user_movies(user_movies)

    if not indices:
        return {
            "personality_type": "Cinematic Explorer",
            "personality_archetype": "Unknown",
            "description": "We couldn't find exact matches for those movies in our database. Try adding more well-known titles.",
            "dna_score": 0,
            "confidence_score": 0.0,
            "traits": [],
            "genre_affinity": [],
            "recommendations": [],
            "movies_analyzed": 0,
        }

    dominant_cluster = get_cluster_for_movies(indices)
    personality_label = CLUSTER_PERSONALITY_MAP.get(dominant_cluster, "Cinematic Explorer")
    archetype_name, description = classify_personality_archetype(dominant_cluster, {})

    user_vector = np.asarray(tfidf_matrix[indices].mean(axis=0))
    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()
    max_similarity = float(np.max(similarity_scores))
    confidence_score = max(0.0, min(1.0, max_similarity * 1.2))

    recommendations = compute_recommendations(indices, limit=10)

    traits_dict = calculate_trait_values(movies_df, indices)
    traits = [
        {
            "name": trait_name,
            "value": trait_value,
            "description": _get_trait_description(trait_name),
        }
        for trait_name, trait_value in traits_dict.items()
    ]

    genre_affinity_dict = calculate_genre_affinity(movies_df, indices)
    genre_affinity = [
        {
            "genre": genre,
            "percentage": round(percentage),
            "movie_count": sum(
                1 for g_list in movies_df.iloc[indices]["genre_list"] if genre in g_list
            ),
        }
        for genre, percentage in genre_affinity_dict.items()
    ]

    dna_score = round(confidence_score * 100, 1)

    return {
        "personality_type": personality_label,
        "personality_archetype": archetype_name,
        "description": description,
        "dna_score": dna_score,
        "confidence_score": round(confidence_score, 3),
        "traits": traits,
        "genre_affinity": genre_affinity,
        "recommendations": recommendations,
        "movies_analyzed": len(matched_titles),
    }


def _get_trait_description(trait_name: str) -> str:
    descriptions = {
        "Emotional Depth": "Preference for character-driven stories with psychological nuance",
        "Visual Spectacle": "Appreciation for ambitious cinematography and grand scale",
        "Narrative Complexity": "Preference for intricate plots with twists and revelations",
        "Character Development": "Appreciation for well-developed, relatable characters",
    }
    return descriptions.get(trait_name, "Movie preference attribute")
