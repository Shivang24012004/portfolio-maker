from __future__ import annotations
from typing import Any, Dict, List
from uuid import UUID
from app.models.base import MongoModel
from app.models.layout_type import LayoutType
from pydantic import Field

class Layout(MongoModel):
    type: LayoutType
    name: str
    version: int = 1
    style: Dict[str, Any] = Field(default_factory=dict)
    children: List[Layout] = Field(default_factory=list)
    parent_id: UUID | None = None
