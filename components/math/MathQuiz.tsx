'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaStar, FaTrophy, FaRedo, FaHeart } from 'react-icons/fa';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

interface Question {
  question: string;
  options: number[];
  correctAnswer: number;
  visual?: string;
}

const generateQuestion = (difficulty: 'easy' | 'medium' | 'hard'): Question => {
  let num1: number, num2: number, operation: string;

  switch (difficulty) {
    case 'easy':
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      operation = '+';
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = Math.random() > 0.5 ? '+' : '-';
      if (operation === '-' && num2 > num1) [num1, num2] = [num2, num1];
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      operation = Math.random() > 0.5 ? '+' : '-';
      if (operation === '-' && num2 > num1) [num1, num2] = [num2, num1];
      break;
  }

  const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;

  // Generate wrong options
  const options = [correctAnswer];
  while (options.length < 4) {
    const wrongAnswer = correctAnswer + Math.floor(Math.random() * 6) - 3;
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }

  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  return {
    question: `${num1} ${operation} ${num2} = ?`,
    options,
    correctAnswer,
    visual: operation === '+'
      ? '🌟'.repeat(num1) + ' + ' + '🌟'.repeat(num2)
      : '🌟'.repeat(num1) + ' - ' + '❌'.repeat(num2),
  };
};

export default function MathQuiz() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { playAudio } = useAudio();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !currentQuestion && !gameOver) {
      setCurrentQuestion(generateQuestion(difficulty));
    }
  }, [isClient, currentQuestion, difficulty, gameOver]);

  const handleAnswer = (answer: number) => {
    if (showResult || !currentQuestion) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const newScore = score + 10;
      setScore(newScore);
      // Play success audio
      playAudio(getRandomAudio(mathAudioFiles.correct));
    } else {
      setLives(lives - 1);
      // Play incorrect audio
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      if (lives - 1 <= 0) {
        setGameOver(true);
        // Save quiz completion to localStorage
        saveQuizStats(score, questionCount + 1);
      }
    }

    setTimeout(() => {
      if (lives - 1 > 0 || correct) {
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setQuestionCount(questionCount + 1);
        setCurrentQuestion(generateQuestion(difficulty));
      }
    }, 1500);
  };

  const saveQuizStats = (finalScore: number, totalQuestions: number) => {
    try {
      const savedStats = localStorage.getItem('mathAdventuresStats');
      const stats = savedStats ? JSON.parse(savedStats) : {
        lessonsCompleted: 0,
        quizzesPassed: 0,
        starsEarned: 0,
        totalScore: 0,
        gamesPlayed: 0,
        lastActivity: 'Never',
      };

      const stars = Math.floor(finalScore / 10);
      stats.quizzesPassed += 1;
      stats.starsEarned += stars;
      stats.totalScore += finalScore;
      stats.lastActivity = new Date().toLocaleDateString();

      localStorage.setItem('mathAdventuresStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save quiz stats:', error);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setQuestionCount(0);
    setLives(3);
    setGameOver(false);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentQuestion(generateQuestion(difficulty));
  };

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    handleRestart();
  };

  if (!isClient || !currentQuestion) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-gray-500">Loading quiz...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Difficulty Selection */}
      <div className="flex justify-center gap-4 mb-6">
        {(['easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            onClick={() => handleDifficultyChange(level)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              difficulty === level
                ? 'bg-blue-500 text-white shadow-lg scale-110'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Score and Lives */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <FaStar className="text-yellow-400 text-2xl" />
          <span className="text-2xl font-bold text-gray-800">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">Lives:</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <FaHeart
                key={i}
                className={`text-2xl ${
                  i < lives ? 'text-red-500' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {!gameOver ? (
        <motion.div
          key={questionCount}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl"
        >
          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-purple-700 baloo mb-4">
              {currentQuestion.question}
            </h2>
            {currentQuestion.visual && (
              <p className="text-3xl mb-4">{currentQuestion.visual}</p>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={!showResult ? { scale: 1.05 } : {}}
                whileTap={!showResult ? { scale: 0.95 } : {}}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`py-6 px-8 rounded-2xl text-3xl font-bold transition-all ${
                  showResult && option === currentQuestion.correctAnswer
                    ? 'bg-green-500 text-white'
                    : showResult && option === selectedAnswer && !isCorrect
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-blue-100'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`text-center py-4 px-6 rounded-2xl ${
                  isCorrect
                    ? 'bg-green-200 border-2 border-green-400'
                    : 'bg-red-200 border-2 border-red-400'
                }`}
              >
                <p className="text-2xl font-bold">
                  {isCorrect ? '🎉 Excellent!' : '❌ Oops! Try again next time!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-12 shadow-2xl text-center"
        >
          <FaTrophy className="text-8xl text-yellow-500 mx-auto mb-6" />
          <h2 className="text-5xl font-bold text-gray-800 baloo mb-4">
            Game Over!
          </h2>
          <p className="text-3xl font-bold text-gray-700 mb-2">
            Final Score: {score}
          </p>
          <p className="text-xl text-gray-600 mb-8">
            You answered {questionCount} questions!
          </p>
          <button
            onClick={handleRestart}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl flex items-center gap-2 mx-auto transition-all"
          >
            <FaRedo /> Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
