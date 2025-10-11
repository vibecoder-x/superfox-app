'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type TimeLevel = 'hour-hand' | 'half-hour' | 'digital-time' | 'time-matching';

export default function TimeClock() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<TimeLevel | null>(null);
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

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const displayMinute = m.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const formatTimeWords = (h: number, m: number) => {
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    if (m === 0) {
      return `${displayHour} o'clock`;
    } else if (m === 30) {
      return `${displayHour}:30`;
    } else {
      return `${displayHour}:${m.toString().padStart(2, '0')}`;
    }
  };

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

    const correct = formatTime(newHour, newMinute);
    setCorrectAnswer(correct);

    // Generate wrong options
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 2) {
      const wrongH = Math.floor(Math.random() * 12) + 1;
      const wrongM = lvl === 'hour-hand' ? 0 : Math.floor(Math.random() * 4) * 15;
      const wrongTime = formatTime(wrongH, wrongM);
      if (wrongTime !== correct && !wrongOptions.includes(wrongTime)) {
        wrongOptions.push(wrongTime);
      }
    }

    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
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

  const renderClock = () => {
    const hourAngle = ((hour % 12) * 30) + (minute * 0.5) - 90;
    const minuteAngle = (minute * 6) - 90;

    return (
      <div className="relative w-80 h-80 bg-white rounded-full border-8 border-blue-600 shadow-2xl">
        {/* Clock numbers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
          const angle = (index * 30) - 90;
          const x = 140 * Math.cos(angle * Math.PI / 180);
          const y = 140 * Math.sin(angle * Math.PI / 180);
          return (
            <div
              key={num}
              className="absolute text-2xl font-bold text-gray-700"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20"></div>

        {/* Hour hand */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-left"
          style={{
            width: '80px',
            height: '8px',
            backgroundColor: '#1e40af',
            borderRadius: '4px',
            transform: `translate(-10px, -4px) rotate(${hourAngle}deg)`,
          }}
          initial={{ rotate: hourAngle - 360 }}
          animate={{ rotate: hourAngle }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Minute hand */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-left"
          style={{
            width: '120px',
            height: '6px',
            backgroundColor: '#3b82f6',
            borderRadius: '3px',
            transform: `translate(-10px, -3px) rotate(${minuteAngle}deg)`,
          }}
          initial={{ rotate: minuteAngle - 360 }}
          animate={{ rotate: minuteAngle }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 text-center shadow-2xl">
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
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-blue-600">Score: {score}</div>
          <div className="text-2xl font-bold text-cyan-600">Times: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💙' : '🖤'}</span>
          ))}
        </div>
      </div>

      <motion.div key={`${hour}-${minute}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-12 shadow-2xl">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-gray-800">What time is shown on the clock?</h3>

          <div className="flex justify-center">
            {renderClock()}
          </div>

          <p className="text-lg text-gray-600">Look at the clock hands and choose the correct time!</p>

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
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
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
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
