'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type GraphLevel = 'bar-graphs' | 'pictographs' | 'tally-marks' | 'data-reading';

interface DataSet {
  labels: string[];
  values: number[];
  emojis: string[];
  question: string;
  answer: number | string;
}

export default function GraphsData() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<GraphLevel | null>(null);
  const [dataSet, setDataSet] = useState<DataSet | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'bar-graphs' as GraphLevel, title: 'Bar Graphs', emoji: '📊', color: 'from-teal-400 to-cyan-600' },
    { id: 'pictographs' as GraphLevel, title: 'Pictographs', emoji: '🎨', color: 'from-purple-400 to-pink-600' },
    { id: 'tally-marks' as GraphLevel, title: 'Tally Marks', emoji: '📝', color: 'from-blue-400 to-indigo-600' },
    { id: 'data-reading' as GraphLevel, title: 'Read Data', emoji: '📈', color: 'from-green-400 to-emerald-600' },
  ];

  const generateQuestion = (lvl: GraphLevel) => {
    const themes = [
      { labels: ['Apples', 'Bananas', 'Oranges'], emojis: ['🍎', '🍌', '🍊'] },
      { labels: ['Dogs', 'Cats', 'Birds'], emojis: ['🐕', '🐱', '🐦'] },
      { labels: ['Cars', 'Bikes', 'Buses'], emojis: ['🚗', '🚲', '🚌'] },
      { labels: ['Books', 'Pencils', 'Crayons'], emojis: ['📚', '✏️', '🖍️'] },
    ];

    const theme = themes[Math.floor(Math.random() * themes.length)];
    const values = theme.labels.map(() => Math.floor(Math.random() * 15) + 5);

    const questionTypes = [
      { q: `How many ${theme.labels[0]} are there?`, a: values[0] },
      { q: `Which has the most?`, a: theme.labels[values.indexOf(Math.max(...values))] },
      { q: `How many total items are there?`, a: values.reduce((a, b) => a + b, 0) },
      { q: `How many more ${theme.labels[0]} than ${theme.labels[1]}?`, a: Math.abs(values[0] - values[1]) },
    ];

    const selectedQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    const data: DataSet = {
      labels: theme.labels,
      values: values,
      emojis: theme.emojis,
      question: selectedQuestion.q,
      answer: selectedQuestion.a,
    };

    setDataSet(data);
    setCorrectAnswer(selectedQuestion.a.toString());

    // Generate options
    if (typeof selectedQuestion.a === 'number') {
      const wrongOptions: string[] = [];
      wrongOptions.push((selectedQuestion.a + Math.floor(Math.random() * 5) + 1).toString());
      wrongOptions.push((Math.max(0, selectedQuestion.a - Math.floor(Math.random() * 5) - 1)).toString());
      setOptions([selectedQuestion.a.toString(), ...wrongOptions].sort(() => Math.random() - 0.5));
    } else {
      const wrongOptions = theme.labels.filter(l => l !== selectedQuestion.a);
      setOptions([selectedQuestion.a, ...wrongOptions].sort(() => Math.random() - 0.5));
    }
  };

  const startLevel = (lvl: GraphLevel) => {
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
          <h2 className="text-5xl font-bold text-teal-600 mb-4 baloo">📊 Graphs & Data!</h2>
          <p className="text-xl text-gray-700 mb-8">Read charts and understand data!</p>
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
                  {lvl.id === 'bar-graphs' && 'Read bar graphs!'}
                  {lvl.id === 'pictographs' && 'Count picture graphs!'}
                  {lvl.id === 'tally-marks' && 'Read tally marks!'}
                  {lvl.id === 'data-reading' && 'Answer data questions!'}
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
        <div className="text-8xl mb-6">📈</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Data Detective!</h2>
        <p className="text-2xl text-gray-600 mb-6">You read {questionsAnswered} graphs correctly!</p>
        <p className="text-3xl font-bold text-teal-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-teal-400 to-cyan-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-teal-600">Score: {score}</div>
          <div className="text-2xl font-bold text-cyan-600">Read: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💚' : '🖤'}</span>
          ))}
        </div>
      </div>

      {dataSet && (
        <motion.div key={dataSet.question} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">{dataSet.question}</h3>

            {/* Bar Graph or Pictograph */}
            {(level === 'bar-graphs' || level === 'pictographs' || level === 'data-reading') && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex justify-around items-end h-80 border-b-4 border-l-4 border-gray-400 relative">
                  {dataSet.labels.map((label, index) => (
                    <div key={label} className="flex flex-col items-center gap-4">
                      {level === 'pictographs' ? (
                        <div className="flex flex-col-reverse gap-1 mb-4">
                          {[...Array(dataSet.values[index])].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="text-3xl"
                            >
                              {dataSet.emojis[index]}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(dataSet.values[index] / 20) * 100}%` }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                          className={`w-24 bg-gradient-to-t ${index === 0 ? 'from-blue-400 to-blue-600' : index === 1 ? 'from-green-400 to-green-600' : 'from-orange-400 to-orange-600'} rounded-t-lg flex items-end justify-center pb-2`}
                        >
                          <span className="text-white font-bold text-xl">{dataSet.values[index]}</span>
                        </motion.div>
                      )}
                      <div className="text-center">
                        <div className="text-3xl mb-1">{dataSet.emojis[index]}</div>
                        <div className="text-sm font-bold text-gray-700">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tally Marks */}
            {level === 'tally-marks' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {dataSet.labels.map((label, index) => (
                  <div key={label} className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{dataSet.emojis[index]}</span>
                      <span className="text-xl font-bold text-gray-700">{label}</span>
                    </div>
                    <div className="flex gap-2">
                      {[...Array(dataSet.values[index])].map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-3xl font-bold text-gray-800"
                        >
                          {i % 5 === 4 ? '🔴' : '|'}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
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
                  className={`bg-white border-4 border-teal-500 hover:bg-teal-50 text-gray-800 font-bold py-6 px-4 rounded-2xl text-2xl transition-all hover:scale-105 disabled:opacity-50 ${
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
      )}

      <button onClick={() => setLevel(null)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-all">
        ← Back to Levels
      </button>
    </div>
  );
}
