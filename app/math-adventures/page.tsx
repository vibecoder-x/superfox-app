'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaGraduationCap, FaGamepad, FaChartLine, FaTimes, FaHome } from 'react-icons/fa';
import MathTutor from '@/components/math/MathTutor';
import MathQuiz from '@/components/math/MathQuiz';
import NumberGames from '@/components/math/NumberGames';
import Image from 'next/image';
import Link from 'next/link';

type ActivityType = null | 'tutor' | 'quiz' | 'games';

interface UserStats {
  lessonsCompleted: number;
  quizzesPassed: number;
  starsEarned: number;
  totalScore: number;
  gamesPlayed: number;
  lastActivity: string;
}

const activities = [
  {
    id: 'tutor',
    title: 'Math Tutor',
    description: 'Learn step-by-step with Superfox as your teacher!',
    emoji: '👨‍🏫',
    icon: <FaGraduationCap className="text-6xl" />,
    color: 'from-blue-400 to-blue-600',
    topics: ['Addition', 'Subtraction', 'Counting', 'Number Recognition'],
  },
  {
    id: 'quiz',
    title: 'Math Quiz',
    description: 'Test your skills and earn stars!',
    emoji: '📝',
    icon: <FaChartLine className="text-6xl" />,
    color: 'from-purple-400 to-purple-600',
    topics: ['Easy Quiz', 'Medium Quiz', 'Hard Quiz', 'Mixed Challenge'],
  },
  {
    id: 'games',
    title: 'Number Games',
    description: 'Fun counting and matching games!',
    emoji: '🎮',
    icon: <FaGamepad className="text-6xl" />,
    color: 'from-green-400 to-green-600',
    topics: ['Counting Game', 'Pattern Match', 'Shape Sorting', 'Skip Counting'],
  },
  {
    id: 'addition',
    title: 'Addition Fun',
    description: 'Add numbers and make them bigger!',
    emoji: '➕',
    icon: <div className="text-6xl">➕</div>,
    color: 'from-orange-400 to-red-500',
    topics: ['Add to 10', 'Add to 20', 'Add to 50', 'Add to 100'],
  },
  {
    id: 'subtraction',
    title: 'Subtraction Zone',
    description: 'Take away numbers and see what\'s left!',
    emoji: '➖',
    icon: <div className="text-6xl">➖</div>,
    color: 'from-pink-400 to-rose-600',
    topics: ['Subtract from 10', 'Subtract from 20', 'Subtract from 50'],
  },
  {
    id: 'multiplication',
    title: 'Times Tables',
    description: 'Learn to multiply with fun patterns!',
    emoji: '✖️',
    icon: <div className="text-6xl">✖️</div>,
    color: 'from-cyan-400 to-blue-600',
    topics: ['2× Table', '5× Table', '10× Table', 'Mix & Match'],
  },
  {
    id: 'division',
    title: 'Division Master',
    description: 'Share and divide numbers equally!',
    emoji: '➗',
    icon: <div className="text-6xl">➗</div>,
    color: 'from-violet-400 to-fuchsia-600',
    topics: ['Divide by 2', 'Divide by 5', 'Divide by 10', 'Division Facts'],
  },
  {
    id: 'shapes',
    title: 'Shapes & Geometry',
    description: 'Discover circles, squares, and more!',
    emoji: '🔷',
    icon: <div className="text-6xl">🔷</div>,
    color: 'from-teal-400 to-green-600',
    topics: ['2D Shapes', '3D Shapes', 'Symmetry', 'Angles'],
  },
  {
    id: 'patterns',
    title: 'Patterns & Sequences',
    description: 'Find the pattern and complete it!',
    emoji: '🎨',
    icon: <div className="text-6xl">🎨</div>,
    color: 'from-indigo-400 to-purple-600',
    topics: ['Color Patterns', 'Number Patterns', 'Shape Patterns'],
  },
  {
    id: 'fractions',
    title: 'Fractions Fun',
    description: 'Share equally and learn about parts!',
    emoji: '🍕',
    icon: <div className="text-6xl">🍕</div>,
    color: 'from-yellow-400 to-orange-600',
    topics: ['Halves', 'Quarters', 'Thirds', 'Simple Fractions'],
  },
  {
    id: 'counting',
    title: 'Counting Kingdom',
    description: 'Count from 1 to 100 and beyond!',
    emoji: '🔢',
    icon: <div className="text-6xl">🔢</div>,
    color: 'from-lime-400 to-green-600',
    topics: ['Count to 10', 'Count to 20', 'Count to 50', 'Count to 100'],
  },
  {
    id: 'money',
    title: 'Money Math',
    description: 'Learn to count coins and dollars!',
    emoji: '💰',
    icon: <div className="text-6xl">💰</div>,
    color: 'from-emerald-400 to-teal-600',
    topics: ['Coins', 'Dollars', 'Change', 'Buying & Selling'],
  },
  {
    id: 'time',
    title: 'Time & Clock',
    description: 'Tell time and learn about hours!',
    emoji: '⏰',
    icon: <div className="text-6xl">⏰</div>,
    color: 'from-sky-400 to-blue-600',
    topics: ['Hour Hand', 'Minute Hand', 'Digital Clock', 'Time Words'],
  },
  {
    id: 'measurement',
    title: 'Measurement Lab',
    description: 'Measure length, weight, and more!',
    emoji: '📏',
    icon: <div className="text-6xl">📏</div>,
    color: 'from-amber-400 to-orange-600',
    topics: ['Length', 'Weight', 'Volume', 'Comparison'],
  },
  {
    id: 'place-value',
    title: 'Place Value',
    description: 'Ones, tens, and hundreds!',
    emoji: '🔟',
    icon: <div className="text-6xl">🔟</div>,
    color: 'from-rose-400 to-pink-600',
    topics: ['Ones', 'Tens', 'Hundreds', 'Expanded Form'],
  },
  {
    id: 'word-problems',
    title: 'Word Problems',
    description: 'Solve real-life math stories!',
    emoji: '📖',
    icon: <div className="text-6xl">📖</div>,
    color: 'from-fuchsia-400 to-purple-600',
    topics: ['Simple Stories', 'Addition Stories', 'Subtraction Stories'],
  },
  {
    id: 'skip-counting',
    title: 'Skip Counting',
    description: 'Count by 2s, 5s, and 10s!',
    emoji: '🐸',
    icon: <div className="text-6xl">🐸</div>,
    color: 'from-green-400 to-emerald-600',
    topics: ['Count by 2s', 'Count by 5s', 'Count by 10s', 'Count by 100s'],
  },
  {
    id: 'odd-even',
    title: 'Odd & Even Numbers',
    description: 'Which numbers are odd or even?',
    emoji: '🎲',
    icon: <div className="text-6xl">🎲</div>,
    color: 'from-red-400 to-orange-600',
    topics: ['Odd Numbers', 'Even Numbers', 'Patterns', 'Sorting'],
  },
  {
    id: 'comparing',
    title: 'Compare Numbers',
    description: 'Which is bigger? Which is smaller?',
    emoji: '⚖️',
    icon: <div className="text-6xl">⚖️</div>,
    color: 'from-blue-400 to-cyan-600',
    topics: ['Greater Than', 'Less Than', 'Equal To', 'Ordering'],
  },
  {
    id: 'estimation',
    title: 'Estimation Station',
    description: 'Guess and estimate like a pro!',
    emoji: '🤔',
    icon: <div className="text-6xl">🤔</div>,
    color: 'from-purple-400 to-indigo-600',
    topics: ['Rounding', 'Nearest 10', 'Nearest 100', 'Smart Guessing'],
  },
  {
    id: 'data-graphs',
    title: 'Graphs & Data',
    description: 'Read charts and make graphs!',
    emoji: '📊',
    icon: <div className="text-6xl">📊</div>,
    color: 'from-teal-400 to-cyan-600',
    topics: ['Bar Graphs', 'Pictographs', 'Tally Marks', 'Data Tables'],
  },
  {
    id: 'decimals',
    title: 'Decimals',
    description: 'Learn about points and decimal numbers!',
    emoji: '🔢',
    icon: <div className="text-6xl">🔢</div>,
    color: 'from-pink-400 to-red-600',
    topics: ['Tenths', 'Hundredths', 'Decimal Points', 'Simple Decimals'],
  },
];

