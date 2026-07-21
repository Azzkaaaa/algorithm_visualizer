from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import TraceRequest, TraceResponse
from app.tracer import execute_with_trace

app = FastAPI(
    title="algorithm visualizer API",
    description="API untuk memvisualisasikan eksekusi algoritma Python.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root() -> dict[str, str]:
    return {"message": "algorithm visualizer API is running"}

@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.post("/api/trace", response_model=TraceResponse)
def create_trace(request: TraceRequest) -> TraceResponse:
    try:
        result, steps = execute_with_trace(
            code=request.code,
            function_name=request.function_name,
            args=request.args,
            kwargs=request.kwargs
        )
        return TraceResponse(result=result, steps=steps)
    except SyntaxError as error:
        raise HTTPException(
            status_code=400,
            detail={
                "type": "SyntaxError",
                "message": error.msg,
                "line": error.lineno,
                "offset": error.offset,
            },
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail={
                "type": type(error).__name__,
                "message": str(error),
            },
        ) from error