from sklearn.feature_extraction.text import TfidfVectorizer

from app.utils.data_loader import load_movies_dataset

_movies_df = None
_tfidf_matrix = None
_vectorizer = None


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
