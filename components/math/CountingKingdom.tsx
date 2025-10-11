'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type CountingLevel = 'count-to-10' | 'count-to-20' | 'count-to-50' | 'count-to-100';

export default function CountingKingdom() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<CountingLevel | null>(null);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);
  const [showObjects, setShowObjects] = useState(true);

  const levels = [
    { id: 'count-to-10' as CountingLevel, title: 'Count to 10', emoji: '🔢', maxNum: 10, color: 'from-blue-400 to-indigo-600' },
    { id: 'count-to-20' as CountingLevel, title: 'Count to 20', emoji: '🎯', maxNum: 20, color: 'from-green-400 to-teal-600' },
    { id: 'count-to-50' as CountingLevel, title: 'Count to 50', emoji: '🌟', maxNum: 50, color: 'from-purple-400 to-pink-600' },
    { id: 'count-to-100' as CountingLevel, title: 'Count to 100', emoji: '👑', maxNum: 100, color: 'from-orange-400 to-red-600' },
  ];

  const generateQuestion = (maxNum: number) => {
    const num = Math.floor(Math.random() * maxNum) + 1;
    setTargetNumber(num);
    setCurrentCount(0);
    setShowObjects(num <= 20); // Only show visual objects for smaller numbers
  };

  const startLevel = (lvl: CountingLevel) => {
    setLevel(lvl);
    const selectedLevel = levels.find(l => l.id === lvl);
    if (selectedLevel) {
      generateQuestion(selectedLevel.maxNum);
    }
    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setUserInput('');
    setShowFeedback(null);
  };

  const handleSubmit = () => {
    if (userInput === '') return;

    const isCorrect = parseInt(userInput) === targetNumber;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 10);
      setQuestionsAnswered(questionsAnswered + 1);

      setTimeout(() => {
        if (level) {
          const selectedLevel = levels.find(l => l.id === level);
          if (selectedLevel) {
            generateQuestion(selectedLevel.maxNum);
          }
        }
        setUserInput('');
        setShowFeedback(null);
        setCurrentCount(0);
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
          setUserInput('');
          setShowFeedback(null);
        }, 1500);
      }
    }
  };

  const getObjectEmoji = (index: number) => {
    const emojis = ['🌟', '⭐', '💎', '🎈', '🎁', '🎨', '🎪', '🎭', '🎯', '🎲'];
    return emojis[index % emojis.length];
  };

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-indigo-600 mb-4 baloo">🔢 Counting Kingdom!</h2>
          <p className="text-xl text-gray-700 mb-8">Count objects and master your numbers!</p>
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
                <p className="text-lg opacity-90">Count from 1 to {lvl.maxNum}</p>
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
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Amazing Work!</h2>
        <p className="text-2xl text-gray-600 mb-6">You counted {questionsAnswered} sets of objects!</p>
        <p className="text-3xl font-bold text-indigo-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-indigo-400 to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-indigo-600">Score: {score}</div>
          <div className="text-2xl font-bold text-blue-600">Counted: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💙' : '🖤'}</span>
          ))}
        </div>
      </div>

      <motion.div key={targetNumber} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl p-12 shadow-2xl">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-gray-800">Count the Objects!</h3>

          {showObjects ? (
            <div className="space-y-6">
              <motion.div
                className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto min-h-[200px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence>
                  {[...Array(targetNumber)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-4xl"
                    >
                      {getObjectEmoji(i)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              <p className="text-lg text-gray-600">Count all the objects above!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                  className="text-8xl"
                >
                  🎯
                </motion.div>
              </div>
              <p className="text-2xl font-bold text-indigo-600">What number comes next?</p>
              <div className="flex justify-center gap-3 text-4xl font-bold text-gray-700">
                {targetNumber > 5 && (
                  <>
                    <span>{targetNumber - 3}</span>
                    <span>,</span>
                    <span>{targetNumber - 2}</span>
                    <span>,</span>
                    <span>{targetNumber - 1}</span>
                    <span>,</span>
                    <span className="text-indigo-600">?</span>
                  </>
                )}
              </div>
              <p className="text-lg text-gray-600">Continue the counting sequence!</p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-xl font-bold text-gray-700">How many do you count?</p>
            <input
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-48 text-5xl text-center font-bold border-4 border-indigo-500 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              placeholder="?"
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={userInput === ''}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:scale-105 transition-transform disabled:opacity-50"
          >
            Check Count! ✓
          </button>

          {showFeedback && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {showFeedback === 'correct' ? '✅ Great Counting!' : '❌ Count again!'}
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
