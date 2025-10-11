'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type OddEvenLevel = 'identify' | 'sort' | 'patterns' | 'mixed';

export default function OddEvenNumbers() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<OddEvenLevel | null>(null);
  const [number, setNumber] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'identify' as OddEvenLevel, title: 'Odd or Even?', emoji: '🎲', color: 'from-red-400 to-orange-600' },
    { id: 'sort' as OddEvenLevel, title: 'Sort Numbers', emoji: '🔢', color: 'from-blue-400 to-cyan-600' },
    { id: 'patterns' as OddEvenLevel, title: 'Number Patterns', emoji: '🎯', color: 'from-green-400 to-teal-600' },
    { id: 'mixed' as OddEvenLevel, title: 'Mixed Challenge', emoji: '🌟', color: 'from-purple-400 to-pink-600' },
  ];

  const isOdd = (num: number) => num % 2 !== 0;

  const generateQuestion = (lvl: OddEvenLevel) => {
    const num = Math.floor(Math.random() * 50) + 1; // 1-50
    setNumber(num);

    if (lvl === 'identify' || lvl === 'mixed') {
      setCorrectAnswer(isOdd(num) ? 'Odd' : 'Even');
      setOptions(['Odd', 'Even']);
    } else if (lvl === 'sort') {
      // Generate 3 numbers, ask which doesn't belong
      const isCurrentOdd = isOdd(num);
      const similar1 = isCurrentOdd
        ? (Math.floor(Math.random() * 25) * 2 + 1) // Another odd
        : (Math.floor(Math.random() * 25) * 2); // Another even
      const different = isCurrentOdd
        ? (Math.floor(Math.random() * 25) * 2) // An even
        : (Math.floor(Math.random() * 25) * 2 + 1); // An odd

      setCorrectAnswer(different.toString());
      setOptions([num.toString(), similar1.toString(), different.toString()].sort(() => Math.random() - 0.5));
    } else if (lvl === 'patterns') {
      // Show a pattern and ask what comes next
      const startNum = Math.floor(Math.random() * 10) + 1;
      const isOddPattern = isOdd(startNum);
      const pattern = [startNum, startNum + 2, startNum + 4];
      const nextNum = startNum + 6;

      setNumber(pattern[0]); // Store first number for display
      setCorrectAnswer(nextNum.toString());

      const wrongOptions: string[] = [];
      wrongOptions.push((nextNum + 1).toString());
      wrongOptions.push((nextNum - 1).toString());

      setOptions([nextNum.toString(), ...wrongOptions].sort(() => Math.random() - 0.5));
    }
  };

  const startLevel = (lvl: OddEvenLevel) => {
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

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-orange-600 mb-4 baloo">🎲 Odd & Even Numbers!</h2>
          <p className="text-xl text-gray-700 mb-8">Learn which numbers are odd or even!</p>
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
                  {lvl.id === 'identify' && 'Is this number odd or even?'}
                  {lvl.id === 'sort' && 'Find the number that doesn\'t belong!'}
                  {lvl.id === 'patterns' && 'Continue the pattern!'}
                  {lvl.id === 'mixed' && 'All challenges combined!'}
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
        <div className="text-8xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Number Expert!</h2>
        <p className="text-2xl text-gray-600 mb-6">You identified {questionsAnswered} odd and even numbers!</p>
        <p className="text-3xl font-bold text-orange-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-orange-400 to-red-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-orange-600">Score: {score}</div>
          <div className="text-2xl font-bold text-red-600">Identified: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '🧡' : '🖤'}</span>
          ))}
        </div>
      </div>

      <motion.div key={number} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-12 shadow-2xl">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-gray-800">
            {level === 'identify' && 'Is this number odd or even?'}
            {level === 'sort' && 'Which number doesn\'t belong?'}
            {level === 'patterns' && 'What comes next in the pattern?'}
            {level === 'mixed' && 'Is this number odd or even?'}
          </h3>

          {level === 'patterns' ? (
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                {[number, number + 2, number + 4].map((num, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-4xl font-bold text-orange-600 border-4 border-orange-400 shadow-lg"
                  >
                    {num}
                  </motion.div>
                ))}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-24 h-24 bg-yellow-300 rounded-2xl flex items-center justify-center text-4xl font-bold border-4 border-yellow-500 border-dashed shadow-lg"
                >
                  ?
                </motion.div>
              </div>
              <p className="text-lg text-gray-600">Look at the pattern and find the next number!</p>
            </div>
          ) : (
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl font-bold text-orange-600"
              >
                {number}
              </motion.div>

              {/* Visual representation with dots */}
              <div className="flex justify-center gap-2 flex-wrap max-w-2xl mx-auto mt-8">
                {[...Array(number)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`w-6 h-6 rounded-full ${
                      i % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                  />
                ))}
              </div>

              <p className="text-lg text-gray-600 mt-4">
                {isOdd(number)
                  ? 'Odd numbers have 1 dot left over when paired!'
                  : 'Even numbers pair up perfectly!'}
              </p>
            </div>
          )}

          <div className={`grid ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-4 max-w-2xl mx-auto`}>
            {options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback !== null}
                className={`bg-white border-4 border-orange-500 hover:bg-orange-50 text-gray-800 font-bold py-8 px-6 rounded-2xl text-2xl transition-all hover:scale-105 disabled:opacity-50 ${
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
              {showFeedback === 'correct' ? '✅ Correct!' : `❌ It\'s ${correctAnswer}!`}
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
