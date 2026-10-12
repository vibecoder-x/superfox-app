'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { updateMathProgress } from '@/lib/math-progress';
import { numericOptions } from '@/lib/math-questions';
import { useActivityTimer } from '@/hooks/useActivityTimer';
import { FaCheck, FaTimes, FaStar } from 'react-icons/fa';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type GameType = 'counting' | 'matching' | 'sequencing';

const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍒', '🥝', '🍑', '🍍'];

export default function NumberGames() {
  const [gameType, setGameType] = useState<GameType>('counting');
  const { schedule } = useActivityTimer(gameType);
  const [score, setScore] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { playAudio } = useAudio();

  // Counting Game State
  const [countingItems, setCountingItems] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const answerFocus = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { if (selectedCount === null && answerFocus.current?.isConnected) answerFocus.current.focus(); }, [selectedCount]);

  // Matching Game State
  const [numberToMatch, setNumberToMatch] = useState(0);
  const [matchingOptions, setMatchingOptions] = useState<number[]>([]);

  // Sequencing Game State
  const [sequenceNumbers, setSequenceNumbers] = useState<number[]>([]);
  const [missingIndex, setMissingIndex] = useState(0);
  const [sequenceOptions, setSequenceOptions] = useState<number[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      generateNewGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType, isClient]);

  const generateNewGame = () => {
    setSelectedCount(null);

    if (gameType === 'counting') {
      const count = Math.floor(Math.random() * 10) + 1;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      setCountingItems(Array(count).fill(emoji));
      setCorrectCount(count);
    } else if (gameType === 'matching') {
      const num = Math.floor(Math.random() * 10) + 1;
      setNumberToMatch(num);
      setMatchingOptions(numericOptions(num));
    } else if (gameType === 'sequencing') {
      const start = Math.floor(Math.random() * 5) + 1;
      const sequence = [start, start + 1, start + 2, start + 3, start + 4];
      const missing = Math.floor(Math.random() * 5);
      setMissingIndex(missing);
      setSequenceNumbers(sequence);

      setSequenceOptions(numericOptions(sequence[missing], 3));
    }
  };

  const saveGameStats = (points: number) => {
    updateMathProgress(current => ({
      ...current, gamesPlayed: current.gamesPlayed + 1,
      starsEarned: current.starsEarned + 1, totalScore: current.totalScore + points,
      lastActivity: new Date().toLocaleDateString(),
    }));
  };

  const handleCountingAnswer = (count: number) => {
    if (selectedCount !== null) return;
    setSelectedCount(count);
    if (count === correctCount) {
      const newScore = score + 5;
      setScore(newScore);
      saveGameStats(5);
      playAudio(getRandomAudio(mathAudioFiles.correct));
      schedule(() => generateNewGame(), 1500);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      schedule(() => setSelectedCount(null), 1500);
    }
  };

  const handleMatchingAnswer = (count: number) => {
    if (selectedCount !== null) return;
    setSelectedCount(count);
    if (count === numberToMatch) {
      const newScore = score + 5;
      setScore(newScore);
      saveGameStats(5);
      playAudio(getRandomAudio(mathAudioFiles.correct));
      schedule(() => generateNewGame(), 1500);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      schedule(() => setSelectedCount(null), 1500);
    }
  };

  const handleSequencingAnswer = (num: number) => {
    if (selectedCount !== null) return;
    setSelectedCount(num);
    if (num === sequenceNumbers[missingIndex]) {
      const newScore = score + 5;
      setScore(newScore);
      saveGameStats(5);
      playAudio(getRandomAudio(mathAudioFiles.correct));
      schedule(() => generateNewGame(), 1500);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      schedule(() => setSelectedCount(null), 1500);
    }
  };

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-2xl text-gray-500">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Game Type Selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => setGameType('counting')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            gameType === 'counting'
              ? 'bg-green-500 text-white shadow-lg scale-110'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🔢 Counting
        </button>
        <button
          onClick={() => setGameType('matching')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            gameType === 'matching'
              ? 'bg-green-500 text-white shadow-lg scale-110'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🎯 Matching
        </button>
        <button
          onClick={() => setGameType('sequencing')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            gameType === 'sequencing'
              ? 'bg-green-500 text-white shadow-lg scale-110'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🔄 Sequencing
        </button>
      </div>

      {/* Score Display */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-full px-8 py-3 shadow-lg flex items-center gap-2">
          <FaStar className="text-yellow-400 text-2xl" />
          <span className="text-2xl font-bold text-gray-800">Score: {score}</span>
        </div>
      </div>

      {/* Counting Game */}
      {gameType === 'counting' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-4 md:p-8 shadow-2xl"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-6 baloo">
            How many items do you see?
          </h3>

          {/* Items to Count */}
          <div className="bg-white rounded-2xl p-4 md:p-8 mb-6 min-h-[200px] flex flex-wrap justify-center items-center gap-4">
            {countingItems.map((item, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-6xl"
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => {
              const num = i + 1;
              const isSelected = selectedCount === num;
              const isCorrect = num === correctCount;
              const showFeedback = isSelected;

              return (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={event => { answerFocus.current = event.currentTarget; handleCountingAnswer(num); }}
                  disabled={selectedCount !== null}
                  className={`py-4 px-6 rounded-xl text-2xl font-bold transition-all ${
                    showFeedback && isCorrect
                      ? 'bg-green-500 text-white'
                      : showFeedback && !isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-800 hover:bg-blue-100'
                  }`}
                >
                  {num}
                  {showFeedback && isCorrect && <FaCheck className="inline ml-2" />}
                  {showFeedback && !isCorrect && <FaTimes className="inline ml-2" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Matching Game */}
      {gameType === 'matching' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-4 md:p-8 shadow-2xl"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-6 baloo">
            Count the items and match!
          </h3>

          {/* Items Display */}
          <div className="bg-white rounded-2xl p-4 md:p-8 mb-6 min-h-[200px] flex flex-wrap justify-center items-center gap-3">
            {[...Array(numberToMatch)].map((_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-6xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {matchingOptions.map((option) => {
              const isSelected = selectedCount === option;
              const isCorrect = option === numberToMatch;
              const showFeedback = isSelected;

              return (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={event => { answerFocus.current = event.currentTarget; handleMatchingAnswer(option); }}
                  disabled={selectedCount !== null}
                  className={`py-6 px-8 rounded-2xl text-3xl font-bold transition-all ${
                    showFeedback && isCorrect
                      ? 'bg-green-500 text-white'
                      : showFeedback && !isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-800 hover:bg-yellow-100'
                  }`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Sequencing Game */}
      {gameType === 'sequencing' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-4 md:p-8 shadow-2xl"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-6 baloo">
            What number is missing?
          </h3>

          {/* Number Sequence */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {sequenceNumbers.map((num, index) => (
              <div
                key={index}
                className={`w-20 h-20 flex items-center justify-center rounded-xl text-3xl font-bold ${
                  index === missingIndex
                    ? 'bg-gray-300 border-4 border-dashed border-gray-500'
                    : 'bg-white border-4 border-purple-400'
                }`}
              >
                {index === missingIndex ? '?' : num}
              </div>
            ))}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-3 gap-4">
            {sequenceOptions.map((option) => {
              const isSelected = selectedCount === option;
              const isCorrect = option === sequenceNumbers[missingIndex];
              const showFeedback = isSelected;

              return (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={event => { answerFocus.current = event.currentTarget; handleSequencingAnswer(option); }}
                  disabled={selectedCount !== null}
                  className={`py-6 px-8 rounded-2xl text-3xl font-bold transition-all ${
                    showFeedback && isCorrect
                      ? 'bg-green-500 text-white'
                      : showFeedback && !isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-800 hover:bg-purple-100'
                  }`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
