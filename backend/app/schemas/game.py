from pydantic import BaseModel, Field


class GuessRequest(BaseModel):
    hints: list[str] = Field(min_length=1, max_length=3)


class AnimalGuess(BaseModel):
    animal_name: str
    confidence: float = Field(ge=0, le=1)
    reasoning: str


class GuessResponse(BaseModel):
    guess: AnimalGuess
    hints_used: int
