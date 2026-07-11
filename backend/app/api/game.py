from typing import Annotated

from fastapi import APIRouter, Depends
from openai import AsyncOpenAI

from app.infrastructure.openai_client import get_openai_client
from app.schemas.game import GuessRequest, GuessResponse
from app.services.guess_service import GuessService

router = APIRouter(prefix="/api/v1/game", tags=["game"])


def get_guess_service(
    client: Annotated[AsyncOpenAI, Depends(get_openai_client)],
) -> GuessService:
    return GuessService(client)


@router.post("/guess")
async def guess(
    request: GuessRequest,
    service: Annotated[GuessService, Depends(get_guess_service)],
) -> GuessResponse:
    animal_guess = await service.guess_animal(request.hints)
    return GuessResponse(guess=animal_guess, hints_used=len(request.hints))