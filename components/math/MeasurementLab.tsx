'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type MeasureLevel = 'length' | 'weight' | 'volume' | 'comparing';

export default function MeasurementLab() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<MeasureLevel | null>(null);
  const [measurement, setMeasurement] = useState(0);
  const [unit, setUnit] = useState('');
  const [item, setItem] = useState('');
  const [itemEmoji, setItemEmoji] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'length' as MeasureLevel, title: 'Measuring Length', emoji: '📏', color: 'from-orange-400 to-amber-600' },
    { id: 'weight' as MeasureLevel, title: 'Measuring Weight', emoji: '⚖️', color: 'from-purple-400 to-pink-600' },
    { id: 'volume' as MeasureLevel, title: 'Measuring Volume', emoji: '🥤', color: 'from-blue-400 to-cyan-600' },
    { id: 'comparing' as MeasureLevel, title: 'Compare Sizes', emoji: '📊', color: 'from-green-400 to-teal-600' },
  ];

  const lengthItems = [
    { name: 'Pencil', emoji: '✏️', length: 7, unit: 'inches' },
    { name: 'Book', emoji: '📖', length: 10, unit: 'inches' },
    { name: 'Ruler', emoji: '📏', length: 12, unit: 'inches' },
    { name: 'Desk', emoji: '🪑', length: 3, unit: 'feet' },
    { name: 'Door', emoji: '🚪', length: 7, unit: 'feet' },
  ];

  const weightItems = [
    { name: 'Apple', emoji: '🍎', weight: 5, unit: 'ounces' },
    { name: 'Banana', emoji: '🍌', weight: 4, unit: 'ounces' },
    { name: 'Book', emoji: '📚', weight: 1, unit: 'pound' },
    { name: 'Backpack', emoji: '🎒', weight: 3, unit: 'pounds' },
    { name: 'Cat', emoji: '🐱', weight: 8, unit: 'pounds' },
  ];

  const volumeItems = [
    { name: 'Cup of water', emoji: '☕', volume: 8, unit: 'ounces' },
    { name: 'Juice box', emoji: '🧃', volume: 6, unit: 'ounces' },
    { name: 'Milk carton', emoji: '🥛', volume: 1, unit: 'quart' },
    { name: 'Water bottle', emoji: '💧', volume: 16, unit: 'ounces' },
    { name: 'Fish tank', emoji: '🐠', volume: 5, unit: 'gallons' },
  ];

  const generateLengthQuestion = () => {
    const selectedItem = lengthItems[Math.floor(Math.random() * lengthItems.length)];
    setItem(selectedItem.name);
    setItemEmoji(selectedItem.emoji);
    setMeasurement(selectedItem.length);
    setUnit(selectedItem.unit);

    const correct = `${selectedItem.length} ${selectedItem.unit}`;
    setCorrectAnswer(correct);

    const wrongOptions: string[] = [];
    while (wrongOptions.length < 2) {
      const wrongValue = selectedItem.length + (Math.random() > 0.5 ? 2 : -2);
      const wrongOption = `${wrongValue} ${selectedItem.unit}`;
      if (!wrongOptions.includes(wrongOption) && wrongOption !== correct) {
        wrongOptions.push(wrongOption);
      }
    }

    setOptions([correct, ...wrongOptions].sort(() => Math.random() - 0.5));
  };

  const generateWeightQuestion = () => {
    const selectedItem = weightItems[Math.floor(Math.random() * weightItems.length)];
    setItem(selectedItem.name);
    setItemEmoji(selectedItem.emoji);
    setMeasurement(selectedItem.weight);
    setUnit(selectedItem.weight === 1 ? 'pound' : selectedItem.unit);

    const correct = `${selectedItem.weight} ${selectedItem.weight === 1 ? 'pound' : selectedItem.unit}`;
    setCorrectAnswer(correct);

    const wrongOptions: string[] = [];
    while (wrongOptions.length < 2) {
      const wrongValue = selectedItem.weight + (Math.random() > 0.5 ? 2 : -1);
      const wrongUnit = wrongValue === 1 ? 'pound' : selectedItem.unit;
      const wrongOption = `${wrongValue} ${wrongUnit}`;
      if (!wrongOptions.includes(wrongOption) && wrongOption !== correct && wrongValue > 0) {
        wrongOptions.push(wrongOption);
      }
    }

    setOptions([correct, ...wrongOptions].sort(() => Math.random() - 0.5));
  };

  const generateVolumeQuestion = () => {
    const selectedItem = volumeItems[Math.floor(Math.random() * volumeItems.length)];
    setItem(selectedItem.name);
    setItemEmoji(selectedItem.emoji);
    setMeasurement(selectedItem.volume);
    setUnit(selectedItem.unit);

    const correct = `${selectedItem.volume} ${selectedItem.unit}`;
    setCorrectAnswer(correct);

    const wrongOptions: string[] = [];
    while (wrongOptions.length < 2) {
      const wrongValue = selectedItem.volume + (Math.random() > 0.5 ? 2 : -2);
      const wrongOption = `${wrongValue} ${selectedItem.unit}`;
      if (!wrongOptions.includes(wrongOption) && wrongOption !== correct && wrongValue > 0) {
        wrongOptions.push(wrongOption);
      }
    }

    setOptions([correct, ...wrongOptions].sort(() => Math.random() - 0.5));
  };

  const generateComparingQuestion = () => {
    const allItems = [...lengthItems, ...weightItems, ...volumeItems];
    const item1 = allItems[Math.floor(Math.random() * allItems.length)];
    const item2 = allItems[Math.floor(Math.random() * allItems.length)];

    setItem(`${item1.name} vs ${item2.name}`);
    setItemEmoji(`${item1.emoji} ${item2.emoji}`);

    const val1 = (item1 as any).length || (item1 as any).weight || (item1 as any).volume;
    const val2 = (item2 as any).length || (item2 as any).weight || (item2 as any).volume;

    if (val1 > val2) {
      setCorrectAnswer(item1.name);
    } else if (val2 > val1) {
      setCorrectAnswer(item2.name);
    } else {
      setCorrectAnswer('Same size');
    }

    setOptions([item1.name, item2.name, 'Same size'].sort(() => Math.random() - 0.5));
  };

  const generateQuestion = (lvl: MeasureLevel) => {
    if (lvl === 'length') {
      generateLengthQuestion();
    } else if (lvl === 'weight') {
      generateWeightQuestion();
    } else if (lvl === 'volume') {
      generateVolumeQuestion();
    } else if (lvl === 'comparing') {
      generateComparingQuestion();
    }
  };

  const startLevel = (lvl: MeasureLevel) => {
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
          <h2 className="text-5xl font-bold text-orange-600 mb-4 baloo">📏 Measurement Lab!</h2>
          <p className="text-xl text-gray-700 mb-8">Measure length, weight, volume, and more!</p>
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
                  {lvl.id === 'length' && 'Inches, feet, and more!'}
                  {lvl.id === 'weight' && 'Ounces and pounds!'}
                  {lvl.id === 'volume' && 'Cups, quarts, gallons!'}
                  {lvl.id === 'comparing' && 'Which is bigger?'}
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
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Measurement Master!</h2>
        <p className="text-2xl text-gray-600 mb-6">You measured {questionsAnswered} items correctly!</p>
        <p className="text-3xl font-bold text-orange-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-orange-400 to-amber-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
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
          <div className="text-2xl font-bold text-amber-600">Measured: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '🧡' : '🖤'}</span>
          ))}
        </div>
      </div>

      {item && (
        <motion.div key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">
              {level === 'comparing' ? 'Which one is bigger?' : `How much does this ${level}?`}
            </h3>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-9xl"
            >
              {itemEmoji}
            </motion.div>

            <p className="text-2xl font-bold text-gray-700">{item}</p>

            {level !== 'comparing' && (
              <div className="bg-white rounded-2xl p-6 inline-block shadow-lg">
                <div className="text-7xl mb-2">📏</div>
                <p className="text-lg text-gray-600">Choose the correct measurement</p>
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
                  className={`bg-white border-4 border-orange-500 hover:bg-orange-50 text-gray-800 font-bold py-6 px-4 rounded-2xl text-xl transition-all hover:scale-105 disabled:opacity-50 ${
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
