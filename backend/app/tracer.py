from __future__ import annotations

import sys
from types import FrameType
from typing import Callable, Any

from app.schemas import CallStackFrame, TraceStep
from app.serializer import serialize_value


USER_CODE_FILENAME = "<user_code>"
MAX_TRACE_STEPS = 5_000

def snapshot_locals(frame: FrameType) -> dict[str, Any]:
    return {
        variable_name: serialize_value(value)
        for variable_name, value in frame.f_locals.items()
        if not variable_name.startswith("__")
    }

def snapshot_call_stack(frame: FrameType) -> list[CallStackFrame]:
    frames: list[CallStackFrame] = []
    current_frame: FrameType | None = frame

    while current_frame is not None:
        if (current_frame.f_code.co_filename == USER_CODE_FILENAME):
            frames.append(
                CallStackFrame(
                    function=current_frame.f_code.co_name,
                    line=current_frame.f_lineno,
                    locals=snapshot_locals(current_frame)
                )
            )
        current_frame = current_frame.f_back

    frames.reverse()

    return frames

def execute_with_trace(
    code: str,
    function_name: str,
    args: list[Any],
    kwargs: dict[str, Any],
) -> tuple[Any, list[TraceStep]]:
    namespace: dict[str, Any] = {
        "__name__": "__user_code__"
    }

    steps: list[TraceStep] = []

    compile_code = compile(code, USER_CODE_FILENAME, "exec")

    exec(compile_code, namespace, namespace)

    target_function = namespace.get(function_name)

    if target_function is None:
        raise ValueError(f"Function '{function_name}' tidak ditemukan")
    
    if not callable(target_function):
        raise ValueError(f"'{function_name}' bukan sebuah function")
    
    def tracer(
        frame: FrameType,
        event: str,
        arg: Any
    ) -> Callable[..., Any] | None:
        if frame.f_code.co_filename != USER_CODE_FILENAME:
            return None
        
        if event not in {"call", "return", "line", "exception"}:
            return tracer
        
        if len(steps) >= MAX_TRACE_STEPS:
            raise RuntimeError("Jumlah langkah trace melebihi batas maksimum")
        
        return_value = None

        if event == "return":
            return_value = serialize_value(arg)

        steps.append(
            TraceStep(
                step=len(steps),
                line=frame.f_lineno,
                event=event,
                function=frame.f_code.co_name,
                locals=snapshot_locals(frame),
                return_value=return_value,
                call_stack=snapshot_call_stack(frame),
            )
        )

        return tracer
    
    try:
        sys.settrace(tracer)

        result = target_function(
            *args,
            **kwargs,
        )
    finally:
        sys.settrace(None)

    return serialize_value(result), steps