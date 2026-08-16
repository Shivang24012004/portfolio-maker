from typing import Any, Dict
from pydantic import Field
from app.models.base import MongoModel

class LayoutData(MongoModel):
    name: str = "Untitled Portfolio"
    version: int = 1
    content: Dict[str, Any] = Field(default_factory=lambda: {"content": [], "root": {}})
