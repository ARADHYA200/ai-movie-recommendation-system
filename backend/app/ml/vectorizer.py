import pandas as pd
import ast
from sklearn.feature_extraction.text import TfidfVectorizer

movies_df = pd.read_csv("data/tmdb_5000_movies.csv")

movies_df = movies_df[['title', 'overview', 'genres']].dropna()

def extract_genres(genre_str):
    try:
        genres = ast.literal_eval(genre_str)
        return [g['name'] for g in genres]
    except:
        return []

movies_df['genre_list'] = movies_df['genres'].apply(extract_genres)
movies_df['content'] = movies_df['title'] + " " + movies_df['overview']

vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(movies_df['content'])

def get_dataset():
    return movies_df, tfidf_matrix