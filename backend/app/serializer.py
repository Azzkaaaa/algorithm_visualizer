from __future__ import annotations

from typing import Any

MAX_COLLECTION_SIZE = 100
MAX_DEPTH = 5

def serialize_value(value: Any, depth: int = 0) -> Any:
    '''
    Ngeubah object python jadi bentuk yang bisa di-serialize ke JSON
    '''
    if depth > MAX_DEPTH:
        return "<maximum depth reached>"
    
    if value is None or isinstance(value, (int, float, str, bool)):
        return value
    
    if isinstance(value, list):
        items = value[:MAX_COLLECTION_SIZE]

        return [
            serialize_value(item, depth + 1) for item in items
        ]
    
    if isinstance(value, tuple):
        return {
            "__type__": "tuple",
            "items": [
                serialize_value(item, depth + 1) for item in value[:MAX_COLLECTION_SIZE]
            ]
        }
    
    if isinstance(value, set):
        items = list(value)[:MAX_COLLECTION_SIZE]

        return {
            "__type__": "set",
            "items": [
                serialize_value(item, depth + 1) for item in items
            ]
        }
    
    if isinstance(value, dict):
        serialized: dict[str, Any] = {}

        for index, (key, item) in enumerate(value.items()):
            if index >= MAX_COLLECTION_SIZE:
                serialized["<truncated>"] = True
                break
            
            serialized[str(key)] = serialize_value(item, depth + 1)

        return serialized
    
    return {
        "__type__": type(value).__name__,
        "repr": safe_repr(value)
    }

def safe_repr(value: Any) -> str:
    try:
        return repr(value)[:500]
    except Exception:
        return "<unrepresentable-object>"