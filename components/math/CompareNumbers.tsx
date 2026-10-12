'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { distinctNumbers, shuffleChoices } from '@/lib/math-activities';
import { useActivityTimer } from '@/hooks/useActivityTimer';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type CompareLevel = 'less-than-10' | 'less-than-100' | 'ordering' | 'symbols';

export default function CompareNumbers() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<CompareLevel | null>(null);
  const { schedule } = useActivityTimer(level);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [thirdNumber, setThirdNumber] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'less-than-10' as CompareLevel, title: 'Compare to 10', emoji: '🔟', color: 'from-blue-400 to-cyan-600' },
    { id: 'less-than-100' as CompareLevel, title: 'Compare to 100', emoji: '💯', color: 'from-green-400 to-teal-600' },
    { id: 'ordering' as CompareLevel, title: 'Order Numbers', emoji: '📊', color: 'from-purple-400 to-pink-600' },
    { id: 'symbols' as CompareLevel, title: 'Math Symbols', emoji: '⚖️', color: 'from-orange-400 to-red-600' },
  ];

  const generateQuestion = (lvl: CompareLevel) => {
    const maximum = lvl === 'less-than-10' ? 10 : lvl === 'less-than-100' ? 100 : 50;
    const [n1, differentNumber, third] = distinctNumbers(3, maximum);
    // The symbols lesson includes equality as well as greater/less than.
    const n2 = lvl === 'symbols' && Math.random() < 0.25 ? n1 : differentNumber;

    setNum1(n1);
    setNum2(n2);

    if (lvl === 'symbols') {
      if (n1 > n2) {
        setCorrectAnswer('>');
      } else if (n1 < n2) {
        setCorrectAnswer('<');
      } else {
        setCorrectAnswer('=');
      }
      setOptions(['>', '<', '='].sort(() => Math.random() - 0.5));
    } else if (lvl === 'ordering') {
      setThirdNumber(third);
      const numbers = [n1, n2, third].sort((a, b) => a - b);
      setCorrectAnswer(numbers.join(', '));

      const wrong1 = [n1, n2, third].sort((a, b) => b - a).join(', ');
      const wrong2 = [numbers[1], numbers[0], numbers[2]].join(', ');
      setOptions(shuffleChoices([numbers.join(', '), wrong1, wrong2]));
    } else {
      if (n1 > n2) {
        setCorrectAnswer(`${n1} is greater`);
      } else {
        setCorrectAnswer(`${n2} is greater`);
      }
      setOptions([`${n1} is greater`, `${n2} is greater`, 'They are equal'].slice(0, 2).sort(() => Math.random() - 0.5));
    }
  };

  const startLevel = (lvl: CompareLevel) => {
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
      setScore(score + 15);
      setQuestionsAnswered(questionsAnswered + 1);

      schedule(() => {
        if (level) generateQuestion(level);
        setShowFeedback(null);
      }, 1500);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      setLives(lives - 1);

      if (lives - 1 <= 0) {
        schedule(() => {
          setLevel(null);
        }, 1500);
      } else {
        schedule(() => {
          setShowFeedback(null);
        }, 1500);
      }
    }
  };

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-cyan-600 mb-4 baloo">⚖️ Compare Numbers!</h2>
          <p className="text-xl text-gray-700 mb-8">Which is bigger? Which is smaller?</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {levels.map((lvl, index) => (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              role="button" tabIndex={0} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); startLevel(lvl.id); } }}
              onClick={() => startLevel(lvl.id)}
              className={`bg-gradient-to-br ${lvl.color} rounded-3xl p-8 cursor-pointer shadow-xl hover:shadow-2xl transition-all`}
            >
              <div className="text-center text-white">
                <div className="text-7xl mb-4">{lvl.emoji}</div>
                <h3 className="text-3xl font-bold mb-2 baloo">{lvl.title}</h3>
                <p className="text-lg opacity-90">
                  {lvl.id === 'less-than-10' && 'Compare numbers 1-10!'}
                  {lvl.id === 'less-than-100' && 'Compare big numbers!'}
                  {lvl.id === 'ordering' && 'Put numbers in order!'}
                  {lvl.id === 'symbols' && 'Use >, <, = symbols!'}
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 sm:p-12 text-center shadow-2xl">
        <div className="text-8xl mb-6">🏆</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Comparison Champion!</h2>
        <p className="text-2xl text-gray-600 mb-6">You compared {questionsAnswered} numbers correctly!</p>
        <p className="text-3xl font-bold text-cyan-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="text-2xl font-bold text-cyan-600">Score: {score}</div>
          <div className="text-2xl font-bold text-blue-600">Compared: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💙' : '🖤'}</span>
          ))}
        </div>
      </div>

      <motion.div key={`${num1}-${num2}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-6 sm:p-12 shadow-2xl">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-gray-800">
            {level === 'symbols' && 'Choose the correct symbol:'}
            {level === 'ordering' && 'Put these numbers in order from smallest to largest:'}
            {(level === 'less-than-10' || level === 'less-than-100') && 'Which number is greater?'}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-32 h-32 bg-blue-500 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <span className="text-6xl font-bold text-white">{num1}</span>
            </motion.div>

            {level === 'symbols' ? (
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="text-7xl"
              >
                ⚖️
              </motion.div>
            ) : level !== 'ordering' ? (
              <div className="text-5xl font-bold text-gray-400">vs</div>
            ) : null}

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="w-32 h-32 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <span className="text-6xl font-bold text-white">{num2}</span>
            </motion.div>
            {level === 'ordering' && <div className="w-32 h-32 bg-purple-500 rounded-2xl flex items-center justify-center shadow-2xl"><span className="text-6xl font-bold text-white">{thirdNumber}</span></div>}
          </div>

          <div className={`grid ${options.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'} gap-4 max-w-3xl mx-auto`}>
            {options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback !== null}
                className={`bg-white border-4 border-cyan-500 hover:bg-cyan-50 text-gray-800 font-bold py-6 px-4 rounded-2xl text-2xl transition-all hover:scale-105 disabled:opacity-50 ${
                  showFeedback === 'correct' && option === correctAnswer ? 'bg-green-200 border-green-600' :
                  showFeedback === 'incorrect' && option === correctAnswer ? 'bg-green-200 border-green-600' : ''
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {showFeedback && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} role="status" aria-live="polite" className={`text-3xl sm:text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
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
