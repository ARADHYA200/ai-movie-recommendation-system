import numpy as np
import joblib
from pathlib import Path
from app.ml.vectorizer import get_dataset

MODEL_DIR=Path(__file__).parent/"models"

_clusters=np.load(
    MODEL_DIR/"cluster_labels.npy"
)

_movies_df,_=get_dataset()

_movies_df["cluster"]=_clusters

coords=np.load(
    MODEL_DIR/"pca_coordinates.npy"
)

_movies_df["pca_x"]=coords[:,0]
_movies_df["pca_y"]=coords[:,1]
# import numpy as np
# from sklearn.cluster import KMeans
# from sklearn.decomposition import PCA

# from app.ml.vectorizer import get_dataset

# NUM_CLUSTERS = 6

# _movies_df = None
# _movie_clusters = None
# _reduced_vectors = None


def _initialize():
    global _movies_df, _movie_clusters, _reduced_vectors
    if _movies_df is not None:
        return

    movies_df, tfidf_matrix = get_dataset()
    kmeans = KMeans(n_clusters=NUM_CLUSTERS, random_state=42, n_init=10)
    _movie_clusters = kmeans.fit_predict(tfidf_matrix)

    pca = PCA(n_components=2, random_state=42)
    _reduced_vectors = pca.fit_transform(tfidf_matrix.toarray())

    movies_df = movies_df.copy()
    movies_df["cluster"] = _movie_clusters
    movies_df["pca_x"] = _reduced_vectors[:, 0]
    movies_df["pca_y"] = _reduced_vectors[:, 1]
    _movies_df = movies_df


def get_cluster_for_movies(indices):
    _initialize()
    clusters = _movies_df.iloc[indices]["cluster"].tolist()
    return max(set(clusters), key=clusters.count)


def get_cluster_recommendations(cluster_id, exclude_indices, limit=10):
    _initialize()
    cluster_movies = _movies_df[_movies_df["cluster"] == cluster_id].copy()
    cluster_movies = cluster_movies.drop(exclude_indices, errors="ignore")
    cluster_movies = cluster_movies.sort_values(
        by=["vote_average", "popularity"], ascending=[False, False]
    )
    return cluster_movies["title"].head(limit).tolist()


def get_cluster_visualization_data(sample_size=300):
    _initialize()
    sample = _movies_df.sample(min(sample_size, len(_movies_df)), random_state=42)
    return sample[["title", "cluster", "pca_x", "pca_y"]].to_dict(orient="records")
