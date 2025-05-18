import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./App.css";

const tema = [
  "elefante", "girafa", "canguru", "pinguim", "golfinho", "jacare",
  "zebra", "leao", "tigre", "hipopotamo", "aguia", "rinoceronte",
  "raposa", "sapo", "foca", "morsa", "peixe", "tubarao", "gaviao",
  "cachorro", "gato", "rato", "cobra", "caracol", "lesma",
  "ornitorrinco", "touro", "abelha", "porco", "joaninha",
  "tartaruga", "cavalo", "lobo", "leopardo"
];

const getRandomWord = () => tema[Math.floor(Math.random() * tema.length)];

function App() {
  const [word, setWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);

  const maxTries = 6;

  const handleGuess = (letter) => {
    if (/^[a-z]$/.test(letter) && !gameOver) {
      if (word.includes(letter)) {
        if (!guessedLetters.includes(letter)) {
          setGuessedLetters([...guessedLetters, letter]);
        }
      } else {
        if (!wrongGuesses.includes(letter)) {
          setWrongGuesses([...wrongGuesses, letter]);
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    handleGuess(e.key.toLowerCase());
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  useEffect(() => {
    const isWinner = word.split("").every((letter) => guessedLetters.includes(letter));
    if (isWinner) {
      setWin(true);
      setGameOver(true);
      const errors = wrongGuesses.length;
      if (errors === 0) setScore(score + 10);
      else if (errors === 1) setScore(score + 8);
      else if (errors === 2) setScore(score + 6);
      else if (errors === 3) setScore(score + 3);
      else if (errors === 4) setScore(score + 2);
      else if (errors === 5) setScore(score + 1);
    }
    if (wrongGuesses.length >= maxTries) {
      setGameOver(true);
    }
  }, [guessedLetters, wrongGuesses, word]);

  const resetGame = () => {
    setWord(getRandomWord);
    setGuessedLetters([]);
    setWrongGuesses([]);
    setGameOver(false);
    setWin(false);
    inputRef.current?.focus();
  };

  const resetScore = () => {
    setScore(0);
  };

  const renderWord = () =>
    word.split("").map((letter, index) => (
      <span key={index} className="letter">
        {guessedLetters.includes(letter) || gameOver ? letter : "_"}
      </span>
    ));

  return (
    <div className="app">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="title">
        🐾 Jogo da Forca - Animais 🐾
      </motion.h1>

      <div className="score">
        <p>Pontuação: {score}</p>
        <button onClick={resetScore}>Zerar Pontuação</button>
      </div>

      <div className="word-box">{renderWord()}</div>

      <input
        type="text"
        maxLength="1"
        ref={inputRef}
        onChange={(e) => {
          handleGuess(e.target.value.toLowerCase());
          e.target.value = "";
        }}
        className="mobile-input"
        autoFocus
        inputMode="text"
        pattern="[a-zA-Z]"
      />

      <motion.div className="status" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
        <p>Letras erradas: {wrongGuesses.join(", ")}</p>
        <p>Tentativas restantes: {maxTries - wrongGuesses.length}</p>
      </motion.div>

      {gameOver && (
        <motion.div
          className={`result ${win ? "win" : "lose"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{win ? "🎉 Você venceu! 🎉" : `💀 Você perdeu! A palavra era: ${word}`}</p>
          <button onClick={resetGame}>Jogar Novamente</button>
        </motion.div>
      )}

      <footer>
        <p>Digite letras no teclado ou use o campo acima para adivinhar o animal!</p>
      </footer>
    </div>
  );
}

export default App;
