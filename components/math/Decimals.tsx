'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type DecimalLevel = 'tenths' | 'hundredths' | 'compare-decimals' | 'decimal-addition';

export default function Decimals() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<DecimalLevel | null>(null);
  const [decimal, setDecimal] = useState(0);
  const [decimal2, setDecimal2] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'tenths' as DecimalLevel, title: 'Tenths (0.1)', emoji: '🔢', color: 'from-pink-400 to-red-600' },
    { id: 'hundredths' as DecimalLevel, title: 'Hundredths (0.01)', emoji: '💯', color: 'from-blue-400 to-purple-600' },
    { id: 'compare-decimals' as DecimalLevel, title: 'Compare Decimals', emoji: '⚖️', color: 'from-green-400 to-teal-600' },
    { id: 'decimal-addition' as DecimalLevel, title: 'Add Decimals', emoji: '➕', color: 'from-orange-400 to-amber-600' },
  ];

  const generateQuestion = (lvl: DecimalLevel) => {
    if (lvl === 'tenths') {
      const tenths = Math.floor(Math.random() * 10); // 0-9
      const dec = tenths / 10;
      setDecimal(dec);
      setCorrectAnswer(dec.toFixed(1));

      const wrongOptions: string[] = [];
      if (tenths > 0) wrongOptions.push(((tenths - 1) / 10).toFixed(1));
      if (tenths < 9) wrongOptions.push(((tenths + 1) / 10).toFixed(1));

      setOptions([dec.toFixed(1), ...wrongOptions].sort(() => Math.random() - 0.5));
    } else if (lvl === 'hundredths') {
      const hundredths = Math.floor(Math.random() * 100); // 0-99
      const dec = hundredths / 100;
      setDecimal(dec);
      setCorrectAnswer(dec.toFixed(2));

      const wrongOptions: string[] = [];
      if (hundredths > 0) wrongOptions.push(((hundredths - 1) / 100).toFixed(2));
      if (hundredths < 99) wrongOptions.push(((hundredths + 1) / 100).toFixed(2));

      setOptions([dec.toFixed(2), ...wrongOptions].sort(() => Math.random() - 0.5));
    } else if (lvl === 'compare-decimals') {
      const dec1 = (Math.floor(Math.random() * 50) + 1) / 10; // 0.1-5.0
      const dec2 = (Math.floor(Math.random() * 50) + 1) / 10;

      setDecimal(dec1);
      setDecimal2(dec2);

      if (dec1 > dec2) {
        setCorrectAnswer(`${dec1.toFixed(1)} is greater`);
      } else if (dec2 > dec1) {
        setCorrectAnswer(`${dec2.toFixed(1)} is greater`);
      } else {
        setCorrectAnswer('Equal');
      }

      setOptions([`${dec1.toFixed(1)} is greater`, `${dec2.toFixed(1)} is greater`, 'Equal'].slice(0, dec1 === dec2 ? 1 : 2).sort(() => Math.random() - 0.5));
    } else if (lvl === 'decimal-addition') {
      const dec1 = (Math.floor(Math.random() * 20) + 1) / 10; // 0.1-2.0
      const dec2 = (Math.floor(Math.random() * 20) + 1) / 10;
      const sum = dec1 + dec2;

      setDecimal(dec1);
      setDecimal2(dec2);
      setCorrectAnswer(sum.toFixed(1));

      const wrongOptions: string[] = [];
      wrongOptions.push((sum + 0.1).toFixed(1));
      wrongOptions.push((sum - 0.1).toFixed(1));

      setOptions([sum.toFixed(1), ...wrongOptions.filter(w => parseFloat(w) >= 0)].sort(() => Math.random() - 0.5));
    }
  };

  const startLevel = (lvl: DecimalLevel) => {
    setLevel(lvl);
    generateQuestion(lvl);
    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setShowFeedback(null);
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;

    const isCorrect = answer === correctAnswer;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 25);
      setQuestionsAnswered(questionsAnswered + 1);

      setTimeout(() => {
        if (level) generateQuestion(level);
        setShowFeedback(null);
      }, 1500);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      setLives(lives - 1);

      if (lives - 1 <= 0) {
        setTimeout(() => {
          setLevel(null);
        }, 1500);
      } else {
        setTimeout(() => {
          setShowFeedback(null);
        }, 1500);
      }
    }
  };

  const renderNumberLine = (value: number, max: number = 1) => {
    const segments = max === 1 ? 10 : 100;
    const segmentWidth = 100 / segments;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="relative h-20">
          {/* Number line */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 rounded"></div>

          {/* Markers */}
          {[...Array(segments + 1)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${i * segmentWidth}%` }}
            >
              <div className="w-1 h-6 bg-gray-600 -translate-x-1/2"></div>
              {(max === 1 && i % 2 === 0) || (max > 1 && i % 10 === 0) ? (
                <div className="absolute top-8 -translate-x-1/2 text-xs font-bold text-gray-600">
                  {(i / segments * max).toFixed(max === 1 ? 1 : 2)}
                </div>
              ) : null}
            </div>
          ))}

          {/* Pointer */}
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${(value / max) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          >
            <div className="text-5xl">👆</div>
            <div className="absolute top-12 -translate-x-1/2 left-1/2 bg-pink-500 text-white px-3 py-1 rounded-full font-bold">
              {value.toFixed(max === 1 ? 1 : 2)}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-pink-600 mb-4 baloo">🔢 Decimals!</h2>
          <p className="text-xl text-gray-700 mb-8">Learn about decimal numbers and points!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {levels.map((lvl, index) => (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => startLevel(lvl.id)}
              className={`bg-gradient-to-br ${lvl.color} rounded-3xl p-8 cursor-pointer shadow-xl hover:shadow-2xl transition-all`}
            >
              <div className="text-center text-white">
                <div className="text-7xl mb-4">{lvl.emoji}</div>
                <h3 className="text-3xl font-bold mb-2 baloo">{lvl.title}</h3>
                <p className="text-lg opacity-90">
                  {lvl.id === 'tenths' && 'Learn 0.1, 0.2, 0.3...'}
                  {lvl.id === 'hundredths' && 'Learn 0.01, 0.02...'}
                  {lvl.id === 'compare-decimals' && 'Which is bigger?'}
                  {lvl.id === 'decimal-addition' && 'Add decimal numbers!'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (lives <= 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 text-center shadow-2xl">
        <div className="text-8xl mb-6">🎯</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Decimal Expert!</h2>
        <p className="text-2xl text-gray-600 mb-6">You solved {questionsAnswered} decimal problems!</p>
        <p className="text-3xl font-bold text-pink-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-pink-400 to-red-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-pink-600">Score: {score}</div>
          <div className="text-2xl font-bold text-red-600">Solved: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '❤️' : '🖤'}</span>
          ))}
        </div>
      </div>

      <motion.div key={`${decimal}-${decimal2}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-pink-100 to-red-100 rounded-3xl p-12 shadow-2xl">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-gray-800">
            {level === 'tenths' && 'What decimal is shown?'}
            {level === 'hundredths' && 'What decimal is shown?'}
            {level === 'compare-decimals' && 'Which decimal is greater?'}
            {level === 'decimal-addition' && 'What is the sum?'}
          </h3>

          {level === 'decimal-addition' ? (
            <div className="flex items-center justify-center gap-8 text-6xl font-bold text-pink-600">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                {decimal.toFixed(1)}
              </motion.div>
              <div className="text-5xl">+</div>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
                {decimal2.toFixed(1)}
              </motion.div>
              <div className="text-5xl">=</div>
              <div className="text-5xl">?</div>
            </div>
          ) : level === 'compare-decimals' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-32 h-32 bg-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <span className="text-5xl font-bold text-white">{decimal.toFixed(1)}</span>
                </motion.div>
                <div className="text-5xl">vs</div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="w-32 h-32 bg-red-500 rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <span className="text-5xl font-bold text-white">{decimal2.toFixed(1)}</span>
                </motion.div>
              </div>
            </div>
          ) : (
            renderNumberLine(decimal, level === 'tenths' ? 1 : 1)
          )}

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback !== null}
                className={`bg-white border-4 border-pink-500 hover:bg-pink-50 text-gray-800 font-bold py-6 px-4 rounded-2xl text-2xl transition-all hover:scale-105 disabled:opacity-50 ${
                  showFeedback === 'correct' && option === correctAnswer ? 'bg-green-200 border-green-600' :
                  showFeedback === 'incorrect' && option === correctAnswer ? 'bg-green-200 border-green-600' : ''
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {showFeedback && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {showFeedback === 'correct' ? '✅ Perfect!' : `❌ It\'s ${correctAnswer}!`}
            </motion.div>
          )}
        </div>
      </motion.div>

      <button onClick={() => setLevel(null)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-all">
        ← Back to Levels
      </button>
    </div>
  );
}
