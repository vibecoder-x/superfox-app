'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type DivisionLevel = 'div-2' | 'div-5' | 'div-10' | 'mixed';

export default function DivisionMaster() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<DivisionLevel | null>(null);
  const [question, setQuestion] = useState<{divisor: number; dividend: number; answer: number} | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'div-2' as DivisionLevel, title: 'Divide by 2', emoji: '✌️', divisor: 2, color: 'from-violet-400 to-purple-600' },
    { id: 'div-5' as DivisionLevel, title: 'Divide by 5', emoji: '✋', divisor: 5, color: 'from-fuchsia-400 to-pink-600' },
    { id: 'div-10' as DivisionLevel, title: 'Divide by 10', emoji: '🔟', divisor: 10, color: 'from-purple-400 to-indigo-600' },
    { id: 'mixed' as DivisionLevel, title: 'Division Facts', emoji: '🎲', divisor: 0, color: 'from-pink-400 to-rose-600' },
  ];

  const generateQuestion = (lvl: DivisionLevel) => {
    const selectedLevel = levels.find(l => l.id === lvl);
    let divisor: number;

    if (lvl === 'mixed') {
      const divisors = [2, 5, 10];
      divisor = divisors[Math.floor(Math.random() * divisors.length)];
    } else {
      divisor = selectedLevel!.divisor;
    }

    const answer = Math.floor(Math.random() * 10) + 1;
    const dividend = divisor * answer;

    setQuestion({ divisor, dividend, answer });
  };

  const startLevel = (lvl: DivisionLevel) => {
    setLevel(lvl);
    generateQuestion(lvl);
    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setUserAnswer('');
    setShowFeedback(null);
  };

  const handleSubmit = () => {
    if (!question || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === question.answer;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 15);
      setQuestionsAnswered(questionsAnswered + 1);

      setTimeout(() => {
        if (level) generateQuestion(level);
        setUserAnswer('');
        setShowFeedback(null);
      }, 1500);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      setLives(lives - 1);

      if (lives - 1 <= 0) {
        setTimeout(() => {
          setLevel(null);
          setQuestion(null);
        }, 1500);
      } else {
        setTimeout(() => {
          setUserAnswer('');
          setShowFeedback(null);
        }, 1500);
      }
    }
  };

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-purple-600 mb-4 baloo">➗ Division Master!</h2>
          <p className="text-xl text-gray-700 mb-8">Share and divide numbers equally!</p>
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
                <p className="text-lg opacity-90">{lvl.divisor > 0 ? `Divide by ${lvl.divisor}` : 'Mix of all'}</p>
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
        <div className="text-8xl mb-6">🌟</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Excellent Work!</h2>
        <p className="text-2xl text-gray-600 mb-6">You solved {questionsAnswered} division problems!</p>
        <p className="text-3xl font-bold text-purple-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-purple-400 to-fuchsia-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-purple-600">Score: {score}</div>
          <div className="text-2xl font-bold text-fuchsia-600">Solved: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💜' : '🖤'}</span>
          ))}
        </div>
      </div>

      {question && (
        <motion.div key={`${question.dividend}-${question.divisor}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-purple-100 to-fuchsia-100 rounded-3xl p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">Divide Equally!</h3>

            <div className="flex items-center justify-center gap-8 text-6xl font-bold text-purple-600">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}>{question.dividend}</motion.div>
              <div className="text-5xl">➗</div>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2, delay: 0.3 }}>{question.divisor}</motion.div>
              <div className="text-5xl">=</div>
              <div className="text-5xl">?</div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-gray-600">Share {question.dividend} items into {question.divisor} equal groups</p>
              <div className="flex flex-wrap justify-center gap-4">
                {[...Array(question.divisor)].map((_, groupIndex) => (
                  <div key={groupIndex} className="bg-white rounded-xl p-4 shadow-md">
                    <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                      {[...Array(question.answer)].map((_, itemIndex) => (
                        <div key={itemIndex} className="w-6 h-6 bg-purple-500 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <input type="number" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} className="w-48 text-5xl text-center font-bold border-4 border-purple-500 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-purple-300" placeholder="?" autoFocus />

            <button onClick={handleSubmit} disabled={userAnswer === ''} className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:scale-105 transition-transform disabled:opacity-50">
              Check Answer! ✓
            </button>

            {showFeedback && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                {showFeedback === 'correct' ? '✅ Perfect!' : '❌ Try again!'}
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
