from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .api.v1 import lessons, classroom, analytics, dna, auth, users
from .db.session import Base, engine

app = FastAPI(title="Edusync API", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.
    """
    import traceback
    print(f"Global exception handler caught: {exc}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Internal server error", "detail": str(exc)}
    )

@app.on_event("startup")
async def startup_event():
    """
    Initialize database tables and services on startup.
    """
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created")

# Register routers
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(lessons.router, prefix="/api/v1", tags=["lessons"])
app.include_router(classroom.router, prefix="/api/v1", tags=["classroom"])
app.include_router(analytics.router, prefix="/api/v1", tags=["analytics"])
app.include_router(dna.router, prefix="/api/v1", tags=["dna"])