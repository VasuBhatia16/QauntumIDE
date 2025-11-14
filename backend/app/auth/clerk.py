from typing import Any, Dict
from fastapi import HTTPException, Request
from jose import jwt
import httpx
from cachetools import TTLCache
import config

JWKS_URL = f"{config.CLERK_ISSUER}/.well-known/jwks.json"
_JWKS_CACHE = TTLCache(maxsize=1, ttl=3600)

async def _fetch_jwks() -> Dict[str, Any]:
    if "jwks" in _JWKS_CACHE:
        return _JWKS_CACHE["jwks"]
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(JWKS_URL)
        r.raise_for_status()
        jwks = r.json()
        _JWKS_CACHE["jwks"] = jwks
        return jwks

def _pick_key(jwks: Dict[str, Any], kid: str) -> Dict[str, Any]:
    for k in jwks.get("keys", []):
        if k.get("kid") == kid:
            return k
    raise HTTPException(status_code=401, detail="Signing key not found")

async def verify_clerk_token(request: Request) -> Dict[str, Any]:
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = auth[len("Bearer "):]
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        if not kid:
            raise HTTPException(status_code=401, detail="Invalid token header")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token header")
    jwks = await _fetch_jwks()
    key = _pick_key(jwks, kid)
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=[key.get("alg", "RS256")],
            issuer=config.CLERK_ISSUER,
            options={"verify_aud": False},
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")
