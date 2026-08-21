import re
import time
from collections import defaultdict

from fastapi import HTTPException, Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to append standard security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Lightweight in-memory sliding-window IP rate limiter.
    Limits POST requests to sensitive endpoints (/api/v1/citizen-requests/analyze, /api/v1/scenarios)
    to a max of 60 requests per minute per IP address.
    """

    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.ip_history: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Rate limit POST analysis, ingestion, and simulation endpoints
        if request.method == "POST" and any(
            path in request.url.path for path in ["/citizen-requests", "/scenarios", "/scenario/what-if", "/ingest"]
        ):
            client_ip = request.client.host if request.client else "unknown"
            now = time.time()
            window_start = now - self.window_seconds

            # Filter timestamps within current sliding window
            timestamps = [t for t in self.ip_history[client_ip] if t > window_start]
            self.ip_history[client_ip] = timestamps

            if len(timestamps) >= self.max_requests:
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "success": False,
                        "error": {
                            "code": "RATE_LIMIT_EXCEEDED",
                            "message": f"Rate limit of {self.max_requests} requests per minute exceeded. Please try again later.",
                        },
                    },
                )
            self.ip_history[client_ip].append(now)

        return await call_next(request)


def sanitize_input_text(text: str) -> str:
    """
    Sanitizes citizen input text to strip dangerous prompt injection markers,
    secret exfiltration attempts, or malicious control characters.
    """
    if not text:
        return ""
    # Strip null bytes and non-printable control chars
    cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)

    # Neutralize prompt injection / secret exfiltration overrides
    cleaned = re.sub(r"(?i)ignore\s+(all\s+)?previous\s+instructions", "[OVERRIDE REMOVED]", cleaned)
    cleaned = re.sub(r"(?i)output\s+api_key[^\s]*", "[SECRET ATTEMPT NEUTRALIZED]", cleaned)
    cleaned = re.sub(r"(?i)reveal\s+(the\s+)?api_key", "[SECRET ATTEMPT NEUTRALIZED]", cleaned)

    return cleaned.strip()


async def validate_request_size(request: Request):
    """Dependency to enforce max request body size limits."""
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > settings.MAX_BODY_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Payload exceeds maximum allowed size of {settings.MAX_BODY_SIZE_BYTES} bytes.",
        )
