from fastapi import APIRouter
from app.schemas.response_schema import VisualizationResponse
from app.ml.clustering import get_cluster_visualization_data, get_dataset

router = APIRouter(prefix="/visualize", tags=["Visualization"])


@router.get("/", response_model=VisualizationResponse)
def visualize_clusters():
    """
    Get cluster visualization data for dashboard.
    """
    data_list = get_cluster_visualization_data()
    
    # Parse genre data for each movie
    movies_df, _ = get_dataset()
    
    formatted_data = []
    for item in data_list:
        # Find the movie in the dataset to get genres
        movie_row = movies_df[movies_df['title'] == item['title']]
        genres = movie_row['genre_list'].values[0] if not movie_row.empty else []
        primary_genre = genres[0] if genres else "Unknown"
        
        formatted_data.append({
            "title": item['title'],
            "cluster": int(item['cluster']),
            "pca_x": float(item['pca_x']),
            "pca_y": float(item['pca_y']),
            "genre": primary_genre,
        })
    
    return {
        "data": formatted_data,
        "total_movies": len(data_list),
        "cluster_count": 6,
    }