import { GameBoard } from "./components/GameBoard/GameBoard"
import styles from "./App.module.css"

export const App = () => {
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.kicker}>A guessing game for two minds</span>
        <h1 className={styles.title}>
          Think of an animal.
          <br />
          <span className={styles.titleAccent}>Let the AI find it.</span>
        </h1>
        <p className={styles.subtitle}>
          You get three clues. Give too much away and it'll guess in one, hold
          back and it might never catch up. Choose your words carefully.
        </p>
      </div>
      <GameBoard />
    </main>
  )
}
