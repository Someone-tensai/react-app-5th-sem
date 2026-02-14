import { useState, useEffect } from 'react'
import ScoreBoard from './ScoreBoard'
import GameOver from './GameOver'

function Quiz() {


  const sendScoreToServer = async (finalScore) => {
  const response = await fetch(
    "http://127.0.0.1:8000/api/score/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: finalScore }),
    }
  )
  const data = await response.json()
}

  const [question, setQuestion] = useState({})
  const [response, setResponse] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(7)
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('highScore')) || 0
  )

  const fetchQuestion = async () => {
  const response = await fetch("http://127.0.0.1:8000/api/question/")
  const data = await response.json()
  setQuestion(data)
}
useEffect(() => {
  fetchQuestion()
}, [])

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true)
      sendScoreToServer(score)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const calculateAnswer = () => {
    console.log(question);
    const { num1, num2, operation } = question
    console.log(num1);
    console.log(num2);
    console.log(operation);
    if (operation === '+') return num1 + num2
    if (operation === '-') return num1 - num2
    if (operation === '*') return num1 * num2
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
      fetchQuestion()
      setTimeLeft(7)
    }
  }

  const restartGame = () => {
    setScore(0)
    fetchQuestion()
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
        {question.num1} {question.operation} {question.num2}
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
