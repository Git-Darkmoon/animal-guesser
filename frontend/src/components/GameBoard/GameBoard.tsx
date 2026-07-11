import { useState } from "react"
import { guessService } from "../../services/guessService"
import type { AnimalGuess } from "../../services/types"
import styles from "./GameBoard.module.css"

type Stage = "hint" | "loading" | "reveal" | "error"

const MAX_HINTS = 3

const ORDINALS = ["first", "second", "third"] as const

export const GameBoard = () => {
  const [hints, setHints] = useState<string[]>([])
  const [draft, setDraft] = useState("")
  const [guess, setGuess] = useState<AnimalGuess | null>(null)
  const [stage, setStage] = useState<Stage>("hint")

  const hintNumber = hints.length
  const hasHintsRemaining = hints.length < MAX_HINTS

  const handleSubmitHint = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return

    const nextHints = [...hints, trimmed]
    setHints(nextHints)
    setDraft("")
    setStage("loading")

    try {
      const response = await guessService.attemptGuess(nextHints)
      setGuess(response.guess)
      setStage("reveal")
    } catch {
      setStage("error")
    }
  }

  const handleKeepGoing = () => {
    setGuess(null)
    setStage("hint")
  }

  const handlePlayAgain = () => {
    setHints([])
    setDraft("")
    setGuess(null)
    setStage("hint")
  }

  return (
    <div className={styles.stage}>
      <HintProgress current={hints.length} total={MAX_HINTS} />

      {hints.length > 0 && <HintsGiven hints={hints} />}

      {(stage === "hint" || stage === "loading" || stage === "error") && (
        <form className={styles.card} onSubmit={handleSubmitHint}>
          <span className={styles.eyebrow}>
            Clue {hintNumber} of {MAX_HINTS}
          </span>
          <h2 className={styles.prompt}>
            Give me your {ORDINALS[hintNumber - 1]} clue
          </h2>
          <input
            className={styles.input}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="It has feathers but can't fly..."
            autoFocus
            disabled={stage === "loading"}
          />
          <button
            className={styles.submit}
            type="submit"
            disabled={stage === "loading" || !draft.trim()}
          >
            {stage === "loading" ? "Thinking…" : "Reveal a guess"}
          </button>
          {stage === "error" && (
            <p className={styles.errorText}>
              Something went wrong reaching the AI. Try that clue again.
            </p>
          )}
        </form>
      )}

      {stage === "reveal" && guess && (
        <div className={styles.card}>
          <span className={styles.eyebrow}>My guess</span>
          <p className={styles.animalName}>{guess.animal_name}</p>
          <ConfidenceBar confidence={guess.confidence} />
          <p className={styles.reasoning}>{guess.reasoning}</p>

          <div className={styles.actions}>
            {hasHintsRemaining && (
              <button className={styles.secondary} onClick={handleKeepGoing}>
                Give another clue
              </button>
            )}
            <button className={styles.submit} onClick={handlePlayAgain}>
              {hasHintsRemaining ? "That's it, start over" : "Play again"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const HintsGiven = ({ hints }: { hints: string[] }) => (
  <ul className={styles.hintsList}>
    {hints.map((hint, index) => (
      <li key={index} className={styles.hintItem}>
        <span className={styles.hintIndex}>{index + 1}</span>
        <span className={styles.hintText}>{hint}</span>
      </li>
    ))}
  </ul>
)

const HintProgress = ({
  current,
  total,
}: {
  current: number
  total: number
}) => (
  <div className={styles.progress} aria-hidden="true">
    {Array.from({ length: total }, (_, index) => (
      <span
        key={index}
        className={`${styles.progressMark} ${
          index < current ? styles.progressMarkFilled : ""
        }`}
      />
    ))}
  </div>
)

const ConfidenceBar = ({ confidence }: { confidence: number }) => (
  <div className={styles.confidenceWrap}>
    <div className={styles.confidenceTrack}>
      <div
        className={styles.confidenceFill}
        style={{ width: `${Math.round(confidence * 100)}%` }}
      />
    </div>
    <span className={styles.confidenceLabel}>
      {Math.round(confidence * 100)}% sure
    </span>
  </div>
)
