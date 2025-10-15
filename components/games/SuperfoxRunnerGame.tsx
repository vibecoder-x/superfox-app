'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar, FaTrophy, FaRedo, FaBolt, FaHeart } from 'react-icons/fa';
import Image from 'next/image';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'obstacle' | 'coin' | 'powerup';
}

type GameMode = 'sahara' | 'space' | 'forest';

interface ModeConfig {
  name: string;
  emoji: string;
  bgColor: string;
  groundColor: string;
  obstacleColor: string;
  description: string;
}

const GAME_MODES: Record<GameMode, ModeConfig> = {
  sahara: {
    name: 'Sahara Desert',
    emoji: '🏜️',
    bgColor: ['#FFD700', '#FFA500'],
    groundColor: '#D2691E',
    obstacleColor: '#8B4513',
    description: 'Jump over cacti and scorpions in the hot desert!',
  },
  space: {
    name: 'Space Adventure',
    emoji: '🚀',
    bgColor: ['#1a1a2e', '#16213e'],
    groundColor: '#0f3460',
    obstacleColor: '#e94560',
    description: 'Dodge asteroids and collect stars in outer space!',
  },
  forest: {
    name: 'Magical Forest',
    emoji: '🌲',
    bgColor: ['#2ecc71', '#27ae60'],
    groundColor: '#229954',
    obstacleColor: '#1e8449',
    description: 'Run through the enchanted forest and avoid obstacles!',
  },
};

interface SuperfoxRunnerGameProps {
  onClose: () => void;
}

