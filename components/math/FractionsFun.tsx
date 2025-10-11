'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type FractionLevel = 'halves' | 'quarters' | 'thirds' | 'mixed';

interface Fraction {
  numerator: number;
  denominator: number;
  name: string;
}

export default function FractionsFun() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<FractionLevel | null>(null);
  const [currentFraction, setCurrentFraction] = useState<Fraction | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'halves' as FractionLevel, title: 'Halves (1/2)', emoji: '🍕', color: 'from-yellow-400 to-orange-600' },
    { id: 'quarters' as FractionLevel, title: 'Quarters (1/4)', emoji: '🍰', color: 'from-pink-400 to-rose-600' },
    { id: 'thirds' as FractionLevel, title: 'Thirds (1/3)', emoji: '🎂', color: 'from-purple-400 to-indigo-600' },
    { id: 'mixed' as FractionLevel, title: 'Mixed Fractions', emoji: '🧁', color: 'from-orange-400 to-red-600' },
  ];

  const fractions: Fraction[] = [
    { numerator: 1, denominator: 2, name: 'One Half' },
    { numerator: 1, denominator: 4, name: 'One Quarter' },
    { numerator: 1, denominator: 3, name: 'One Third' },
    { numerator: 2, denominator: 4, name: 'Two Quarters' },
    { numerator: 2, denominator: 3, name: 'Two Thirds' },
    { numerator: 3, denominator: 4, name: 'Three Quarters' },
  ];

  const generateQuestion = (lvl: FractionLevel) => {
    let selectedFraction: Fraction;

    if (lvl === 'halves') {
      selectedFraction = { numerator: 1, denominator: 2, name: 'One Half' };
    } else if (lvl === 'quarters') {
      const quarterFractions = fractions.filter(f => f.denominator === 4);
      selectedFraction = quarterFractions[Math.floor(Math.random() * quarterFractions.length)];
    } else if (lvl === 'thirds') {
      const thirdFractions = fractions.filter(f => f.denominator === 3);
      selectedFraction = thirdFractions[Math.floor(Math.random() * thirdFractions.length)];
    } else {
      selectedFraction = fractions[Math.floor(Math.random() * fractions.length)];
    }

    setCurrentFraction(selectedFraction);
    setCorrectAnswer(selectedFraction.name);

    // Create options
    const wrongOptions = fractions
      .filter(f => f.name !== selectedFraction.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(f => f.name);

    const allOptions = [selectedFraction.name, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const startLevel = (lvl: FractionLevel) => {
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

  const renderPizza = (fraction: Fraction) => {
    const slices = [];
    const filledSlices = fraction.numerator;
    const totalSlices = fraction.denominator;

    for (let i = 0; i < totalSlices; i++) {
      const angle = (360 / totalSlices) * i;
      const isFilled = i < filledSlices;

      slices.push(
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="absolute w-full h-full"
          style={{
            transform: `rotate(${angle}deg)`,
          }}
        >
          <div
            className={`absolute top-0 left-1/2 w-0 h-0 border-l-[100px] border-r-[100px] border-t-[100px] border-l-transparent border-r-transparent ${
              isFilled ? 'border-t-orange-500' : 'border-t-gray-300'
            }`}
            style={{
              transform: `translateX(-50%) rotate(${-180 / totalSlices}deg)`,
              transformOrigin: 'bottom center',
              clipPath: `polygon(50% 0%, 0% 100%, 100% 100%)`,
            }}
          />
        </motion.div>
      );
    }

    return slices;
  };

  const renderRectangleBars = (fraction: Fraction) => {
    const bars = [];
    for (let i = 0; i < fraction.denominator; i++) {
      bars.push(
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`h-16 rounded-lg border-4 border-white ${
            i < fraction.numerator ? 'bg-purple-500' : 'bg-gray-300'
          }`}
        />
      );
    }
    return bars;
  };

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-orange-600 mb-4 baloo">🍕 Fractions Fun!</h2>
          <p className="text-xl text-gray-700 mb-8">Learn to share equally and understand parts!</p>
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
                  {lvl.id === 'halves' && 'Cut things in half!'}
                  {lvl.id === 'quarters' && 'Divide into 4 parts!'}
                  {lvl.id === 'thirds' && 'Split into 3 pieces!'}
                  {lvl.id === 'mixed' && 'All fraction types!'}
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
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Fraction Master!</h2>
        <p className="text-2xl text-gray-600 mb-6">You identified {questionsAnswered} fractions correctly!</p>
        <p className="text-3xl font-bold text-orange-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-orange-400 to-yellow-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
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
          <div className="text-2xl font-bold text-yellow-600">Fractions: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '🧡' : '🖤'}</span>
          ))}
        </div>
      </div>

      {currentFraction && (
        <motion.div key={`${currentFraction.numerator}-${currentFraction.denominator}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">What fraction is shown?</h3>

            <div className="flex justify-center items-center gap-12">
              {/* Pizza visualization for halves and quarters */}
              {currentFraction.denominator <= 4 && (
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-yellow-200 rounded-full border-8 border-orange-600"></div>
                  <div className="relative w-full h-full">
                    {renderPizza(currentFraction)}
                  </div>
                </div>
              )}

              {/* Bar visualization for thirds */}
              {currentFraction.denominator === 3 && (
                <div className="grid grid-cols-3 gap-2 w-96">
                  {renderRectangleBars(currentFraction)}
                </div>
              )}
            </div>

            <div className="text-6xl font-bold text-orange-700">
              {currentFraction.numerator}/{currentFraction.denominator}
            </div>

            <p className="text-xl text-gray-600">
              {currentFraction.numerator} out of {currentFraction.denominator} {currentFraction.denominator === 2 ? 'half' : currentFraction.denominator === 3 ? 'third' : 'quarter'}{currentFraction.denominator > 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback !== null}
                  className={`bg-white border-4 border-orange-500 hover:bg-orange-50 text-gray-800 font-bold py-6 px-6 rounded-2xl text-xl transition-all hover:scale-105 disabled:opacity-50 ${
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
      )}

      <button onClick={() => setLevel(null)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-all">
        ← Back to Levels
      </button>
    </div>
  );
}
