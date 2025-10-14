'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaGamepad, FaPuzzlePiece, FaTrophy, FaFire } from 'react-icons/fa';
import ColorMatchGame from './games/ColorMatchGame';

const games = [
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match colors and learn about different shades!',
    difficulty: 'Easy',
    icon: '🎨',
    image: '/images/Superfox and kids drawing together on the floor.png',
    players: '1.2k',
  },
  {
    id: 'number-quest',
    title: 'Number Quest',
    description: 'Count blocks and solve number puzzles!',
    difficulty: 'Medium',
    icon: '🔢',
    image: '/images/Superfox counting colorful blocks.png',
    players: '980',
  },
  {
    id: 'shape-builder',
    title: 'Shape Builder',
    description: 'Build amazing structures with geometric shapes!',
    difficulty: 'Easy',
    icon: '🏗️',
    image: '/images/Superfox building a robot with tools.png',
    players: '1.5k',
  },
  {
    id: 'music-maker',
    title: 'Music Maker',
    description: 'Create beautiful melodies with Superfox!',
    difficulty: 'Easy',
    icon: '🎵',
    image: '/images/Superfox playing a guitar and singing.png',
    players: '870',
  },
];

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleGameClick = (gameId: string) => {
    setActiveGame(gameId);
  };

  const handleCloseGame = () => {
    setActiveGame(null);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full filter blur-3xl opacity-30 -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-30 translate-x-32 translate-y-32" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-superfox-purple mb-4 baloo">
              Mini-Games
            </h2>
            <p className="text-xl md:text-2xl text-gray-700">
              Learn through play with fun educational games!
            </p>
          </motion.div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {games.map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleGameClick(game.id)}
                className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer group"
              >
                {/* Game Image */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4 bg-green-400 text-white font-bold px-4 py-2 rounded-full text-sm">
                    {game.difficulty}
                  </div>
                  {/* Icon */}
                  <div className="absolute top-4 right-4 text-6xl filter drop-shadow-lg">
                    {game.icon}
                  </div>
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-superfox-purple font-bold py-3 px-8 rounded-full flex items-center gap-2"
                    >
                      <FaGamepad /> Play Now
                    </motion.button>
                  </div>
                </div>

                {/* Game Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 baloo">
                    {game.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <div className="flex items-center justify-center">
                    <FaTrophy className="text-yellow-500 text-3xl" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Game Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Image */}
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-full aspect-square"
                >
                  <Image
                    src="/images/Superfox giving a high-five to a child.png"
                    alt="Superfox Celebrating Success"
                    fill
                    className="object-cover rounded-3xl shadow-2xl"
                  />
                </motion.div>
              </div>

              {/* Right side - Features */}
              <div className="text-white">
                <h3 className="text-4xl md:text-5xl font-bold mb-6 baloo">
                  Superfox Celebrates Your Success!
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <FaPuzzlePiece className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">Fun Puzzles</h4>
                      <p className="text-white/90">
                        Solve exciting puzzles that make learning enjoyable
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <FaTrophy className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">Earn Rewards</h4>
                      <p className="text-white/90">
                        Collect stars and unlock special achievements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <FaGamepad className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">Safe & Kid-Friendly</h4>
                      <p className="text-white/90">
                        All games are designed for safety and age-appropriate fun
                      </p>
                    </div>
                  </div>
                </div>
                <button className="mt-8 bg-white text-superfox-orange font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Explore All Games
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Game Modals */}
      <AnimatePresence>
        {activeGame === 'color-match' && (
          <ColorMatchGame onClose={handleCloseGame} />
        )}
      </AnimatePresence>
    </>
  );
}
