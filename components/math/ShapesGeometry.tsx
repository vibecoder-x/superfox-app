'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useActivityTimer } from '@/hooks/useActivityTimer';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type ShapeLevel = '2d-shapes' | '3d-shapes' | 'shape-match' | 'symmetry';

interface Shape {
  name: string;
  emoji: string;
  sides?: number;
  type: '2d' | '3d';
}

export default function ShapesGeometry() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<ShapeLevel | null>(null);
  const { schedule } = useActivityTimer(level);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: '2d-shapes' as ShapeLevel, title: '2D Shapes', emoji: '⬛', color: 'from-teal-400 to-cyan-600' },
    { id: '3d-shapes' as ShapeLevel, title: '3D Shapes', emoji: '🎲', color: 'from-blue-400 to-indigo-600' },
    { id: 'shape-match' as ShapeLevel, title: 'Shape Matching', emoji: '🔷', color: 'from-purple-400 to-pink-600' },
    { id: 'symmetry' as ShapeLevel, title: 'Symmetry', emoji: '🦋', color: 'from-green-400 to-emerald-600' },
  ];

  const shapes2D: Shape[] = [
    { name: 'Circle', emoji: '🔵', sides: 0, type: '2d' },
    { name: 'Square', emoji: '🟦', sides: 4, type: '2d' },
    { name: 'Triangle', emoji: '🔺', sides: 3, type: '2d' },
    { name: 'Rectangle', emoji: '🟪', sides: 4, type: '2d' },
    { name: 'Pentagon', emoji: '⬟', sides: 5, type: '2d' },
    { name: 'Hexagon', emoji: '⬡', sides: 6, type: '2d' },
    { name: 'Star', emoji: '⭐', sides: 10, type: '2d' },
    { name: 'Heart', emoji: '❤️', sides: 0, type: '2d' },
  ];

  const shapes3D: Shape[] = [
    { name: 'Cube', emoji: '🎲', type: '3d' },
    { name: 'Sphere', emoji: '🏀', type: '3d' },
    { name: 'Cylinder', emoji: '🥫', type: '3d' },
    { name: 'Cone', emoji: '🍦', type: '3d' },
    { name: 'Pyramid', emoji: '🔺', type: '3d' },
  ];

  const generateQuestion = (lvl: ShapeLevel) => {
    if (lvl === '2d-shapes') {
      const shape = shapes2D[Math.floor(Math.random() * shapes2D.length)];
      setCurrentShape(shape);
      setCorrectAnswer(shape.name);

      // Create options
      const wrongOptions = shapes2D
        .filter(s => s.name !== shape.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(s => s.name);

      const allOptions = [shape.name, ...wrongOptions].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } else if (lvl === '3d-shapes') {
      const shape = shapes3D[Math.floor(Math.random() * shapes3D.length)];
      setCurrentShape(shape);
      setCorrectAnswer(shape.name);

      const wrongOptions = shapes3D
        .filter(s => s.name !== shape.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(s => s.name);

      const allOptions = [shape.name, ...wrongOptions].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } else if (lvl === 'shape-match') {
      const allShapes = [...shapes2D, ...shapes3D];
      const shape = allShapes[Math.floor(Math.random() * allShapes.length)];
      setCurrentShape(shape);
      setCorrectAnswer(shape.name);

      const wrongOptions = allShapes
        .filter(s => s.name !== shape.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(s => s.name);

      const allOptions = [shape.name, ...wrongOptions].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } else if (lvl === 'symmetry') {
      // Symmetrical shapes
      const symmetricalShapes = [
        { name: 'Circle', emoji: '🔵', type: '2d' as const },
        { name: 'Square', emoji: '🟦', type: '2d' as const },
        { name: 'Star', emoji: '⭐', type: '2d' as const },
        { name: 'Heart', emoji: '❤️', type: '2d' as const },
        { name: 'Hexagon', emoji: '⬡', type: '2d' as const },
      ];
      const shape = symmetricalShapes[Math.floor(Math.random() * symmetricalShapes.length)];
      setCurrentShape(shape);
      setCorrectAnswer('Symmetrical');
      setOptions(['Symmetrical', 'Not Symmetrical'].sort(() => Math.random() - 0.5));
    }
  };

  const startLevel = (lvl: ShapeLevel) => {
    setLevel(lvl);
    generateQuestion(lvl);
    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setShowFeedback(null);
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return; // Prevent multiple clicks

    const isCorrect = answer === correctAnswer;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 20);
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

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-teal-600 mb-4 baloo">🔷 Shapes & Geometry!</h2>
          <p className="text-xl text-gray-700 mb-8">Explore the wonderful world of shapes!</p>
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
                  {lvl.id === '2d-shapes' && 'Learn circles, squares, triangles!'}
                  {lvl.id === '3d-shapes' && 'Discover cubes, spheres, cones!'}
                  {lvl.id === 'shape-match' && 'Match shapes with their names!'}
                  {lvl.id === 'symmetry' && 'Find symmetrical shapes!'}
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
        <div className="text-8xl mb-6">🎨</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Shape Master!</h2>
        <p className="text-2xl text-gray-600 mb-6">You identified {questionsAnswered} shapes correctly!</p>
        <p className="text-3xl font-bold text-teal-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-teal-400 to-cyan-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="text-2xl font-bold text-teal-600">Score: {score}</div>
          <div className="text-2xl font-bold text-cyan-600">Shapes: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💎' : '🖤'}</span>
          ))}
        </div>
      </div>

      {currentShape && (
        <motion.div key={currentShape.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl p-6 sm:p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">
              {level === 'symmetry' ? 'Is this shape symmetrical?' : 'What shape is this?'}
            </h3>

            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="text-9xl"
            >
              {currentShape.name === 'Rectangle' ? (
                <div role="img" aria-label="A shape with four right angles and longer horizontal sides" className="w-40 h-24 bg-purple-500 border-4 border-purple-700 mx-auto" />
              ) : currentShape.name === 'Pyramid' ? (
                <svg role="img" aria-label="A solid shape with a pointed top and triangular faces" viewBox="0 0 180 140" className="w-44 mx-auto">
                  <path d="M90 10 L15 108 L90 132 Z" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
                  <path d="M90 10 L90 132 L165 108 Z" fill="#fb923c" stroke="#9a3412" strokeWidth="3" />
                  <path d="M15 108 L165 108" fill="none" stroke="#9a3412" strokeWidth="2" strokeDasharray="5 4" />
                </svg>
              ) : currentShape.emoji}
            </motion.div>

            {currentShape.sides !== undefined && currentShape.sides > 0 && level !== 'symmetry' && (
              <p className="text-xl text-gray-600">This shape has {currentShape.sides} sides</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback !== null}
                  className={`bg-white border-4 border-teal-500 hover:bg-teal-50 text-gray-800 font-bold py-6 px-8 rounded-2xl text-2xl transition-all hover:scale-105 disabled:opacity-50 ${
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
                {showFeedback === 'correct' ? '✅ Correct!' : `❌ It\'s a ${correctAnswer}!`}
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
