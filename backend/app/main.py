import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router as api_router
from app.core.config import settings
from app.core.security import RateLimitMiddleware, SecurityHeadersMiddleware

# Configure Logger
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("civicpulse.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Modern FastAPI Lifespan Handler for Startup and Shutdown Events."""
    logger.info(f"Starting CivicPulse AI Backend Service v{settings.VERSION} in [{settings.ENVIRONMENT}] mode.")
    logger.info(f"CORS Whitelist: {settings.cors_origins_list}")
    yield
    logger.info("Shutting down CivicPulse AI Backend Service.")


app = FastAPI(
    title="CivicPulse AI Backend API",
    description="Citizen Demand Intelligence & Infrastructure Prioritization Engine for BRICS Nations",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Append Rate Limit and Security Headers Middlewares
app.add_middleware(RateLimitMiddleware, max_requests=60, window_seconds=60)
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


@app.get("/", tags=["Root"])
async def root():
    """Root Endpoint returning service status and health check reference."""
    return {
        "service": "CivicPulse AI",
        "status": "online",
        "version": settings.VERSION,
        "message": "Civic Intelligence API is running.",
        "health": "/api/v1/health",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global Exception Handler returning clean, production-safe JSON error payloads without stack traces."""
    logger.exception(f"Unhandled exception on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An internal server error occurred while processing your request.",
            },
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.BACKEND_HOST, port=settings.effective_port, reload=True)
