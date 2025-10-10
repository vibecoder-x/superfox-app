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
    icon: <FaGraduationCap className="text-6xl" />,
    color: 'from-blue-400 to-blue-600',
    bgPattern: 'from-blue-50 to-indigo-50',
  },
  {
    id: 'quiz',
    title: 'Math Quiz',
    description: 'Test your skills and earn stars!',
    icon: <FaChartLine className="text-6xl" />,
    color: 'from-purple-400 to-purple-600',
    bgPattern: 'from-purple-50 to-pink-50',
  },
  {
    id: 'games',
    title: 'Number Games',
    description: 'Fun counting and matching games!',
    icon: <FaGamepad className="text-6xl" />,
    color: 'from-green-400 to-green-600',
    bgPattern: 'from-green-50 to-teal-50',
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
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🔢</div>
        <div className="absolute top-20 right-20 text-8xl">➕</div>
        <div className="absolute bottom-20 left-20 text-8xl">➖</div>
        <div className="absolute bottom-10 right-10 text-8xl">🎯</div>
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
          className="text-center mb-16"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-4 baloo"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Math Adventures 🧮
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Count, add, and solve fun math puzzles with Superfox!
          </p>
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
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleActivityStart(activity.id as ActivityType)}
                >
                  <div
                    className={`bg-gradient-to-br ${activity.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="text-white mb-6 flex justify-center">
                        {activity.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl font-bold text-white mb-3 baloo text-center">
                        {activity.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/90 text-center mb-6 text-lg">
                        {activity.description}
                      </p>

                      {/* Start Button */}
                      <button className="w-full bg-white text-gray-800 font-bold py-4 px-6 rounded-full hover:bg-yellow-300 transition-colors duration-300 transform hover:scale-105">
                        Start Learning!
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
