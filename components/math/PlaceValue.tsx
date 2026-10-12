'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { placeValueAnswer, numericOptions } from '@/lib/math-questions';
import { useActivityTimer } from '@/hooks/useActivityTimer';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type PlaceLevel = 'ones' | 'tens' | 'hundreds' | 'expanded-form';

export default function PlaceValue() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<PlaceLevel | null>(null);
  const { schedule } = useActivityTimer(level);
  const [number, setNumber] = useState(0);
  const [ones, setOnes] = useState(0);
  const [tens, setTens] = useState(0);
  const [hundreds, setHundreds] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'ones' as PlaceLevel, title: 'Ones Place', emoji: '1️⃣', color: 'from-blue-400 to-cyan-600' },
    { id: 'tens' as PlaceLevel, title: 'Tens Place', emoji: '🔟', color: 'from-green-400 to-teal-600' },
    { id: 'hundreds' as PlaceLevel, title: 'Hundreds Place', emoji: '💯', color: 'from-purple-400 to-pink-600' },
    { id: 'expanded-form' as PlaceLevel, title: 'Expanded Form', emoji: '🎯', color: 'from-orange-400 to-red-600' },
  ];

  const generateQuestion = (lvl: PlaceLevel) => {
    let num: number;
    let o: number, t: number, h: number;

    if (lvl === 'ones') {
      num = Math.floor(Math.random() * 100); // 0-99
      o = num % 10;
      t = Math.floor(num / 10);
      h = 0;
      setCorrectAnswer(o.toString());
      setQuestionType(`What is in the ones place?`);
    } else if (lvl === 'tens') {
      num = Math.floor(Math.random() * 100); // 0-99
      o = num % 10;
      t = Math.floor(num / 10);
      h = 0;
      setCorrectAnswer(t.toString());
      setQuestionType(`What is in the tens place?`);
    } else if (lvl === 'hundreds') {
      num = Math.floor(Math.random() * 900) + 100; // 100-999
      o = num % 10;
      t = Math.floor((num % 100) / 10);
      h = Math.floor(num / 100);
      setCorrectAnswer(h.toString());
      setQuestionType(`What is in the hundreds place?`);
    } else {
      // Expanded form
      num = Math.floor(Math.random() * 900) + 100; // 100-999
      o = num % 10;
      t = Math.floor((num % 100) / 10);
      h = Math.floor(num / 100);
      setCorrectAnswer(`${h * 100} + ${t * 10} + ${o}`);
      setQuestionType(`Write in expanded form:`);
    }

    setNumber(num);
    setOnes(o);
    setTens(t);
    setHundreds(h);

    const answer = placeValueAnswer(num, lvl);
    if (lvl === 'expanded-form') {
      setOptions([answer, placeValueAnswer(num + 100, lvl), placeValueAnswer(num + 10, lvl)].sort(() => Math.random() - 0.5));
    } else {
      setOptions(numericOptions(Number(answer), 3).map(String));
    }
  };

  const startLevel = (lvl: PlaceLevel) => {
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
      setScore(score + 20);
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
          <h2 className="text-5xl font-bold text-pink-600 mb-4 baloo">🔟 Place Value!</h2>
          <p className="text-xl text-gray-700 mb-8">Learn about ones, tens, and hundreds!</p>
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
                  {lvl.id === 'ones' && 'Find the ones digit!'}
                  {lvl.id === 'tens' && 'Find the tens digit!'}
                  {lvl.id === 'hundreds' && 'Find the hundreds digit!'}
                  {lvl.id === 'expanded-form' && 'Break numbers apart!'}
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
        <div className="text-8xl mb-6">🎊</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Place Value Pro!</h2>
        <p className="text-2xl text-gray-600 mb-6">You solved {questionsAnswered} place value problems!</p>
        <p className="text-3xl font-bold text-pink-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-pink-400 to-rose-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="text-2xl font-bold text-pink-600">Score: {score}</div>
          <div className="text-2xl font-bold text-rose-600">Solved: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💗' : '🖤'}</span>
          ))}
        </div>
      </div>

      <motion.div key={number} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-6 sm:p-12 shadow-2xl">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-gray-800">{questionType}</h3>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-9xl font-bold text-pink-700"
          >
            {number}
          </motion.div>

          {/* Visual representation with blocks */}
          <div className="flex justify-center gap-8 flex-wrap">
            {hundreds > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-bold text-gray-600">Hundreds</div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(hundreds)].map((_, i) => (
                    <motion.div
                      key={`h${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-20 h-20 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                    >
                      100
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {tens > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-bold text-gray-600">Tens</div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(tens)].map((_, i) => (
                    <motion.div
                      key={`t${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                    >
                      10
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {ones > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-bold text-gray-600">Ones</div>
                <div className="flex gap-2 flex-wrap max-w-xs">
                  {[...Array(ones)].map((_, i) => (
                    <motion.div
                      key={`o${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
                    >
                      1
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback !== null}
                className={`bg-white border-4 border-pink-500 hover:bg-pink-50 text-gray-800 font-bold py-6 px-4 rounded-2xl text-xl transition-all hover:scale-105 disabled:opacity-50 ${
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
