import joblib
from scipy import sparse
from pathlib import Path
from app.utils.data_loader import load_movies_dataset
from sklearn.feature_extraction.text import TfidfVectorizer

MODEL_DIR = Path(__file__).parent/"models"

_movies_df = None
_vectorizer = None
_tfidf_matrix = None

def _initialize():

    global _movies_df,_vectorizer,_tfidf_matrix

    if _movies_df is not None:
        return

    from app.utils.data_loader import load_movies_dataset

    _movies_df = load_movies_dataset()

    _vectorizer = joblib.load(
        MODEL_DIR/"tfidf_vectorizer.pkl"
    )

    _tfidf_matrix = sparse.load_npz(
        MODEL_DIR/"movie_tfidf.npz"
    )
# from sklearn.feature_extraction.text import TfidfVectorizer

# from app.utils.data_loader import load_movies_dataset

# _movies_df = None
# _tfidf_matrix = None
# _vectorizer = None


def _initialize():
    global _movies_df, _tfidf_matrix, _vectorizer
    if _movies_df is not None:
        return
    _movies_df = load_movies_dataset()
    _vectorizer = TfidfVectorizer(stop_words="english", max_features=15000, ngram_range=(1, 2))
    _tfidf_matrix = _vectorizer.fit_transform(_movies_df["content"])


def get_dataset():
    _initialize()
    return _movies_df, _tfidf_matrix


def get_vectorizer():
    _initialize()
    return _vectorizer
