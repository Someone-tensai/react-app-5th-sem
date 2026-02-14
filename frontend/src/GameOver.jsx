function GameOver({ score, highScore, restartGame }) {
  return (
    <div>
      <h2>Game Over!</h2>
      <h3>Your Score: {score}</h3>
      <h3>High Score: {highScore}</h3>
      <button onClick={restartGame}>Play Again</button>
    </div>
  )
}

export default GameOver
