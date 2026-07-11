# Animal Guesser

**Think of an animal. Give three clues. Let the AI guess.**

A tiny two-minute guessing game: you describe an animal one hint at a time,
and an LLM tries to name it — along with a confidence score and its
reasoning — after every clue.

## How it works

1. You type a clue describing an animal without naming it (e.g. *"It has
   feathers but can't fly"*).
2. The clue is sent to the backend, which asks an OpenAI model to guess the
   animal based on all clues given so far.
3. The AI responds with its best guess, a confidence score, and its
   reasoning.
4. You can stop there, or feed it another clue (up to 3 total) to see if it
   changes its mind.

## Tech stack

**Backend** — `backend/`
- [FastAPI](https://fastapi.tiangolo.com/) (async, Python 3.13+)
- [OpenAI Python SDK](https://github.com/openai/openai-python) using
  structured outputs (`responses.parse`) to return typed guesses
- [uv](https://docs.astral.sh/uv/) for dependency management
- [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
  for config

**Frontend** — `frontend/`
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server & build
- [pnpm](https://pnpm.io/) as the package manager
- CSS Modules for styling

## Project structure

```
backend/
  app/
    api/            # FastAPI routers (health, game)
    schemas/         # Pydantic request/response models
    services/        # Business logic (GuessService)
    prompts/         # System/user prompt templates
    infrastructure/  # Settings & OpenAI client wiring
  main.py            # FastAPI app entrypoint

frontend/
  src/
    components/
      GameBoard/     # Core game UI (hints, guess reveal, confidence bar)
    services/        # API client for the guess endpoint
    App.tsx           # Page layout & copy
```

## Getting started

### Prerequisites
- Python 3.13+ and [uv](https://docs.astral.sh/uv/)
- Node.js and [pnpm](https://pnpm.io/)
- An OpenAI API key

### Backend

```bash
cd backend
cp .env.example .env   # add your OPENAI_API_KEY
uv sync
uv run uvicorn main:app --reload
```

The API runs at `http://localhost:8000`. Health check: `GET /health`.

Required environment variables (`backend/.env`):

| Variable         | Description                          | Default        |
|------------------|---------------------------------------|----------------|
| `OPENAI_API_KEY` | Your OpenAI API key                   | *(required)*   |
| `OPENAI_MODEL`   | Model used to generate guesses        | `gpt-4o-mini`  |

### Frontend

```bash
cd frontend
cp .env.example .env   # defaults to http://localhost:8000
pnpm install
pnpm dev
```

The app runs at `http://localhost:5173`.

## API

### `POST /api/v1/game/guess`

Request:
```json
{ "hints": ["It has feathers but can't fly"] }
```

Response:
```json
{
  "guess": {
    "animal_name": "Penguin",
    "confidence": 0.62,
    "reasoning": "Feathers combined with an inability to fly strongly suggests a flightless bird like a penguin."
  },
  "hints_used": 1
}
```

Accepts 1–3 hints per request.
