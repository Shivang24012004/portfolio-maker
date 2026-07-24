from typing import Any, Dict
from uuid import UUID
from app.models.base import MongoModel

class LayoutData(MongoModel):
    layout_id: UUID
    version: int = 1
    content: Dict[str, Dict[str, Any]]