from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import game, health

app = FastAPI(title="Animal Guesser")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://animal-guesser-fawn.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(game.router)
