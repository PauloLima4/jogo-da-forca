import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

const tema = [
  "elefante", "girafa", "canguru", "pinguim", "golfinho", "jacare", "zebra", "leao",
  "tigre", "hipopotamo", "aguia", "rinoceronte", "raposa", "sapo", "foca", "morsa",
  "peixe", "tubarao", "gaviao", "cachorro", "gato", "rato", "cobra", "caracol", "lesma",
  "ornitorrinco", "touro", "abelha", "porco", "joaninha", "tartaruga", "cavalo", "lobo", "leopardo"
];

const getRandomWord = () => tema[Math.floor(Math.random() * tema.length)];

function App() {
  const [word, setWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);

  const maxTries = 6;

  const handleKeyPress = (e) => {
    const letter = e.key.toLowerCase();
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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  useEffect(() => {
    const isWinner = word.split("").every((letter) => guessedLetters.includes(letter));
    if (isWinner) {
      setWin(true);
      setGameOver(true);
      // Atualiza o score conforme erros
      const errors = wrongGuesses.length;
      let points = 0;
      if (errors === 0) points = 10;
      else if (errors === 1) points = 8;
      else if (errors === 2) points = 6;
      else if (errors === 3) points = 3;
      else if (errors === 4) points = 2;
      else if (errors === 5) points = 1;
      // Se erros = 6 (perdeu), não soma pontos
      setScore(prev => prev + points);
    }
    if (wrongGuesses.length >= maxTries) {
      setGameOver(true);
      setWin(false);
      // Não soma pontos
    }
  }, [guessedLetters, wrongGuesses, word]);

  const resetGame = () => {
    setWord(getRandomWord);
    setGuessedLetters([]);
    setWrongGuesses([]);
    setGameOver(false);
    setWin(false);
  };

  const resetScore = () => {
    setScore(0);
  };

  const renderWord = () =>
    word.split("").map((letter, index) => (
      <span key={index} className="letter">
        {guessedLetters.includes(letter) || gameOver ? letter : ""}
      </span>
    ));

  return (
    <div className="app">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="title">
        🐾 Jogo da Forca - Animais 🐾
      </motion.h1>

      <div className="score">Score: {score}</div>

      <div className="word-box">{renderWord()}</div>

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
          <button onClick={resetScore} style={{marginLeft: "10px", backgroundColor:"#6a4fff"}}>
            Resetar Score
          </button>
        </motion.div>
      )}

      <footer>
        <p>Digite letras no teclado para adivinhar o animal!</p>
      </footer>
    </div>
  );
}

export default App;
