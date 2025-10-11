'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type PatternLevel = 'color-patterns' | 'number-patterns' | 'shape-patterns' | 'mixed';

export default function PatternsSequences() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<PatternLevel | null>(null);
  const [pattern, setPattern] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'color-patterns' as PatternLevel, title: 'Color Patterns', emoji: '🌈', color: 'from-pink-400 to-purple-600' },
    { id: 'number-patterns' as PatternLevel, title: 'Number Patterns', emoji: '🔢', color: 'from-blue-400 to-cyan-600' },
    { id: 'shape-patterns' as PatternLevel, title: 'Shape Patterns', emoji: '🔷', color: 'from-green-400 to-teal-600' },
    { id: 'mixed' as PatternLevel, title: 'Mixed Patterns', emoji: '🎨', color: 'from-orange-400 to-red-600' },
  ];

  const colorEmojis = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'];
  const shapeEmojis = ['⭐', '🔷', '🔶', '⬛', '🔺', '⬜'];
  const numberPatterns = [
    { pattern: [2, 4, 6], next: 8 },
    { pattern: [1, 3, 5], next: 7 },
    { pattern: [5, 10, 15], next: 20 },
    { pattern: [10, 20, 30], next: 40 },
    { pattern: [3, 6, 9], next: 12 },
  ];

  const generateColorPattern = () => {
    const selectedColors = colorEmojis.sort(() => Math.random() - 0.5).slice(0, 3);
    const patternType = Math.random() > 0.5 ? 'AB' : 'ABC';

    let newPattern: string[] = [];
    if (patternType === 'AB') {
      newPattern = [
        selectedColors[0],
        selectedColors[1],
        selectedColors[0],
        selectedColors[1],
        selectedColors[0],
      ];
      setCorrectAnswer(selectedColors[1]);
    } else {
      newPattern = [
        selectedColors[0],
        selectedColors[1],
        selectedColors[2],
        selectedColors[0],
        selectedColors[1],
      ];
      setCorrectAnswer(selectedColors[2]);
    }

    setPattern(newPattern);
    const wrongOptions = colorEmojis.filter(c => c !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 2);
    setOptions([correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5));
  };

  const generateNumberPattern = () => {
    const selectedPattern = numberPatterns[Math.floor(Math.random() * numberPatterns.length)];
    const patternLength = Math.floor(Math.random() * 2) + 4; // 4 or 5 numbers

    const fullPattern: string[] = [];
    for (let i = 0; i < patternLength; i++) {
      fullPattern.push((selectedPattern.pattern[0] + (selectedPattern.pattern[1] - selectedPattern.pattern[0]) * i).toString());
    }

    setPattern(fullPattern);
    const answer = (parseInt(fullPattern[fullPattern.length - 1]) + (selectedPattern.pattern[1] - selectedPattern.pattern[0])).toString();
    setCorrectAnswer(answer);

    const wrongOptions = [
      (parseInt(answer) + 1).toString(),
      (parseInt(answer) - 1).toString(),
      (parseInt(answer) + 2).toString(),
    ].sort(() => Math.random() - 0.5).slice(0, 2);

    setOptions([answer, ...wrongOptions].sort(() => Math.random() - 0.5));
  };

  const generateShapePattern = () => {
    const selectedShapes = shapeEmojis.sort(() => Math.random() - 0.5).slice(0, 3);
    const patternType = Math.random() > 0.5 ? 'AB' : 'ABC';

    let newPattern: string[] = [];
    if (patternType === 'AB') {
      newPattern = [
        selectedShapes[0],
        selectedShapes[1],
        selectedShapes[0],
        selectedShapes[1],
        selectedShapes[0],
      ];
      setCorrectAnswer(selectedShapes[1]);
    } else {
      newPattern = [
        selectedShapes[0],
        selectedShapes[1],
        selectedShapes[2],
        selectedShapes[0],
        selectedShapes[1],
      ];
      setCorrectAnswer(selectedShapes[2]);
    }

    setPattern(newPattern);
    const wrongOptions = shapeEmojis.filter(s => s !== correctAnswer).sort(() => Math.random() - 0.5).slice(0, 2);
    setOptions([correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5));
  };

  const generateQuestion = (lvl: PatternLevel) => {
    if (lvl === 'color-patterns') {
      generateColorPattern();
    } else if (lvl === 'number-patterns') {
      generateNumberPattern();
    } else if (lvl === 'shape-patterns') {
      generateShapePattern();
    } else if (lvl === 'mixed') {
      const types = ['color', 'number', 'shape'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      if (randomType === 'color') generateColorPattern();
      else if (randomType === 'number') generateNumberPattern();
      else generateShapePattern();
    }
  };

  const startLevel = (lvl: PatternLevel) => {
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
          <h2 className="text-5xl font-bold text-purple-600 mb-4 baloo">🎨 Patterns & Sequences!</h2>
          <p className="text-xl text-gray-700 mb-8">Find the pattern and complete the sequence!</p>
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
                  {lvl.id === 'color-patterns' && 'Red, Blue, Red, Blue, ?'}
                  {lvl.id === 'number-patterns' && '2, 4, 6, 8, ?'}
                  {lvl.id === 'shape-patterns' && 'Star, Circle, Star, ?'}
                  {lvl.id === 'mixed' && 'All pattern types!'}
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
        <div className="text-8xl mb-6">🌟</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Pattern Expert!</h2>
        <p className="text-2xl text-gray-600 mb-6">You completed {questionsAnswered} patterns!</p>
        <p className="text-3xl font-bold text-purple-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-purple-400 to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  const isNumberPattern = pattern.length > 0 && !isNaN(parseInt(pattern[0]));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-purple-600">Score: {score}</div>
          <div className="text-2xl font-bold text-pink-600">Patterns: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💜' : '🖤'}</span>
          ))}
        </div>
      </div>

      {pattern.length > 0 && (
        <motion.div key={pattern.join('-')} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">What comes next in the pattern?</h3>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {pattern.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className={`${
                    isNumberPattern
                      ? 'w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl font-bold text-purple-700 border-4 border-purple-400'
                      : 'text-6xl'
                  }`}
                >
                  {item}
                </motion.div>
              ))}

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-4xl"
              >
                →
              </motion.div>

              <div className={`${
                isNumberPattern
                  ? 'w-20 h-20 bg-yellow-300 rounded-2xl flex items-center justify-center text-4xl border-4 border-yellow-500 border-dashed'
                  : 'text-6xl'
              }`}>
                ❓
              </div>
            </div>

            <p className="text-lg text-gray-600">Choose the correct answer to complete the pattern!</p>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback !== null}
                  className={`${
                    isNumberPattern
                      ? 'bg-white border-4 border-purple-500 hover:bg-purple-50 text-gray-800 font-bold py-8 px-6 rounded-2xl text-3xl'
                      : 'bg-white border-4 border-purple-500 hover:bg-purple-50 py-8 px-6 rounded-2xl text-5xl'
                  } transition-all hover:scale-105 disabled:opacity-50 ${
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
                {showFeedback === 'correct' ? '✅ Perfect Pattern!' : `❌ It\'s ${correctAnswer}!`}
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
