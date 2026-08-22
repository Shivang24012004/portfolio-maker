from uuid import UUID
from typing import Any, Dict, Optional
from pydantic import Field
from app.models.base import MongoModel

class LayoutData(MongoModel):
    name: str = "Untitled Portfolio"
    version: int = 1
    user_id: Optional[UUID] = None
    content: Dict[str, Any] = Field(default_factory=lambda: {"content": [], "root": {}})
