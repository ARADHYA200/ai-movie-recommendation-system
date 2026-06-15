import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.ml.vectorizer import get_dataset
from app.ml.clustering import get_cluster_for_movies, get_cluster_recommendations
from app.utils.ml_helpers import (
    fuzzy_match_movie,
    extract_genres_from_json,
    classify_personality_archetype,
    calculate_trait_values,
    calculate_genre_affinity,
)

movies_df, tfidf_matrix = get_dataset()

cluster_personality_map = {
    0: "Dark Psychological Explorer",
    1: "Epic Adventure Seeker",
    2: "Romantic Dreamer",
    3: "Sci-Fi Visionary",
    4: "Action Adrenaline Junkie",
    5: "Drama Depth Lover"
}


def analyze_user_taste(user_movies: list) -> dict:
    """
    Comprehensive analysis of user movie taste.
    
    Returns complete personality DNA with all metrics.
    """
    indices = []
    matched_titles = []

    # Fuzzy match each movie
    for movie in user_movies:
        matched = fuzzy_match_movie(movie, movies_df['title'].tolist(), threshold=0.5)
        if matched:
            match_idx = movies_df[movies_df['title'] == matched].index[0]
            indices.append(match_idx)
            matched_titles.append(matched)

    # Handle case where no movies match
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

    # ===== Cluster Detection =====
    dominant_cluster = get_cluster_for_movies(indices)
    personality_label = cluster_personality_map.get(dominant_cluster, "Cinematic Explorer")
    archetype_name, description = classify_personality_archetype(dominant_cluster, {})

    # ===== Similarity Engine =====
    user_vector = tfidf_matrix[indices].mean(axis=0)
    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()
    max_similarity = float(np.max(similarity_scores))
    confidence_score = max(0.0, min(1.0, max_similarity * 1.2))

    # ===== Get Recommendations =====
    rec_titles = get_cluster_recommendations(dominant_cluster, indices)
    recommendations = []
    
    for rec_title in rec_titles:
        rec_idx = movies_df[movies_df['title'] == rec_title].index[0]
        rec_similarity = float(similarity_scores[rec_idx])
        reason = "Based on your taste profile"
        recommendations.append({
            "title": rec_title,
            "reason": reason,
            "match_score": round(rec_similarity, 3),
        })

    # ===== Calculate Traits =====
    traits_dict = calculate_trait_values(movies_df, indices)
    traits = [
        {
            "name": trait_name,
            "value": trait_value,
            "description": get_trait_description(trait_name),
        }
        for trait_name, trait_value in traits_dict.items()
    ]

    # ===== Calculate Genre Affinity =====
    genre_affinity_dict = calculate_genre_affinity(movies_df, indices)
    genre_affinity = [
        {
            "genre": genre,
            "percentage": round(percentage),
            "movie_count": sum(1 for g_list in movies_df.iloc[indices]['genre_list'] if genre in g_list),
        }
        for genre, percentage in genre_affinity_dict.items()
    ]

    # ===== DNA Score =====
    dna_score = round((confidence_score * 100), 1)

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


def get_trait_description(trait_name: str) -> str:
    """Get description for a trait."""
    descriptions = {
        "Emotional Depth": "Preference for character-driven stories with psychological nuance",
        "Visual Spectacle": "Appreciation for ambitious cinematography and grand scale",
        "Narrative Complexity": "Preference for intricate plots with twists and revelations",
        "Character Development": "Appreciation for well-developed, relatable characters",
    }
    return descriptions.get(trait_name, "Movie preference attribute")