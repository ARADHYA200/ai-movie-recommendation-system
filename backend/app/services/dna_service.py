from app.ml.recommender import analyze_user_taste


def generate_dna(movie_list):
    """
    Generate personality DNA from user's favorite movies.
    
    Args:
        movie_list: List of movie titles
        
    Returns:
        Complete personality DNA analysis
    """
    return analyze_user_taste(movie_list)