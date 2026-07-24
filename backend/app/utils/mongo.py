from typing import TypeVar
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

def to_doc(model: BaseModel) -> dict:
    return model.model_dump(mode="json")

def from_doc(model_cls: type[T], doc: dict) -> T:
    return model_cls.model_validate(doc)
