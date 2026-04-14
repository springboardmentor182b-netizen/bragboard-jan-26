from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.config import engine, Base
from src.shoutouts.controller import router as shoutouts_router
from src.reports.controller import router as reports_router
from src.admin.controller import router as admin_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BragBoard API",
    version="v1",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Allow all origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount routers
app.include_router(shoutouts_router, prefix="/api/v1/shoutouts", tags=["Shoutouts"])
app.include_router(reports_router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/")
def root():
    return {"message": "BragBoard API", "version": "v1"}

@app.get("/health")
def health():
    return {"status": "healthy"}