export default function SuperfoxRunnerGame({ onClose }: SuperfoxRunnerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'modeSelect' | 'playing' | 'paused' | 'gameover'>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [speed, setSpeed] = useState(4);
  const [isPowerUp, setIsPowerUp] = useState(false);

  // Game state refs
  const gameLoopRef = useRef<number>();
  const foxImageRef = useRef<HTMLImageElement | null>(null);
  const playerRef = useRef({
    x: 100,
    y: 300,
    width: 60,
    height: 60,
    velocityY: 0,
    isJumping: false,
    jumpPower: -15,
    gravity: 0.8,
  });
  const objectsRef = useRef<GameObject[]>([]);
  const groundY = 350;

  // Load fox image
  useEffect(() => {
    const img = new window.Image();
    img.src = '/images/superfox-runner.png';
    img.onload = () => {
      foxImageRef.current = img;
    };
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    playerRef.current = {
      x: 100,
      y: 300,
      width: 60,
      height: 60,
      velocityY: 0,
      isJumping: false,
      jumpPower: -15,
      gravity: 0.8,
    };
    objectsRef.current = [];
    setScore(0);
    setLives(3);
    setSpeed(4);
    setIsPowerUp(false);
  }, []);

  // Jump function
  const jump = useCallback(() => {
    if (!playerRef.current.isJumping && gameState === 'playing') {
      playerRef.current.velocityY = playerRef.current.jumpPower;
      playerRef.current.isJumping = true;
    }
  }, [gameState]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Spawn objects
  const spawnObject = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rand = Math.random();
    let type: 'obstacle' | 'coin' | 'powerup';
    let y: number;
    let height: number;

    if (rand < 0.5) {
      // Obstacle
      type = 'obstacle';
      height = 40 + Math.random() * 30;
      y = groundY - height;
    } else if (rand < 0.9) {
      // Coin
      type = 'coin';
      height = 20;
      y = groundY - 100 - Math.random() * 100;
    } else {
      // Power-up
      type = 'powerup';
      height = 30;
      y = groundY - 120;
    }

    objectsRef.current.push({
      x: canvas.width,
      y,
      width: type === 'coin' ? 20 : type === 'powerup' ? 30 : 30 + Math.random() * 40,
      height,
      type,
    });
  }, [groundY]);

  // Check collision
  const checkCollision = useCallback((player: typeof playerRef.current, obj: GameObject) => {
    return (
      player.x < obj.x + obj.width &&
      player.x + player.width > obj.x &&
      player.y < obj.y + obj.height &&
      player.y + player.height > obj.y
    );
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let lastSpawnTime = 0;
    let frameCount = 0;

    const gameLoop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background based on mode
      const mode = selectedMode ? GAME_MODES[selectedMode] : GAME_MODES.forest;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, mode.bgColor[0]);
      gradient.addColorStop(1, mode.bgColor[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = mode.groundColor;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

      // Ground decoration
      ctx.fillStyle = mode.obstacleColor;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.fillRect(i - (frameCount * (speed / 2)) % 50, groundY, 40, 10);
      }

      // Update player
      const player = playerRef.current;
      player.velocityY += player.gravity;
      player.y += player.velocityY;

      // Ground collision
      if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.velocityY = 0;
        player.isJumping = false;
      }

      // Draw player (Superfox using image)
      ctx.save();

      // Power-up glow effect
      if (isPowerUp) {
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Superfox image
      if (foxImageRef.current) {
        // Add slight bounce animation
        const bounceOffset = Math.sin(frameCount * 0.2) * 3;

        if (isPowerUp) {
          // Add golden tint filter for power-up
          ctx.globalAlpha = 1;
          ctx.filter = 'brightness(1.3) saturate(1.5)';
        }

        ctx.drawImage(
          foxImageRef.current,
          player.x,
          player.y + bounceOffset,
          player.width,
          player.height
        );

        ctx.filter = 'none';
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      // Spawn objects
      if (Date.now() - lastSpawnTime > 1500 - speed * 50) {
        spawnObject();
        lastSpawnTime = Date.now();
      }

      // Update and draw objects
      objectsRef.current = objectsRef.current.filter((obj) => {
        obj.x -= speed;

        // Draw object based on mode
        const mode = selectedMode ? GAME_MODES[selectedMode] : GAME_MODES.forest;
        if (obj.type === 'obstacle') {
          // Draw themed obstacle
          ctx.fillStyle = mode.obstacleColor;
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          ctx.fillStyle = mode.groundColor;
          ctx.fillRect(obj.x + 5, obj.y + 10, Math.max(obj.width - 10, 5), Math.max(obj.height - 10, 5));
        } else if (obj.type === 'coin') {
          // Spinning coin
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(obj.x + 10, obj.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFA500';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Star inside
          ctx.fillStyle = '#FFA500';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('★', obj.x + 10, obj.y + 14);
        } else if (obj.type === 'powerup') {
          // Lightning power-up
          ctx.fillStyle = '#3498db';
          ctx.beginPath();
          ctx.arc(obj.x + 15, obj.y + 15, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFD700';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('⚡', obj.x + 15, obj.y + 22);
        }

        // Check collision
        if (checkCollision(player, obj)) {
          if (obj.type === 'obstacle') {
            if (!isPowerUp) {
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                  setGameState('gameover');
                  setHighScore(prev => Math.max(prev, score));
                }
                return newLives;
              });
            }
            return false;
          } else if (obj.type === 'coin') {
            setScore(prev => prev + 10);
            return false;
          } else if (obj.type === 'powerup') {
            setIsPowerUp(true);
            setTimeout(() => setIsPowerUp(false), 5000);
            return false;
          }
        }

        return obj.x + obj.width > 0;
      });

      // Increase speed gradually
      if (frameCount % 300 === 0) {
        setSpeed(prev => Math.min(prev + 0.5, 12));
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, speed, isPowerUp, score, groundY, spawnObject, checkCollision]);

  // Start game
  const startGame = (mode: GameMode) => {
    setSelectedMode(mode);
    initGame();
    setGameState('playing');
  };

  // Restart game
  const restartGame = () => {
    initGame();
    setGameState('playing');
  };

  // Show mode selection
  const showModeSelection = () => {
    setGameState('modeSelect');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 z-50 flex items-center justify-center p-4 overflow-hidden"
    >
      {/* Animated Background Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-200 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col relative z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🦊</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold baloo">Superfox Runner</h2>
              <p className="text-sm opacity-90">Jump and collect coins!</p>
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
        {gameState !== 'menu' && gameState !== 'modeSelect' && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 flex justify-between items-center">
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">Score</p>
                <motion.p
                  key={score}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-orange-600"
                >
                  {score}
                </motion.p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">High Score</p>
                <p className="text-2xl font-bold text-purple-600">{highScore}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">Speed</p>
                <p className="text-2xl font-bold text-blue-600">{speed.toFixed(1)}x</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <FaHeart
                  key={i}
                  className={`text-2xl ${i < lives ? 'text-red-500' : 'text-gray-300'}`}
                />
              ))}
              {isPowerUp && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <FaBolt className="text-3xl text-yellow-500" />
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Game Content */}
        <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-green-50">
          {gameState === 'menu' ? (
            <div className="text-center max-w-2xl">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-9xl mb-8"
              >
                🦊
              </motion.div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4 baloo">
                Superfox Runner
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Help Superfox run and jump! Collect coins and avoid obstacles!
              </p>

              <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
                <h4 className="text-2xl font-bold mb-4 text-gray-800 baloo">How to Play</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">⌨️</span>
                    <div>
                      <p className="font-bold text-gray-800">Press SPACE</p>
                      <p className="text-sm text-gray-600">or tap to jump</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🪙</span>
                    <div>
                      <p className="font-bold text-gray-800">Collect Coins</p>
                      <p className="text-sm text-gray-600">+10 points each</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">⚡</span>
                    <div>
                      <p className="font-bold text-gray-800">Power-ups</p>
                      <p className="text-sm text-gray-600">Invincibility!</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={showModeSelection}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-xl hover:shadow-2xl transition-all baloo"
              >
                Choose Mode! 🚀
              </motion.button>
            </div>
          ) : gameState === 'modeSelect' ? (
            <div className="text-center max-w-4xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-7xl mb-6"
              >
                🎮
              </motion.div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4 baloo">
                Choose Your Adventure!
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Select a game mode and start running!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {(Object.keys(GAME_MODES) as GameMode[]).map((modeKey, index) => {
                  const mode = GAME_MODES[modeKey];
                  return (
                    <motion.button
                      key={modeKey}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startGame(modeKey)}
                      className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-orange-400"
                      style={{
                        background: `linear-gradient(135deg, ${mode.bgColor[0]}, ${mode.bgColor[1]})`,
                      }}
                    >
                      <div className="text-8xl mb-4">{mode.emoji}</div>
                      <h4 className="text-2xl font-bold text-white mb-3 baloo drop-shadow-lg">
                        {mode.name}
                      </h4>
                      <p className="text-white/90 text-sm drop-shadow">
                        {mode.description}
                      </p>

                      {/* Difficulty badge */}
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                        {index === 0 ? 'EASY' : index === 1 ? 'MEDIUM' : 'HARD'}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameState('menu')}
                className="text-gray-600 hover:text-gray-800 font-semibold underline"
              >
                ← Back to Menu
              </motion.button>
            </div>
          ) : gameState === 'gameover' ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-8xl mb-6"
              >
                😢
              </motion.div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4 baloo">Game Over!</h3>
              <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg inline-block">
                <p className="text-6xl font-bold text-orange-600 mb-2">{score}</p>
                <p className="text-xl text-gray-600">Final Score</p>
                {score >= highScore && score > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4 text-yellow-500"
                  >
                    <FaTrophy className="text-4xl mx-auto mb-2" />
                    <p className="font-bold">New High Score!</p>
                  </motion.div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto baloo"
              >
                <FaRedo /> Play Again!
              </motion.button>
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                onClick={jump}
                className="border-4 border-orange-500 rounded-2xl shadow-2xl cursor-pointer bg-white"
              />
              <div className="text-center mt-4 text-gray-600">
                <p className="text-sm">Press SPACE or click to jump!</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
