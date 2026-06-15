from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from app.ml.vectorizer import get_dataset
import numpy as np

movies_df, tfidf_matrix = get_dataset()

NUM_CLUSTERS = 6

kmeans = KMeans(n_clusters=NUM_CLUSTERS, random_state=42)
movie_clusters = kmeans.fit_predict(tfidf_matrix)

movies_df["cluster"] = movie_clusters

# ===== PCA REDUCTION =====
pca = PCA(n_components=2)
reduced_vectors = pca.fit_transform(tfidf_matrix.toarray())

movies_df["pca_x"] = reduced_vectors[:, 0]
movies_df["pca_y"] = reduced_vectors[:, 1]


def get_cluster_for_movies(indices):
    clusters = movies_df.iloc[indices]["cluster"].tolist()
    return max(set(clusters), key=clusters.count)


def get_cluster_recommendations(cluster_id, exclude_indices):
    cluster_movies = movies_df[movies_df["cluster"] == cluster_id]
    cluster_movies = cluster_movies.drop(exclude_indices, errors='ignore')
    return cluster_movies["title"].head(5).tolist()


def get_cluster_visualization_data(sample_size=300):
    sample = movies_df.sample(sample_size)
    return sample[["title", "cluster", "pca_x", "pca_y"]].to_dict(orient="records")