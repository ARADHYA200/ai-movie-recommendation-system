from difflib import get_close_matches
import ast


def fuzzy_match_movie(movie_title: str, movies_list, threshold: float = 0.6):
    """
    Find closest matching movie in dataset using fuzzy matching.
    
    Args:
        movie_title: Title to search for
        movies_list: List of available titles
        threshold: Minimum match ratio (0-1)
    
    Returns:
        Matched title or None
    """
    matches = get_close_matches(movie_title, movies_list, n=1, cutoff=threshold)
    return matches[0] if matches else None


def extract_genres_from_json(genre_str):
    """
    Extract genre names from JSON string in TMDB format.
    
    Args:
        genre_str: JSON string containing genre list
    
    Returns:
        List of genre names
    """
    try:
        genres = ast.literal_eval(genre_str)
        return [g['name'] for g in genres] if isinstance(genres, list) else []
    except (ValueError, TypeError, KeyError):
        return []


def classify_personality_archetype(dominant_cluster: int, genre_dist: dict) -> tuple:
    """
    Classify movie taste into a personality archetype.
    
    Returns:
        (archetype_name, description)
    """
    archetype_map = {
        0: ("Psychological Analyst", "You crave deep, thought-provoking narratives that explore the human condition."),
        1: ("Epic Adventurer", "You're drawn to grand, sweeping stories with scale and ambition."),
        2: ("Romantic Idealist", "You believe in the power of human connection and emotional depth."),
        3: ("Sci-Fi Visionary", "You're fascinated by the possibilities of technology and alternate realities."),
        4: ("Action Enthusiast", "You love fast-paced thrills, intense sequences, and high stakes."),
        5: ("Drama Connoisseur", "You appreciate nuanced performances and character-driven storytelling."),
    }
    
    name, desc = archetype_map.get(dominant_cluster, ("Cinematic Explorer", "You have a unique and eclectic taste in films."))
    return name, desc


def calculate_trait_values(df, matched_indices: list) -> dict:
    """
    Calculate trait values based on user's matched movies.
    
    Returns:
        Dictionary of trait names and percentages
    """
    if not matched_indices:
        return {
            "Emotional Depth": 50,
            "Visual Spectacle": 50,
            "Narrative Complexity": 50,
            "Character Development": 50,
        }
    
    matched_movies = df.iloc[matched_indices]
    
    # Extract all genres from matched movies
    all_genres = []
    for genre_str in matched_movies['genre_list']:
        all_genres.extend(genre_str)
    
    # Calculate trait percentages based on genres
    genre_count = {}
    for genre in all_genres:
        genre_count[genre] = genre_count.get(genre, 0) + 1
    
    traits = {
        "Emotional Depth": min(100, (genre_count.get("Drama", 0) + genre_count.get("Romance", 0)) * 15),
        "Visual Spectacle": min(100, (genre_count.get("Action", 0) + genre_count.get("Adventure", 0) + genre_count.get("Fantasy", 0)) * 12),
        "Narrative Complexity": min(100, (genre_count.get("Thriller", 0) + genre_count.get("Mystery", 0) + genre_count.get("Crime", 0)) * 15),
        "Character Development": min(100, (genre_count.get("Drama", 0) + genre_count.get("Comedy", 0)) * 10),
    }
    
    return traits


def calculate_genre_affinity(df, matched_indices: list) -> dict:
    """
    Calculate genre distribution from matched movies.
    
    Returns:
        Dictionary of genre names and percentages
    """
    if not matched_indices:
        return {}
    
    matched_movies = df.iloc[matched_indices]
    all_genres = []
    
    for genre_str in matched_movies['genre_list']:
        all_genres.extend(genre_str)
    
    if not all_genres:
        return {}
    
    total = len(all_genres)
    genre_count = {}
    for genre in all_genres:
        genre_count[genre] = genre_count.get(genre, 0) + 1
    
    # Sort by count and convert to percentages
    sorted_genres = sorted(genre_count.items(), key=lambda x: x[1], reverse=True)
    return {genre: round((count / total) * 100, 1) for genre, count in sorted_genres[:8]}
