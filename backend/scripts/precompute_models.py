from pathlib import Path
import joblib
import numpy as np
from scipy import sparse
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.feature_extraction.text import TfidfVectorizer

from app.utils.data_loader import load_movies_dataset

OUTPUT = Path("app/ml/models")
OUTPUT.mkdir(parents=True, exist_ok=True)

movies = load_movies_dataset()

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=15000,
    ngram_range=(1,2)
)

tfidf = vectorizer.fit_transform(movies["content"])

joblib.dump(vectorizer, OUTPUT/"tfidf_vectorizer.pkl")
sparse.save_npz(OUTPUT/"movie_tfidf.npz", tfidf)

kmeans = KMeans(
    n_clusters=6,
    random_state=42,
    n_init=10
)

clusters = kmeans.fit_predict(tfidf)

joblib.dump(kmeans, OUTPUT/"kmeans.pkl")
np.save(OUTPUT/"cluster_labels.npy", clusters)

pca = PCA(n_components=2, random_state=42)

coords = pca.fit_transform(tfidf.toarray())

np.save(OUTPUT/"pca_coordinates.npy", coords)

print("Done")