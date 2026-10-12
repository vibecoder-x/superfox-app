'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { clockChoices, formatClockTime } from '@/lib/math-activities';
import { useActivityTimer } from '@/hooks/useActivityTimer';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type TimeLevel = 'hour-hand' | 'half-hour' | 'digital-time' | 'time-matching';

export default function TimeClock() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<TimeLevel | null>(null);
  const { schedule } = useActivityTimer(level);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'hour-hand' as TimeLevel, title: 'Hour Hand', emoji: '🕐', color: 'from-blue-400 to-cyan-600' },
    { id: 'half-hour' as TimeLevel, title: 'Half Hour', emoji: '🕐', color: 'from-purple-400 to-pink-600' },
    { id: 'digital-time' as TimeLevel, title: 'Digital Clock', emoji: '⏰', color: 'from-green-400 to-teal-600' },
    { id: 'time-matching' as TimeLevel, title: 'Time Matching', emoji: '⏱️', color: 'from-orange-400 to-red-600' },
  ];

  const generateQuestion = (lvl: TimeLevel) => {
    let newHour: number;
    let newMinute: number;

    if (lvl === 'hour-hand') {
      newHour = Math.floor(Math.random() * 12) + 1;
      newMinute = 0;
    } else if (lvl === 'half-hour') {
      newHour = Math.floor(Math.random() * 12) + 1;
      newMinute = Math.random() > 0.5 ? 0 : 30;
    } else if (lvl === 'digital-time') {
      newHour = Math.floor(Math.random() * 12) + 1;
      newMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    } else {
      newHour = Math.floor(Math.random() * 12) + 1;
      newMinute = Math.floor(Math.random() * 4) * 15;
    }

    setHour(newHour);
    setMinute(newMinute);

    const correct = formatClockTime(newHour, newMinute);
    setCorrectAnswer(correct);

    setOptions(clockChoices(newHour, newMinute, lvl === 'hour-hand'));
  };

  const startLevel = (lvl: TimeLevel) => {
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

  const renderClock = () => {
    const hourAngle = (((hour % 12) * 30) + (minute * 0.5) - 90) * Math.PI / 180;
    const minuteAngle = ((minute * 6) - 90) * Math.PI / 180;
    return (
      <svg viewBox="0 0 256 256" role="img" aria-label={`Analog clock showing ${formatClockTime(hour, minute)}`} className="w-full max-w-64 aspect-square drop-shadow-xl">
        <circle cx="128" cy="128" r="120" fill="white" stroke="#2563eb" strokeWidth="8" />
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((number, index) => {
          const angle = (index * 30 - 90) * Math.PI / 180;
          return <text key={number} x={128 + 99 * Math.cos(angle)} y={128 + 99 * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fill="#374151" fontSize="22" fontWeight="bold">{number}</text>;
        })}
        <line x1="128" y1="128" x2={128 + 64 * Math.cos(hourAngle)} y2={128 + 64 * Math.sin(hourAngle)} stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
        <line x1="128" y1="128" x2={128 + 92 * Math.cos(minuteAngle)} y2={128 + 92 * Math.sin(minuteAngle)} stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
        <circle cx="128" cy="128" r="7" fill="#2563eb" />
      </svg>
    );
  };
  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-blue-600 mb-4 baloo">⏰ Time & Clock!</h2>
          <p className="text-xl text-gray-700 mb-8">Learn to tell time and read clocks!</p>
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
                  {lvl.id === 'hour-hand' && 'Learn the hour hand!'}
                  {lvl.id === 'half-hour' && 'Hours and half hours!'}
                  {lvl.id === 'digital-time' && 'Read digital clocks!'}
                  {lvl.id === 'time-matching' && 'Match analog & digital!'}
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
        <div className="text-8xl mb-6">⏰</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Time Expert!</h2>
        <p className="text-2xl text-gray-600 mb-6">You read {questionsAnswered} clocks correctly!</p>
        <p className="text-3xl font-bold text-blue-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-blue-400 to-cyan-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="text-2xl font-bold text-blue-600">Score: {score}</div>
          <div className="text-2xl font-bold text-cyan-600">Times: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💙' : '🖤'}</span>
          ))}
        </div>
      </div>

      <motion.div key={`${hour}-${minute}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-6 sm:p-12 shadow-2xl">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-gray-800">What time is shown on the clock?</h3>

          <div className="flex justify-center">
            {level === 'digital-time' ? <div className="bg-gray-900 text-green-300 rounded-2xl px-6 py-8 text-5xl font-bold">{formatClockTime(hour, minute)}</div> : renderClock()}
          </div>

          <p className="text-lg text-gray-600">Look at the clock hands and choose the correct time!</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback !== null}
                className={`bg-white border-4 border-blue-500 hover:bg-blue-50 text-gray-800 font-bold py-6 px-4 rounded-2xl text-xl transition-all hover:scale-105 disabled:opacity-50 ${
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
              {showFeedback === 'correct' ? '✅ Perfect Time!' : `❌ It\'s ${correctAnswer}!`}
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
