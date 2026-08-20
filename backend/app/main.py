from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.core.security import SecurityHeadersMiddleware
from app.api.routes import router as api_router

# Configure Logger
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("civicpulse.main")

app = FastAPI(
    title="CivicPulse AI Backend API",
    description="Citizen Demand Intelligence & Infrastructure Prioritization Engine for BRICS Nations",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Append Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include Router
app.include_router(api_router)


@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting CivicPulse AI Backend in [{settings.ENVIRONMENT}] mode.")
    logger.info(f"CORS Whitelist: {settings.cors_origins_list}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.BACKEND_HOST, port=settings.BACKEND_PORT, reload=True)
