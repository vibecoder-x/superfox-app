'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar, FaTrophy, FaRedo, FaPalette } from 'react-icons/fa';
import Image from 'next/image';

interface Color {
  name: string;
  hex: string;
  rgb: string;
  family: string;
}

const colorDatabase: Color[] = [
  // Reds
  { name: 'Cherry Red', hex: '#DC143C', rgb: 'rgb(220, 20, 60)', family: 'red' },
  { name: 'Rose Red', hex: '#FF007F', rgb: 'rgb(255, 0, 127)', family: 'red' },
  { name: 'Crimson', hex: '#DC143C', rgb: 'rgb(220, 20, 60)', family: 'red' },
  { name: 'Ruby Red', hex: '#E0115F', rgb: 'rgb(224, 17, 95)', family: 'red' },

  // Blues
  { name: 'Sky Blue', hex: '#87CEEB', rgb: 'rgb(135, 206, 235)', family: 'blue' },
  { name: 'Ocean Blue', hex: '#4682B4', rgb: 'rgb(70, 130, 180)', family: 'blue' },
  { name: 'Navy Blue', hex: '#000080', rgb: 'rgb(0, 0, 128)', family: 'blue' },
  { name: 'Baby Blue', hex: '#89CFF0', rgb: 'rgb(137, 207, 240)', family: 'blue' },

  // Greens
  { name: 'Grass Green', hex: '#7CFC00', rgb: 'rgb(124, 252, 0)', family: 'green' },
  { name: 'Forest Green', hex: '#228B22', rgb: 'rgb(34, 139, 34)', family: 'green' },
  { name: 'Mint Green', hex: '#98FF98', rgb: 'rgb(152, 255, 152)', family: 'green' },
  { name: 'Emerald', hex: '#50C878', rgb: 'rgb(80, 200, 120)', family: 'green' },

  // Yellows
  { name: 'Sunshine Yellow', hex: '#FFD700', rgb: 'rgb(255, 215, 0)', family: 'yellow' },
  { name: 'Lemon Yellow', hex: '#FFF44F', rgb: 'rgb(255, 244, 79)', family: 'yellow' },
  { name: 'Golden Yellow', hex: '#FFDF00', rgb: 'rgb(255, 223, 0)', family: 'yellow' },
  { name: 'Banana Yellow', hex: '#FFE135', rgb: 'rgb(255, 225, 53)', family: 'yellow' },

  // Purples
  { name: 'Lavender', hex: '#E6E6FA', rgb: 'rgb(230, 230, 250)', family: 'purple' },
  { name: 'Royal Purple', hex: '#7851A9', rgb: 'rgb(120, 81, 169)', family: 'purple' },
  { name: 'Violet', hex: '#8F00FF', rgb: 'rgb(143, 0, 255)', family: 'purple' },
  { name: 'Plum Purple', hex: '#8E4585', rgb: 'rgb(142, 69, 133)', family: 'purple' },

  // Oranges
  { name: 'Tangerine', hex: '#FF9500', rgb: 'rgb(255, 149, 0)', family: 'orange' },
  { name: 'Coral', hex: '#FF7F50', rgb: 'rgb(255, 127, 80)', family: 'orange' },
  { name: 'Peach', hex: '#FFE5B4', rgb: 'rgb(255, 229, 180)', family: 'orange' },
  { name: 'Sunset Orange', hex: '#FD5E53', rgb: 'rgb(253, 94, 83)', family: 'orange' },

  // Pinks
  { name: 'Bubblegum Pink', hex: '#FF69B4', rgb: 'rgb(255, 105, 180)', family: 'pink' },
  { name: 'Rose Pink', hex: '#FF66CC', rgb: 'rgb(255, 102, 204)', family: 'pink' },
  { name: 'Cotton Candy', hex: '#FFB7D5', rgb: 'rgb(255, 183, 213)', family: 'pink' },
  { name: 'Flamingo Pink', hex: '#FC8EAC', rgb: 'rgb(252, 142, 172)', family: 'pink' },
];

type GameMode = 'match' | 'shade' | 'family';

