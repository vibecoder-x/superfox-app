'use client';

import { isExactWholeNumberAnswer } from '@/lib/math-activities';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useActivityTimer } from '@/hooks/useActivityTimer';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type MoneyLevel = 'coins' | 'dollars' | 'counting-money' | 'making-change';

interface Coin {
  name: string;
  value: number;
  emoji: string;
}

export default function MoneyMath() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<MoneyLevel | null>(null);
  const { schedule } = useActivityTimer(level);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const answerInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!showFeedback) answerInput.current?.focus();
  }, [showFeedback]);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'coins' as MoneyLevel, title: 'Know Your Coins', emoji: '🪙', color: 'from-yellow-400 to-amber-600' },
    { id: 'dollars' as MoneyLevel, title: 'Dollar Bills', emoji: '💵', color: 'from-green-400 to-emerald-600' },
    { id: 'counting-money' as MoneyLevel, title: 'Count Money', emoji: '💰', color: 'from-blue-400 to-cyan-600' },
    { id: 'making-change' as MoneyLevel, title: 'Make Change', emoji: '🏪', color: 'from-purple-400 to-pink-600' },
  ];

  const coinTypes: Coin[] = [
    { name: 'Penny', value: 1, emoji: '🟤' },
    { name: 'Nickel', value: 5, emoji: '⚪' },
    { name: 'Dime', value: 10, emoji: '⚫' },
    { name: 'Quarter', value: 25, emoji: '🔵' },
  ];

  const dollarBills = [
    { name: 'One Dollar', value: 100, emoji: '💵' },
    { name: 'Five Dollars', value: 500, emoji: '💵💵' },
    { name: 'Ten Dollars', value: 1000, emoji: '💵💵💵' },
  ];

  const generateCoinsQuestion = () => {
    const selectedCoin = coinTypes[Math.floor(Math.random() * coinTypes.length)];
    setCoins([selectedCoin]);
    setTotalValue(selectedCoin.value);
  };

  const generateCountingQuestion = () => {
    const numCoins = Math.floor(Math.random() * 5) + 2; // 2-6 coins
    const selectedCoins: Coin[] = [];
    let total = 0;

    for (let i = 0; i < numCoins; i++) {
      const coin = coinTypes[Math.floor(Math.random() * coinTypes.length)];
      selectedCoins.push(coin);
      total += coin.value;
    }

    setCoins(selectedCoins);
    setTotalValue(total);
  };

  const generateDollarsQuestion = () => {
    const selectedBill = dollarBills[Math.floor(Math.random() * dollarBills.length)];
    setCoins([{ name: selectedBill.name, value: selectedBill.value, emoji: selectedBill.emoji }]);
    setTotalValue(selectedBill.value);
  };

  const generateChangeQuestion = () => {
    const itemCost = (Math.floor(Math.random() * 16) + 5) * 5; // $0.25 to $1.00 in 5¢ increments
    const amountPaid = 100; // Always pay with $1
    const change = amountPaid - itemCost;
    setTotalValue(change);
    setCoins([{ name: `Item costs ${itemCost}¢, paid $1`, value: change, emoji: '🛒' }]);
  };

  const generateQuestion = (lvl: MoneyLevel) => {
    if (lvl === 'coins') {
      generateCoinsQuestion();
    } else if (lvl === 'counting-money') {
      generateCountingQuestion();
    } else if (lvl === 'dollars') {
      generateDollarsQuestion();
    } else if (lvl === 'making-change') {
      generateChangeQuestion();
    }
  };

  const startLevel = (lvl: MoneyLevel) => {
    setLevel(lvl);
    generateQuestion(lvl);
    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setUserAnswer('');
    setShowFeedback(null);
  };

  const handleSubmit = () => {
    if (userAnswer === '' || showFeedback) return;

    const isCorrect = isExactWholeNumberAnswer(userAnswer, totalValue);
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 20);
      setQuestionsAnswered(questionsAnswered + 1);

      schedule(() => {
        if (level) generateQuestion(level);
        setUserAnswer('');
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
          <h2 className="text-5xl font-bold text-green-600 mb-4 baloo">💰 Money Math!</h2>
          <p className="text-xl text-gray-700 mb-8">Learn to count coins and dollars!</p>
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
                  {lvl.id === 'coins' && 'Penny, Nickel, Dime, Quarter!'}
                  {lvl.id === 'dollars' && 'Learn about dollar bills!'}
                  {lvl.id === 'counting-money' && 'Add up the coins!'}
                  {lvl.id === 'making-change' && 'How much change?'}
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
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Money Master!</h2>
        <p className="text-2xl text-gray-600 mb-6">You counted {questionsAnswered} money problems correctly!</p>
        <p className="text-3xl font-bold text-green-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="text-2xl font-bold text-green-600">Score: {score}</div>
          <div className="text-2xl font-bold text-emerald-600">Counted: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💚' : '🖤'}</span>
          ))}
        </div>
      </div>

      {coins.length > 0 && (
        <motion.div key={totalValue} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-6 sm:p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">
              {level === 'coins' && 'How much is this coin worth?'}
              {level === 'counting-money' && 'How much money is shown?'}
              {level === 'dollars' && 'How much is this bill worth?'}
              {level === 'making-change' && 'How much change do you get?'}
            </h3>

            {level === 'making-change' && coins[0].name.includes('Item') && (
              <div className="space-y-4">
                <div className="text-8xl">🛒</div>
                <p className="text-2xl text-gray-700">{coins[0].name}</p>
                <p className="text-xl text-gray-600">What is your change?</p>
              </div>
            )}

            {level !== 'making-change' && (
              <div className="flex flex-wrap justify-center gap-6">
                {coins.map((coin, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-xl border-4 border-yellow-600"
                    >
                      <div className="text-4xl">{coin.emoji}</div>
                    </motion.div>
                    <div className="text-center mt-2 font-bold text-gray-700">{coin.name}</div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-xl font-bold text-gray-700">
                {level === 'dollars' ? 'Value in cents?' : 'Total value in cents?'}
              </p>
              <input
                ref={answerInput} type="number" aria-label="Your answer" disabled={showFeedback !== null}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-48 text-5xl text-center font-bold border-4 border-green-500 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-green-300"
                placeholder="?"
                autoFocus
              />
              <p className="text-lg text-gray-500">¢ (cents)</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={userAnswer === '' || showFeedback !== null}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              Check Answer! ✓
            </button>

            {showFeedback && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} role="status" aria-live="polite" className={`text-3xl sm:text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                {showFeedback === 'correct' ? '✅ Correct!' : `❌ It\'s ${totalValue}¢!`}
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
