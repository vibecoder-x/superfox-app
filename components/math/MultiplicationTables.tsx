'use client';

import { isExactWholeNumberAnswer } from '@/lib/math-activities';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useActivityTimer } from '@/hooks/useActivityTimer';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type TableType = '2' | '5' | '10' | 'mixed';

interface Question {
  num1: number;
  num2: number;
  answer: number;
}

export default function MultiplicationTables() {
  const { playAudio } = useAudio();
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const { schedule } = useActivityTimer(selectedTable);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const answerInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!showFeedback) answerInput.current?.focus();
  }, [showFeedback]);
  const [lives, setLives] = useState(5);

  const tables = [
    { id: '2' as TableType, title: '2× Table', emoji: '✌️', color: 'from-blue-400 to-cyan-600', multiplier: 2 },
    { id: '5' as TableType, title: '5× Table', emoji: '✋', color: 'from-green-400 to-emerald-600', multiplier: 5 },
    { id: '10' as TableType, title: '10× Table', emoji: '🔟', color: 'from-purple-400 to-pink-600', multiplier: 10 },
    { id: 'mixed' as TableType, title: 'Mix & Match', emoji: '🎲', color: 'from-orange-400 to-red-600', multiplier: 0 },
  ];

  const generateQuestion = (tableType: TableType): Question => {
    let num1, num2;

    if (tableType === 'mixed') {
      const multipliers = [2, 5, 10];
      num1 = multipliers[Math.floor(Math.random() * multipliers.length)];
      num2 = Math.floor(Math.random() * 10) + 1;
    } else {
      num1 = parseInt(tableType);
      num2 = Math.floor(Math.random() * 10) + 1;
    }

    return {
      num1,
      num2,
      answer: num1 * num2,
    };
  };

  const startTable = (table: TableType) => {
    setSelectedTable(table);
    setCurrentQuestion(generateQuestion(table));
    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setUserAnswer('');
    setShowFeedback(null);
  };

  const handleSubmit = () => {
    if (!currentQuestion || userAnswer === '' || showFeedback) return;

    const isCorrect = isExactWholeNumberAnswer(userAnswer, currentQuestion.answer);
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 15);
      setQuestionsAnswered(questionsAnswered + 1);

      schedule(() => {
        if (selectedTable) {
          setCurrentQuestion(generateQuestion(selectedTable));
        }
        setUserAnswer('');
        setShowFeedback(null);
      }, 1500);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      setLives(lives - 1);

      if (lives - 1 <= 0) {
        schedule(() => {
          setSelectedTable(null);
          setCurrentQuestion(null);
        }, 1500);
      } else {
        schedule(() => {
          setUserAnswer('');
          setShowFeedback(null);
        }, 1500);
      }
    }
  };

  if (!selectedTable) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold text-cyan-600 mb-4 baloo">✖️ Times Tables!</h2>
          <p className="text-xl text-gray-700 mb-8">Master multiplication with fun patterns!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {tables.map((table, index) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              role="button" tabIndex={0} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); startTable(table.id); } }}
              onClick={() => startTable(table.id)}
              className={`bg-gradient-to-br ${table.color} rounded-3xl p-8 cursor-pointer shadow-xl hover:shadow-2xl transition-all`}
            >
              <div className="text-center text-white">
                <div className="text-7xl mb-4">{table.emoji}</div>
                <h3 className="text-3xl font-bold mb-4 baloo">{table.title}</h3>
                {table.multiplier > 0 && (
                  <div className="space-y-2 text-sm opacity-90">
                    {[...Array(3)].map((_, i) => {
                      const num = (i + 1) * 2;
                      return (
                        <div key={i}>
                          {table.multiplier} × {num} = {table.multiplier * num}
                        </div>
                      );
                    })}
                    <div>and more...</div>
                  </div>
                )}
                {table.id === 'mixed' && (
                  <p className="text-lg opacity-90">Mix of 2×, 5×, and 10×</p>
                )}
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
        className="bg-white rounded-3xl p-6 sm:p-12 text-center shadow-2xl"
      >
        <div className="text-8xl mb-6">🌟</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Great Job!</h2>
        <p className="text-2xl text-gray-600 mb-6">You mastered {questionsAnswered} multiplication problems!</p>
        <p className="text-3xl font-bold text-cyan-600 mb-8">Score: {score} points ⭐</p>
        <button
          onClick={() => setSelectedTable(null)}
          className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform"
        >
          Try Another Table! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="text-2xl font-bold text-cyan-600">Score: {score}</div>
          <div className="text-2xl font-bold text-blue-600">Correct: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">
              {i < lives ? '⭐' : '⚫'}
            </span>
          ))}
        </div>
      </div>

      {currentQuestion && (
        <motion.div
          key={`${currentQuestion.num1}-${currentQuestion.num2}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-6 sm:p-12 shadow-2xl"
        >
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">Multiply!</h3>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-6xl font-bold text-cyan-600">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
              >
                {currentQuestion.num1}
              </motion.div>
              <div className="text-5xl">✖️</div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5, delay: 0.3 }}
              >
                {currentQuestion.num2}
              </motion.div>
              <div className="text-5xl">=</div>
              <div className="text-5xl">?</div>
            </div>

            {/* Visual representation */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg text-gray-600">
                {currentQuestion.num1} groups of {currentQuestion.num2}
              </p>
              <div className="flex flex-wrap gap-4 justify-center max-w-3xl">
                {[...Array(currentQuestion.num1)].map((_, groupIndex) => (
                  <div key={groupIndex} className="flex gap-2 p-3 bg-white rounded-xl">
                    {[...Array(currentQuestion.num2)].map((_, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="w-6 h-6 bg-cyan-500 rounded-full"
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <input
              ref={answerInput} type="number" aria-label="Your answer" disabled={showFeedback !== null}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-48 text-5xl text-center font-bold border-4 border-cyan-500 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-cyan-300"
              placeholder="?"
              autoFocus
            />

            <button
              onClick={handleSubmit}
              disabled={userAnswer === '' || showFeedback !== null}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              Check Answer! ✓
            </button>

            {showFeedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                role="status" aria-live="polite" className={`text-3xl sm:text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}
              >
                {showFeedback === 'correct' ? '✅ Awesome!' : '❌ Try again!'}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setSelectedTable(null)}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-all"
      >
        ← Back to Tables
      </button>
    </div>
  );
}
