from fastapi import FastAPI
from .config import settings
from .api.v1 import lessons, classroom, analytics, dna

app = FastAPI(title="Edusync API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    # Initialize services, database connections, etc.
    pass

app.include_router(lessons.router, prefix="/api/v1", tags=["lessons"])
app.include_router(classroom.router, prefix="/api/v1", tags=["classroom"])
app.include_router(analytics.router, prefix="/api/v1", tags=["analytics"])
app.include_router(dna.router, prefix="/api/v1", tags=["dna"])