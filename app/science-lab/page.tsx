'use client';

import { useState } from 'react';
import { useViewFocus } from '@/hooks/useViewFocus';
import { motion } from 'framer-motion';
import SpaceExplorer from '@/components/science/SpaceExplorer';
import Link from 'next/link';
import { FaArrowLeft, FaRocket, FaLeaf, FaFlask, FaHeart, FaCloudSun } from 'react-icons/fa';

type Module = 'hub' | 'space' | 'nature' | 'experiments' | 'body' | 'weather';

const scienceModules = [
  {
    id: 'space' as Module,
    title: 'Space Explorer',
    description: 'Explore planets, stars, and the solar system!',
    icon: <FaRocket className="text-6xl" />,
    color: 'from-purple-400 to-indigo-600',
    emoji: '🚀'
  },
  {
    id: 'nature' as Module,
    title: 'Nature Discovery',
    description: 'Learn about animals, plants, and habitats!',
    icon: <FaLeaf className="text-6xl" />,
    color: 'from-green-400 to-emerald-600',
    emoji: '🌿'
  },
  {
    id: 'experiments' as Module,
    title: 'Experiment Lab',
    description: 'Try amazing science experiments safely!',
    icon: <FaFlask className="text-6xl" />,
    color: 'from-blue-400 to-cyan-600',
    emoji: '🧪'
  },
  {
    id: 'body' as Module,
    title: 'Human Body',
    description: 'Discover how your body works!',
    icon: <FaHeart className="text-6xl" />,
    color: 'from-red-400 to-pink-600',
    emoji: '❤️'
  },
  {
    id: 'weather' as Module,
    title: 'Weather Station',
    description: 'Learn about weather, seasons, and climate!',
    icon: <FaCloudSun className="text-6xl" />,
    color: 'from-orange-400 to-yellow-500',
    emoji: '🌤️'
  }
];

export default function ScienceLab() {
  const [currentModule, setCurrentModule] = useState<Module>('hub');
  const { viewRef, rememberTrigger } = useViewFocus(currentModule, 'hub');

  // Space Explorer Module
  if (currentModule === 'space') {
    return (
      <main id="main-content" ref={viewRef} tabIndex={-1} className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentModule('hub')}
            className="mb-6 px-6 py-3 bg-white text-purple-600 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl relative"
          >
            <FaArrowLeft /> Back to Science Lab
            <span className="absolute -top-2 -right-2 text-2xl transform -rotate-12">🦊</span>
          </motion.button>
          <SpaceExplorer />
        </div>
      </main>
    );
  }

  // Other modules - Coming Soon placeholders
  if (currentModule !== 'hub') {
    return (
      <main id="main-content" ref={viewRef} tabIndex={-1} className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentModule('hub')}
            className="mb-6 px-6 py-3 bg-white text-purple-600 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl relative"
          >
            <FaArrowLeft /> Back to Science Lab
            <span className="absolute -top-2 -right-2 text-2xl transform -rotate-12">🦊</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 text-center"
          >
            <div className="text-9xl mb-6">
              {scienceModules.find(m => m.id === currentModule)?.emoji}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-purple-600 mb-4 baloo">
              {scienceModules.find(m => m.id === currentModule)?.title}
            </h2>
            <p className="text-2xl text-gray-600 mb-8">
              Coming Soon! We&apos;re working hard to bring you amazing science content!
            </p>
            <div className="text-8xl">🔬✨</div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Hub View
  return (
    <main id="main-content" ref={viewRef} tabIndex={-1} className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back to Home */}
        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 px-6 py-3 bg-white text-purple-600 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl relative"
          >
            <FaArrowLeft /> Back to Home
            <span className="absolute -top-2 -right-2 text-2xl transform -rotate-12">🦊</span>
          </motion.span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 mb-4 baloo">
            🔬 Science Lab
          </h1>
          <p className="text-2xl text-gray-700">
            Explore, experiment, and discover the wonders of science!
          </p>
        </motion.div>

        {/* Science Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {scienceModules.map((module, index) => (
            <motion.button
              key={module.id}
              data-focus-return={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={event => { rememberTrigger(event.currentTarget); setCurrentModule(module.id); }}
              className={`bg-gradient-to-br ${module.color} rounded-3xl p-8 cursor-pointer shadow-2xl hover:shadow-3xl transition-all`}
            >
              <div className="text-center text-white">
                <div className="mb-6">{module.icon}</div>
                <h2 className="text-3xl font-bold mb-4 baloo">{module.title}</h2>
                {module.id !== 'space' && <span className="inline-block bg-white text-purple-800 font-bold text-sm rounded-full px-4 py-2 mb-4">Coming Soon</span>}
                <p className="text-lg opacity-90 mb-6">{module.description}</p>
                <div className="text-5xl">{module.emoji}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Science Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8 baloo">
            🌟 Amazing Science Facts
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6">
              <div className="text-5xl mb-3 text-center">🌍</div>
              <p className="text-gray-800 text-center">
                Earth travels around the Sun at 67,000 miles per hour!
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6">
              <div className="text-5xl mb-3 text-center">💧</div>
              <p className="text-gray-800 text-center">
                Water can exist as solid, liquid, and gas at the same time!
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6">
              <div className="text-5xl mb-3 text-center">🦋</div>
              <p className="text-gray-800 text-center">
                A butterfly tastes with its feet!
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6">
              <div className="text-5xl mb-3 text-center">⚡</div>
              <p className="text-gray-800 text-center">
                Lightning is 5 times hotter than the surface of the sun!
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-6">
              <div className="text-5xl mb-3 text-center">❤️</div>
              <p className="text-gray-800 text-center">
                Your heart beats about 100,000 times every day!
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6">
              <div className="text-5xl mb-3 text-center">🌈</div>
              <p className="text-gray-800 text-center">
                Rainbows are actually full circles, but we only see half!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl p-8"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-6 baloo">
            🧑‍🔬 Scientist Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-xl mb-3 text-purple-600">Always Be Curious!</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Ask questions about everything</li>
                <li>• Observe carefully</li>
                <li>• Take notes of what you see</li>
                <li>• Never stop learning!</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-xl mb-3 text-blue-600">Think Like a Scientist!</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Make predictions before testing</li>
                <li>• Experiment and try new things</li>
                <li>• Learn from mistakes</li>
                <li>• Share your discoveries!</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