interface ColorMatchGameProps {
  onClose: () => void;
}

export default function ColorMatchGame({ onClose }: ColorMatchGameProps) {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [targetColor, setTargetColor] = useState<Color | null>(null);
  const [options, setOptions] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize game
  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setScore(0);
    setLevel(1);
    setStreak(0);
    generateRound(mode, 1);
  };

  // Generate a new round
  const generateRound = (mode: GameMode, currentLevel: number) => {
    setSelectedColor(null);
    setIsCorrect(null);

    const numOptions = Math.min(4 + Math.floor(currentLevel / 3), 8);

    if (mode === 'match') {
      // Exact color matching
      const target = colorDatabase[Math.floor(Math.random() * colorDatabase.length)];
      const wrongColors = colorDatabase
        .filter(c => c.hex !== target.hex)
        .sort(() => Math.random() - 0.5)
        .slice(0, numOptions - 1);

      const allOptions = [target, ...wrongColors].sort(() => Math.random() - 0.5);
      setTargetColor(target);
      setOptions(allOptions);

    } else if (mode === 'shade') {
      // Match similar shades
      const families = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
      const randomFamily = families[Math.floor(Math.random() * families.length)];
      const familyColors = colorDatabase.filter(c => c.family === randomFamily);

      const target = familyColors[Math.floor(Math.random() * familyColors.length)];
      const similarShades = familyColors.filter(c => c.hex !== target.hex).slice(0, 2);
      const wrongColors = colorDatabase
        .filter(c => c.family !== randomFamily)
        .sort(() => Math.random() - 0.5)
        .slice(0, numOptions - 3);

      const allOptions = [target, ...similarShades, ...wrongColors].sort(() => Math.random() - 0.5);
      setTargetColor(target);
      setOptions(allOptions);

    } else if (mode === 'family') {
      // Match color family
      const families = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
      const randomFamily = families[Math.floor(Math.random() * families.length)];
      const familyColors = colorDatabase.filter(c => c.family === randomFamily);

      const target = familyColors[Math.floor(Math.random() * familyColors.length)];
      const correctFamily = colorDatabase
        .filter(c => c.family === randomFamily && c.hex !== target.hex)
        .sort(() => Math.random() - 0.5)
        .slice(0, numOptions - 1);

      setTargetColor(target);
      setOptions(correctFamily.sort(() => Math.random() - 0.5));
    }
  };

  // Handle color selection
  const handleColorSelect = (color: Color) => {
    if (selectedColor) return;

    setSelectedColor(color);

    let correct = false;
    if (gameMode === 'match') {
      correct = color.hex === targetColor?.hex;
    } else if (gameMode === 'shade' || gameMode === 'family') {
      correct = color.family === targetColor?.family;
    }

    setIsCorrect(correct);

    if (correct) {
      const points = 100 + (streak * 50);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);

      if (streak > 0 && streak % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }

      setTimeout(() => {
        if (score + points >= level * 500) {
          setLevel(prev => prev + 1);
          generateRound(gameMode!, level + 1);
        } else {
          generateRound(gameMode!, level);
        }
      }, 1500);
    } else {
      setStreak(0);
      setTimeout(() => {
        generateRound(gameMode!, level);
      }, 2000);
    }
  };

  // Restart game
  const restartGame = () => {
    if (gameMode) {
      startGame(gameMode);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-orange-600 z-50 flex items-center justify-center p-4 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.1})`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [1, Math.random() + 0.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <FaPalette className="text-3xl" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold baloo">Color Match</h2>
              {gameMode && (
                <p className="text-sm opacity-90">
                  {gameMode === 'match' && 'Find the Exact Color!'}
                  {gameMode === 'shade' && 'Match Similar Shades!'}
                  {gameMode === 'family' && 'Find the Color Family!'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Game Stats */}
        {gameMode && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 flex justify-between items-center">
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">Score</p>
                <motion.p
                  key={score}
                  initial={{ scale: 1.5, color: '#FFD700' }}
                  animate={{ scale: 1, color: '#000000' }}
                  className="text-2xl font-bold text-purple-600"
                >
                  {score}
                </motion.p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">Level</p>
                <p className="text-2xl font-bold text-pink-600">{level}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">Streak</p>
                <p className="text-2xl font-bold text-orange-600 flex items-center gap-1">
                  {streak} {streak > 0 && <FaStar className="text-yellow-500" />}
                </p>
              </div>
            </div>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <FaRedo /> Restart
            </button>
          </div>
        )}

        {/* Game Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!gameMode ? (
            // Mode Selection
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-8"
              >
                <h3 className="text-3xl font-bold text-gray-800 mb-2 baloo">
                  Choose Your Challenge!
                </h3>
                <p className="text-gray-600">Learn about colors in three fun ways</p>
              </motion.div>

              <div className="grid gap-6">
                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startGame('match')}
                  className="bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                >
                  <h4 className="text-2xl font-bold mb-2 baloo">🎯 Exact Match</h4>
                  <p className="text-white/90">Find the color that matches exactly!</p>
                </motion.button>

                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startGame('shade')}
                  className="bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                >
                  <h4 className="text-2xl font-bold mb-2 baloo">🌈 Shade Match</h4>
                  <p className="text-white/90">Find colors from the same family!</p>
                </motion.button>

                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startGame('family')}
                  className="bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                >
                  <h4 className="text-2xl font-bold mb-2 baloo">👨‍👩‍👧 Color Family</h4>
                  <p className="text-white/90">Match all colors in the same family!</p>
                </motion.button>
              </div>
            </div>
          ) : (
            // Game Playing
            <div className="max-w-3xl mx-auto">
              {/* Target Color */}
              {targetColor && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center mb-8"
                >
                  <p className="text-xl font-semibold text-gray-700 mb-4">
                    {gameMode === 'match' && 'Match this color:'}
                    {gameMode === 'shade' && 'Find similar shades to:'}
                    {gameMode === 'family' && 'Find colors in the same family as:'}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mx-auto w-48 h-48 rounded-3xl shadow-2xl mb-4 relative overflow-hidden"
                    style={{ backgroundColor: targetColor.hex }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  </motion.div>
                  <p className="text-2xl font-bold text-gray-800 baloo">{targetColor.name}</p>
                  <p className="text-sm text-gray-500">{targetColor.hex}</p>
                </motion.div>
              )}

              {/* Color Options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {options.map((color, index) => (
                  <motion.button
                    key={`${color.hex}-${index}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: selectedColor ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorSelect(color)}
                    disabled={selectedColor !== null}
                    className={`relative aspect-square rounded-2xl shadow-lg transition-all ${
                      selectedColor === color
                        ? isCorrect
                          ? 'ring-8 ring-green-500 scale-105'
                          : 'ring-8 ring-red-500 scale-95'
                        : 'hover:shadow-2xl'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl" />
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                      <p className="text-white font-bold text-xs bg-black/40 rounded px-2 py-1 backdrop-blur-sm">
                        {color.name}
                      </p>
                    </div>

                    {/* Feedback Icons */}
                    {selectedColor === color && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {isCorrect ? (
                          <div className="text-6xl">✓</div>
                        ) : (
                          <div className="text-6xl">✗</div>
                        )}
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Feedback Message */}
              <AnimatePresence>
                {selectedColor && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="mt-8 text-center"
                  >
                    {isCorrect ? (
                      <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-6">
                        <p className="text-3xl font-bold text-green-700 mb-2 baloo">
                          Awesome! 🎉
                        </p>
                        <p className="text-green-600">
                          You matched {selectedColor.name}! +{100 + (streak * 50)} points
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-6">
                        <p className="text-3xl font-bold text-red-700 mb-2 baloo">
                          Oops! Try Again!
                        </p>
                        <p className="text-red-600">
                          That was {selectedColor.name}. Keep practicing!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="text-center"
              >
                <FaTrophy className="text-9xl text-yellow-400 mx-auto mb-4" />
                <p className="text-5xl font-bold text-white baloo">Amazing Streak!</p>
                <p className="text-2xl text-yellow-300">You're on fire! 🔥</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
