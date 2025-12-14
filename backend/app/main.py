from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import auth, users, tasks
from app.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth Dashboard API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

@app.get("/")
def root():
    return {"message": "Auth Dashboard API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
