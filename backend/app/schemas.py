from typing import Any, Literal
from  pydantic import BaseModel, Field

class TraceRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20_000)
    function_name: str = Field(min_length=1, max_length=100)
    args: list[Any] = Field(default_factory=list)
    kwargs: dict[str, Any] = Field(default_factory=dict)

class TraceStep(BaseModel):
    step: int
    line: int
    event: Literal["call", "line", "return", "exception"]
    function: str
    locals: dict[str, Any]
    return_value: Any | None = None

class TraceResponse(BaseModel):
    result: Any
    steps: list[TraceStep]
