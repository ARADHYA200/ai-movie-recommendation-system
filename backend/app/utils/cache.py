import time
from functools import wraps
from typing import Any, Callable

_cache: dict[str, tuple[float, Any]] = {}


def cached(ttl_seconds: int = 300):
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{args}:{sorted(kwargs.items())}"
            now = time.time()
            if key in _cache:
                expires_at, value = _cache[key]
                if now < expires_at:
                    return value
            result = func(*args, **kwargs)
            _cache[key] = (now + ttl_seconds, result)
            return result

        return wrapper

    return decorator


def clear_cache():
    _cache.clear()
