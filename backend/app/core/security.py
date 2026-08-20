import re
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to append standard security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response


def sanitize_input_text(text: str) -> str:
    """
    Sanitizes citizen input text to strip dangerous prompt injection markers
    or malicious control characters before passing to NLP services.
    """
    if not text:
        return ""
    # Strip null bytes and non-printable control chars (except standard newlines/tabs)
    cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)
    # Trim excessive whitespace
    return cleaned.strip()


async def validate_request_size(request: Request):
    """Dependency to enforce max request body size limits."""
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > settings.MAX_BODY_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Payload exceeds maximum allowed size of {settings.MAX_BODY_SIZE_BYTES} bytes."
        )
