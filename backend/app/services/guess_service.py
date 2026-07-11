from openai import AsyncOpenAI

from app.infrastructure.config import get_settings
from app.prompts.animal_guess import SYSTEM_PROMPT, build_user_prompt
from app.schemas.game import AnimalGuess


class GuessService:
    def __init__(self, client: AsyncOpenAI):
        self._client = client
        self._model = get_settings().openai_model

    async def guess_animal(self, hints: list[str]) -> AnimalGuess:
        response = await self._client.responses.parse(
            model=self._model,
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(hints)},
            ],
            text_format=AnimalGuess,
        )

        if response.output_parsed is None:
            raise ValueError("Failed to parse animal guess response")

        return response.output_parsed
