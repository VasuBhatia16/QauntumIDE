from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import config
from .routers import system, execute
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="QuantumIDE Backend", version="0.2.0")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",config.ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system.router, prefix="/api")
app.include_router(execute.router, prefix="/api")

app.mount("/", StaticFiles(directory="static", html=True), name="static")