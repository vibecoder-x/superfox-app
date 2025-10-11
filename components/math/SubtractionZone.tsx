'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type DifficultyLevel = 'sub-from-10' | 'sub-from-20' | 'sub-from-50';

interface Question {
  num1: number;
  num2: number;
  answer: number;
}

export default function SubtractionZone() {
  const { playAudio } = useAudio();
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const difficulties = [
    { id: 'sub-from-10' as DifficultyLevel, title: 'Subtract from 10', emoji: '🟢', maxNum: 10, color: 'from-green-400 to-teal-600' },
    { id: 'sub-from-20' as DifficultyLevel, title: 'Subtract from 20', emoji: '🔵', maxNum: 20, color: 'from-blue-400 to-purple-600' },
    { id: 'sub-from-50' as DifficultyLevel, title: 'Subtract from 50', emoji: '🟣', maxNum: 50, color: 'from-purple-400 to-pink-600' },
  ];

  const generateQuestion = (maxNum: number): Question => {
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * num1) + 1;
    return {
      num1,
      num2,
      answer: num1 - num2,
    };
  };

  const startLevel = (level: DifficultyLevel) => {
    setDifficulty(level);
    const selectedDifficulty = difficulties.find(d => d.id === level);
    if (selectedDifficulty) {
      setCurrentQuestion(generateQuestion(selectedDifficulty.maxNum));
    }
    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setUserAnswer('');
    setShowFeedback(null);
  };

  const handleSubmit = () => {
    if (!currentQuestion || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 10);
      setQuestionsAnswered(questionsAnswered + 1);

      setTimeout(() => {
        const selectedDifficulty = difficulties.find(d => d.id === difficulty);
        if (selectedDifficulty) {
          setCurrentQuestion(generateQuestion(selectedDifficulty.maxNum));
        }
        setUserAnswer('');
        setShowFeedback(null);
      }, 1500);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      setLives(lives - 1);

      if (lives - 1 <= 0) {
        setTimeout(() => {
          setDifficulty(null);
          setCurrentQuestion(null);
        }, 1500);
      } else {
        setTimeout(() => {
          setUserAnswer('');
          setShowFeedback(null);
        }, 1500);
      }
    }
  };

  if (!difficulty) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold text-pink-600 mb-4 baloo">➖ Subtraction Zone!</h2>
          <p className="text-xl text-gray-700 mb-8">Take away numbers and see what remains!</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((diff, index) => (
            <motion.div
              key={diff.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => startLevel(diff.id)}
              className={`bg-gradient-to-br ${diff.color} rounded-3xl p-8 cursor-pointer shadow-xl hover:shadow-2xl transition-all`}
            >
              <div className="text-center text-white">
                <div className="text-7xl mb-4">{diff.emoji}</div>
                <h3 className="text-2xl font-bold mb-2 baloo">{diff.title}</h3>
                <p className="text-lg opacity-90">Numbers up to {diff.maxNum}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (lives <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-12 text-center shadow-2xl"
      >
        <div className="text-8xl mb-6">💪</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Great Effort!</h2>
        <p className="text-2xl text-gray-600 mb-6">You answered {questionsAnswered} questions correctly!</p>
        <p className="text-3xl font-bold text-pink-600 mb-8">Score: {score} points ⭐</p>
        <button
          onClick={() => setDifficulty(null)}
          className="bg-gradient-to-r from-pink-400 to-rose-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform"
        >
          Try Again! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-pink-600">Score: {score}</div>
          <div className="text-2xl font-bold text-purple-600">Questions: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">
              {i < lives ? '💜' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      {currentQuestion && (
        <motion.div
          key={`${currentQuestion.num1}-${currentQuestion.num2}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-12 shadow-2xl"
        >
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Subtract and Find Out!</h3>

            <div className="flex items-center justify-center gap-8 text-6xl font-bold text-pink-600">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                {currentQuestion.num1}
              </motion.div>
              <div className="text-5xl">➖</div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2, delay: 0.5 }}
              >
                {currentQuestion.num2}
              </motion.div>
              <div className="text-5xl">=</div>
              <div className="text-5xl">?</div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-gray-600">Start with {currentQuestion.num1} items, take away {currentQuestion.num2}</p>
              <div className="flex justify-center gap-2 flex-wrap max-w-2xl mx-auto">
                {[...Array(currentQuestion.num1)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${
                      i < currentQuestion.answer ? 'bg-pink-500' : 'bg-gray-300 opacity-30'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-48 text-5xl text-center font-bold border-4 border-pink-500 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-pink-300"
              placeholder="?"
              autoFocus
            />

            <button
              onClick={handleSubmit}
              disabled={userAnswer === ''}
              className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              Check Answer! ✓
            </button>

            {showFeedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}
              >
                {showFeedback === 'correct' ? '✅ Perfect!' : '❌ Not quite!'}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setDifficulty(null)}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-all"
      >
        ← Back to Levels
      </button>
    </div>
  );
}