export default function MathAdventuresPage() {
  const [activeActivity, setActiveActivity] = useState<ActivityType>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    lessonsCompleted: 0,
    quizzesPassed: 0,
    starsEarned: 0,
    totalScore: 0,
    gamesPlayed: 0,
    lastActivity: 'Never',
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('mathAdventuresStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mathAdventuresStats', JSON.stringify(userStats));
  }, [userStats]);

  const handleActivityStart = (activityId: ActivityType) => {
    setActiveActivity(activityId);
    setUserStats(prev => ({
      ...prev,
      lastActivity: new Date().toLocaleDateString(),
    }));
  };

  const handleQuizComplete = (score: number, questionsAnswered: number) => {
    const stars = Math.floor(score / 10); // 10 points = 1 star
    setUserStats(prev => ({
      ...prev,
      quizzesPassed: prev.quizzesPassed + 1,
      starsEarned: prev.starsEarned + stars,
      totalScore: prev.totalScore + score,
    }));
  };

  const handleGameComplete = (score: number) => {
    const stars = Math.floor(score / 10);
    setUserStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      starsEarned: prev.starsEarned + stars,
      totalScore: prev.totalScore + score,
    }));
  };

  const handleLessonComplete = () => {
    setUserStats(prev => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
      starsEarned: prev.starsEarned + 5, // 5 stars for completing a lesson
    }));
  };

  const renderActivity = () => {
    switch (activeActivity) {
      case 'tutor':
        return <MathTutor />;
      case 'quiz':
        return <MathQuiz />;
      case 'games':
        return <NumberGames />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration - Math Emojis Everywhere! */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute top-10 left-10 text-8xl animate-bounce">🔢</div>
        <div className="absolute top-20 right-20 text-8xl">➕</div>
        <div className="absolute bottom-20 left-20 text-8xl">➖</div>
        <div className="absolute bottom-10 right-10 text-8xl animate-pulse">🎯</div>
        <div className="absolute top-40 left-1/4 text-7xl">✖️</div>
        <div className="absolute top-60 right-1/3 text-7xl">➗</div>
        <div className="absolute bottom-40 right-1/4 text-7xl">🧮</div>
        <div className="absolute top-1/3 left-10 text-6xl">📐</div>
        <div className="absolute bottom-1/3 right-10 text-6xl">📏</div>
        <div className="absolute top-1/2 right-20 text-8xl">🔷</div>
        <div className="absolute bottom-1/2 left-1/3 text-7xl">🔶</div>
        <div className="absolute top-1/4 right-1/2 text-6xl">⭐</div>
        <div className="absolute bottom-1/4 left-1/2 text-6xl">💯</div>
        <div className="absolute top-3/4 right-1/4 text-7xl">🎨</div>
        <div className="absolute top-16 left-1/2 text-6xl">🍕</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Home Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-full shadow-lg transition-all"
          >
            <FaHome /> Back to Home
          </Link>
        </div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-6xl">🧮</span>
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent baloo"
            >
              Math Adventures
            </motion.h1>
            <span className="text-6xl">🚀</span>
          </motion.div>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-4">
            🌟 Count, add, multiply, and solve fun math puzzles with Superfox! 🌟
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-4xl">
            <span className="animate-bounce">➕</span>
            <span className="animate-pulse">➖</span>
            <span className="animate-bounce">✖️</span>
            <span className="animate-pulse">➗</span>
            <span className="animate-bounce">🔢</span>
            <span className="animate-pulse">🎯</span>
            <span className="animate-bounce">💯</span>
          </div>
        </motion.div>

        {/* Superfox Character */}
        {!activeActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-64 h-64"
            >
              <Image
                src="/images/Superfox teaching math to kids on a chalkboard.png"
                alt="Superfox teaching math"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Activity Selection or Active Activity */}
        {!activeActivity ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleActivityStart(activity.id as ActivityType)}
                >
                  <div
                    className={`bg-gradient-to-br ${activity.color} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden min-h-[320px] flex flex-col`}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12" />
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full translate-y-10 -translate-x-10" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 flex flex-col">
                      {/* Emoji Badge */}
                      <div className="text-6xl mb-4 text-center filter drop-shadow-lg">
                        {activity.emoji}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white mb-2 baloo text-center">
                        {activity.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/90 text-center mb-4 text-sm">
                        {activity.description}
                      </p>

                      {/* Topics Pills */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {activity.topics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="bg-white/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Start Button */}
                      <button className="w-full bg-white text-gray-800 font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition-colors duration-300 transform hover:scale-105 mt-auto">
                        Start Learning! 🚀
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl p-8 text-center text-white shadow-2xl max-w-4xl mx-auto mb-12"
            >
              <h3 className="text-4xl font-bold mb-4 baloo">Your Math Journey 🚀</h3>
              <p className="text-xl mb-6">
                Practice every day and become a math superstar!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                  <div className="text-5xl font-bold">{userStats.lessonsCompleted}</div>
                  <div className="text-sm mt-2">Lessons Completed</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                  <div className="text-5xl font-bold">{userStats.quizzesPassed}</div>
                  <div className="text-sm mt-2">Quizzes Passed</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                  <div className="text-5xl font-bold">{userStats.starsEarned}</div>
                  <div className="text-sm mt-2">Stars Earned ⭐</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                  <div className="text-5xl font-bold">{userStats.totalScore}</div>
                  <div className="text-sm mt-2">Total Score</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                  <div className="text-5xl font-bold">{userStats.gamesPlayed}</div>
                  <div className="text-sm mt-2">Games Played</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                  <div className="text-lg font-bold mt-2">{userStats.lastActivity}</div>
                  <div className="text-sm mt-2">Last Activity</div>
                </div>
              </div>
            </motion.div>

            {/* Fun Facts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-center"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
                <p className="text-2xl font-bold text-blue-600 baloo mb-2">
                  💡 Did you know?
                </p>
                <p className="text-lg text-gray-700">
                  Math helps us count toys, share snacks, and even tell time!
                </p>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto"
          >
            {/* Back Button */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setActiveActivity(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all"
              >
                <FaTimes /> Back to Activities
              </button>
            </div>

            {/* Activity Content */}
            <div>{renderActivity()}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
