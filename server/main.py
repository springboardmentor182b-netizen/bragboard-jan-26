from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.connection import Base, engine
from src.admin.controller import router as admin_router
from src.reports.controller import router as reports_router
from src.entities.shoutout_controller import router as shoutout_router


# ✅ IMPORT MODELS (VERY IMPORTANT)
from src.users import models as user_models
from src.reports import models as report_models
from src.shoutouts import models as shoutout_models

Base.metadata.create_all(bind=engine)


# 🚀 Create app
app = FastAPI()


# ✅ Create tables (redundant but safe)
Base.metadata.create_all(bind=engine)


# 🌐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# create tables
Base.metadata.create_all(bind=engine)

# Admin routes
# 🔗 Include routers
app.include_router(admin_router)
app.include_router(reports_router)
app.include_router(shoutout_router)



# ✅ Root API
@app.get("/")
def read_root():
    return {"message": "BragBoard API running"}