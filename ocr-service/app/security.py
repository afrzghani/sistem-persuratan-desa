import secrets

from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader

from app.config import OCR_API_KEY

api_key_header = APIKeyHeader(
    name="X-API-Key",
    auto_error=False,
)

def verify_api(
    api_key: str | None = Security(api_key_header),
) -> None:
    if api_key is None or not secrets.compare_digest(
        api_key.encode("utf-8"),
        OCR_API_KEY.encode("utf-8"),
    ):
        raise HTTPException(
            status_code=401,
            detail="API key tidak valid.",
            headers={"WWW-Authenticate": "APIKey"},
        )