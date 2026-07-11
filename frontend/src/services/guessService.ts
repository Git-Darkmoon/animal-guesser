import type { GuessResponse } from "./types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const guessService = {
  async attemptGuess(hints: string[]): Promise<GuessResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/game/guess`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hints }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return (await response.json()) as GuessResponse
  },
}
