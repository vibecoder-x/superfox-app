'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type EstimateLevel = 'rounding-10' | 'rounding-100' | 'guess-quantity' | 'smart-guess';

export default function EstimationStation() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<EstimateLevel | null>(null);
  const [number, setNumber] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [emoji, setEmoji] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'rounding-10' as EstimateLevel, title: 'Round to 10', emoji: '🔟', color: 'from-purple-400 to-indigo-600' },
    { id: 'rounding-100' as EstimateLevel, title: 'Round to 100', emoji: '💯', color: 'from-blue-400 to-cyan-600' },
    { id: 'guess-quantity' as EstimateLevel, title: 'Guess How Many', emoji: '🤔', color: 'from-green-400 to-teal-600' },
    { id: 'smart-guess' as EstimateLevel, title: 'Smart Guessing', emoji: '🎯', color: 'from-orange-400 to-red-600' },
  ];

  const emojis = ['⭐', '🔵', '🟡', '🟢', '🔴', '💎', '🎈'];

  const roundToNearest10 = (num: number) => Math.round(num / 10) * 10;
  const roundToNearest100 = (num: number) => Math.round(num / 100) * 100;

  const generateQuestion = (lvl: EstimateLevel) => {
    if (lvl === 'rounding-10') {
      const num = Math.floor(Math.random() * 95) + 5; // 5-99
      setNumber(num);
      const rounded = roundToNearest10(num);
      setCorrectAnswer(rounded.toString());

      const wrongOptions: string[] = [];
      if (rounded - 10 >= 0) wrongOptions.push((rounded - 10).toString());
      if (rounded + 10 <= 100) wrongOptions.push((rounded + 10).toString());

      setOptions([rounded.toString(), ...wrongOptions].sort(() => Math.random() - 0.5));
    } else if (lvl === 'rounding-100') {
      const num = Math.floor(Math.random() * 950) + 50; // 50-999
      setNumber(num);
      const rounded = roundToNearest100(num);
      setCorrectAnswer(rounded.toString());

      const wrongOptions: string[] = [];
      if (rounded - 100 >= 0) wrongOptions.push((rounded - 100).toString());
      if (rounded + 100 <= 1000) wrongOptions.push((rounded + 100).toString());

      setOptions([rounded.toString(), ...wrongOptions].sort(() => Math.random() - 0.5));
    } else if (lvl === 'guess-quantity') {
      const qty = Math.floor(Math.random() * 20) + 10; // 10-29
      setQuantity(qty);
      setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      const rounded = roundToNearest10(qty);
      setCorrectAnswer(rounded.toString());

      const wrongOptions: string[] = [];
      if (rounded - 10 >= 0) wrongOptions.push((rounded - 10).toString());
      if (rounded + 10 <= 100) wrongOptions.push((rounded + 10).toString());

      setOptions([rounded.toString(), ...wrongOptions].sort(() => Math.random() - 0.5));
    } else {
      // Smart guessing - estimate sums
      const a = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * 40) + 10;
      const sum = a + b;
      setNumber(sum);
      const rounded = roundToNearest10(sum);
      setCorrectAnswer(rounded.toString());

      const wrongOptions: string[] = [];
      if (rounded - 10 >= 0) wrongOptions.push((rounded - 10).toString());
      if (rounded + 10 <= 200) wrongOptions.push((rounded + 10).toString());

      setOptions([rounded.toString(), ...wrongOptions].sort(() => Math.random() - 0.5));
    }
  };

  const startLevel = (lvl: EstimateLevel) => {
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
          <h2 className="text-5xl font-bold text-indigo-600 mb-4 baloo">🤔 Estimation Station!</h2>
          <p className="text-xl text-gray-700 mb-8">Guess and estimate like a pro!</p>
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
                  {lvl.id === 'rounding-10' && 'Round to nearest 10!'}
                  {lvl.id === 'rounding-100' && 'Round to nearest 100!'}
                  {lvl.id === 'guess-quantity' && 'Estimate how many!'}
                  {lvl.id === 'smart-guess' && 'Estimate sums quickly!'}
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
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Estimation Expert!</h2>
        <p className="text-2xl text-gray-600 mb-6">You made {questionsAnswered} great estimates!</p>
        <p className="text-3xl font-bold text-indigo-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
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
          <div className="text-2xl font-bold text-purple-600">Estimated: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💜' : '🖤'}</span>
          ))}
        </div>
      </div>

      <motion.div key={number} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-12 shadow-2xl">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-gray-800">
            {level === 'guess-quantity' && 'Estimate how many you see!'}
            {level === 'rounding-10' && `Round ${number} to the nearest 10`}
            {level === 'rounding-100' && `Round ${number} to the nearest 100`}
            {level === 'smart-guess' && 'Make a quick estimate!'}
          </h3>

          {level === 'guess-quantity' ? (
            <div>
              <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                {[...Array(quantity)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="text-4xl"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
              <p className="text-lg text-gray-600 mt-6">Don\'t count them all! Make a smart guess!</p>
            </div>
          ) : (
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl font-bold text-indigo-700"
              >
                {number}
              </motion.div>
              <div className="mt-6 bg-white rounded-2xl p-6 inline-block shadow-lg">
                <p className="text-lg text-gray-600">
                  {level === 'rounding-10' && 'Tip: Look at the ones place!'}
                  {level === 'rounding-100' && 'Tip: Look at the tens place!'}
                  {level === 'smart-guess' && 'Tip: Round both numbers first!'}
                </p>
              </div>
            </div>
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
                className={`bg-white border-4 border-indigo-500 hover:bg-indigo-50 text-gray-800 font-bold py-8 px-6 rounded-2xl text-3xl transition-all hover:scale-105 disabled:opacity-50 ${
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
              {showFeedback === 'correct' ? '✅ Great Estimate!' : `❌ It\'s ${correctAnswer}!`}
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
