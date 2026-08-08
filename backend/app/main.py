from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.endpoints import ai, auth, catalog, commerce, onboarding, recommendations

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(
    onboarding.router, prefix=f"{settings.API_V1_STR}/onboarding", tags=["onboarding"]
)
app.include_router(
    catalog.router, prefix=f"{settings.API_V1_STR}/catalog", tags=["catalog"]
)
app.include_router(
    commerce.router, prefix=f"{settings.API_V1_STR}/commerce", tags=["commerce"]
)
app.include_router(
    recommendations.router,
    prefix=f"{settings.API_V1_STR}/recommendations",
    tags=["recommendations"],
)
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])

import os

from fastapi.staticfiles import StaticFiles

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/health")
def health_check():
    return {"status": "ok"}
