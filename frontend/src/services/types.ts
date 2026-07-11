export interface AnimalGuess {
  animal_name: string
  confidence: number
  reasoning: string
}

export interface GuessResponse {
  guess: AnimalGuess
  hints_used: number
}
