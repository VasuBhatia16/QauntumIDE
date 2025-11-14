from dotenv import load_dotenv
import os

load_dotenv()

CLERK_ISSUER = os.getenv("CLERK_ISSUER", "").rstrip("/")
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")
API_PORT = int(os.getenv("API_PORT", "8000"))
