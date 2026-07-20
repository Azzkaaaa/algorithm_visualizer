from fastapi import FastAPI

app = FastAPI(
    title="algorithm visualizer API",
    version="0.1.0"
)

@app.get("/")
def root() -> dict[str, str]:
    return {"message": "algorithm visualizer API is running"}

@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}