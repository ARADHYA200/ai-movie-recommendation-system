from pydantic import BaseModel
from typing import List

class MovieInput(BaseModel):
    movies: List[str]