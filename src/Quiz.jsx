import { useState, useEffect } from 'react'
import ScoreBoard from './ScoreBoard'
import GameOver from './GameOver'

function Quiz() {
  const generateQuestion = () => {
    const operations = ['+', '-', '*']
    const op = operations[Math.floor(Math.random() * operations.length)]
    const num1 = Math.ceil(Math.random() * 10)
    const num2 = Math.ceil(Math.random() * 10)

    return { num1, num2, op }
  }

  const [question, setQuestion] = useState(generateQuestion())
  const [response, setResponse] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(7)
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('highScore')) || 0
  )

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const calculateAnswer = () => {
    const { num1, num2, op } = question
    if (op === '+') return num1 + num2
    if (op === '-') return num1 - num2
    if (op === '*') return num1 * num2
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const answer = parseInt(response)

      if (answer === calculateAnswer()) {
        const newScore = score + 1
        setScore(newScore)
        setFeedback('Correct!')
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem('highScore', newScore)
        }
      } else {
        setScore(score>0 ?score - 1:0)
        setFeedback('Wrong!')
      }

      setResponse('')
      setQuestion(generateQuestion())
      setTimeLeft(10)
    }
  }

  const restartGame = () => {
    setScore(0)
    setQuestion(generateQuestion())
    setTimeLeft(7)
    setGameOver(false)
    setFeedback('')
  }

  if (gameOver) {
    return (
      <GameOver 
        score={score} 
        highScore={highScore} 
        restartGame={restartGame} 
      />
    )
  }

  return (
    <div>
      <h2>Time Left: {timeLeft}s</h2>

      <h2>
        {question.num1} {question.op} {question.num2}
      </h2>

      <input
        type="text"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    <ScoreBoard score={score} highScore={highScore} />

      <p>{feedback}</p>
    </div>
  )
}

export default Quiz
