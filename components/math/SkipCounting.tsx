'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type SkipLevel = 'skip-2' | 'skip-5' | 'skip-10' | 'mixed';

export default function SkipCounting() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<SkipLevel | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [missingIndex, setMissingIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<number>(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'skip-2' as SkipLevel, title: 'Skip Count by 2', emoji: '🐰', skip: 2, color: 'from-green-400 to-emerald-600', maxStart: 20 },
    { id: 'skip-5' as SkipLevel, title: 'Skip Count by 5', emoji: '🐸', skip: 5, color: 'from-blue-400 to-cyan-600', maxStart: 50 },
    { id: 'skip-10' as SkipLevel, title: 'Skip Count by 10', emoji: '🦘', skip: 10, color: 'from-purple-400 to-pink-600', maxStart: 90 },
    { id: 'mixed' as SkipLevel, title: 'Mixed Skip Count', emoji: '🎲', skip: 0, color: 'from-orange-400 to-red-600', maxStart: 50 },
  ];

  const generateSequence = (skipBy: number, maxStart: number) => {
    const startNum = Math.floor(Math.random() * (maxStart / skipBy)) * skipBy;
    const sequenceLength = 6;
    const newSequence: number[] = [];

    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(startNum + (i * skipBy));
    }

    // Pick a random position (not first or last) to be the missing number
    const missingPos = Math.floor(Math.random() * (sequenceLength - 2)) + 1;
    const correctAnswer = newSequence[missingPos];

    setSequence(newSequence);
    setMissingIndex(missingPos);
    setAnswer(correctAnswer);
  };

  const startLevel = (lvl: SkipLevel) => {
    setLevel(lvl);
    let selectedLevel;

    if (lvl === 'mixed') {
      const skips = [2, 5, 10];
      const randomSkip = skips[Math.floor(Math.random() * skips.length)];
      const maxStarts = { 2: 20, 5: 50, 10: 90 };
      generateSequence(randomSkip, maxStarts[randomSkip as keyof typeof maxStarts]);
    } else {
      selectedLevel = levels.find(l => l.id === lvl);
      if (selectedLevel) {
        generateSequence(selectedLevel.skip, selectedLevel.maxStart);
      }
    }

    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setUserInput('');
    setShowFeedback(null);
  };

  const handleSubmit = () => {
    if (userInput === '') return;

    const isCorrect = parseInt(userInput) === answer;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 15);
      setQuestionsAnswered(questionsAnswered + 1);

      setTimeout(() => {
        if (level) {
          if (level === 'mixed') {
            const skips = [2, 5, 10];
            const randomSkip = skips[Math.floor(Math.random() * skips.length)];
            const maxStarts = { 2: 20, 5: 50, 10: 90 };
            generateSequence(randomSkip, maxStarts[randomSkip as keyof typeof maxStarts]);
          } else {
            const selectedLevel = levels.find(l => l.id === level);
            if (selectedLevel) {
              generateSequence(selectedLevel.skip, selectedLevel.maxStart);
            }
          }
        }
        setUserInput('');
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
          setUserInput('');
          setShowFeedback(null);
        }, 1500);
      }
    }
  };

  const getSkipAmount = () => {
    if (sequence.length < 2) return 0;
    return sequence[1] - sequence[0];
  };

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-emerald-600 mb-4 baloo">🐰 Skip Counting!</h2>
          <p className="text-xl text-gray-700 mb-8">Hop along and find the missing numbers!</p>
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
                  {lvl.skip > 0 ? `Hop by ${lvl.skip}s` : 'Mix of 2s, 5s, and 10s'}
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
        <div className="text-8xl mb-6">🏆</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Fantastic Hopping!</h2>
        <p className="text-2xl text-gray-600 mb-6">You completed {questionsAnswered} skip counting patterns!</p>
        <p className="text-3xl font-bold text-emerald-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-emerald-400 to-green-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  const skipAmount = getSkipAmount();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-emerald-600">Score: {score}</div>
          <div className="text-2xl font-bold text-green-600">Patterns: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💚' : '🖤'}</span>
          ))}
        </div>
      </div>

      {sequence.length > 0 && (
        <motion.div key={`${sequence[0]}-${skipAmount}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">Find the Missing Number!</h3>
            <p className="text-xl text-gray-600">Skip counting by {skipAmount}s</p>

            {/* Hopping animation */}
            <div className="flex justify-center gap-4 mb-8">
              {sequence.map((num, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 0 }}
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className={`w-20 h-20 ${index === missingIndex ? 'bg-yellow-400' : 'bg-white'} rounded-2xl flex items-center justify-center shadow-lg border-4 ${index === missingIndex ? 'border-yellow-600 border-dashed' : 'border-emerald-500'}`}>
                    {index === missingIndex ? (
                      <span className="text-4xl">❓</span>
                    ) : (
                      <span className="text-3xl font-bold text-emerald-700">{num}</span>
                    )}
                  </div>
                  {index < sequence.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-2xl">→</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Visual representation with hops */}
            <div className="space-y-4">
              <p className="text-lg text-gray-600">Watch the pattern hop!</p>
              <div className="flex justify-center gap-2 flex-wrap max-w-3xl mx-auto">
                {sequence.map((num, index) => (
                  <motion.div
                    key={`hop-${index}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="text-4xl"
                  >
                    {index === missingIndex ? '❓' : levels.find(l => l.id === level)?.emoji || '🐸'}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xl font-bold text-gray-700">What number is missing?</p>
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-48 text-5xl text-center font-bold border-4 border-emerald-500 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                placeholder="?"
                autoFocus
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={userInput === ''}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              Check Answer! ✓
            </button>

            {showFeedback && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                {showFeedback === 'correct' ? '✅ Perfect Hop!' : '❌ Try hopping again!'}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <button onClick={() => setLevel(null)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-all">
        ← Back to Levels
      </button>
    </div>
  );
}
