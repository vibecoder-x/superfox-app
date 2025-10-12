'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRocket, FaTimes, FaStar } from 'react-icons/fa';

type Planet = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  size: number;
  distanceFromSun: number;
  funFacts: string[];
  dayLength: string;
  yearLength: string;
  moons: number;
  type: string;
};

const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    emoji: '☿️',
    color: 'from-gray-400 to-gray-600',
    size: 40,
    distanceFromSun: 58,
    funFacts: [
      'Closest planet to the Sun!',
      'Has no atmosphere, so no wind or weather',
      'One side is super hot, the other super cold',
      'Named after the Roman messenger god'
    ],
    dayLength: '59 Earth days',
    yearLength: '88 Earth days',
    moons: 0,
    type: 'Rocky Planet'
  },
  {
    id: 'venus',
    name: 'Venus',
    emoji: '♀️',
    color: 'from-yellow-300 to-orange-500',
    size: 95,
    distanceFromSun: 108,
    funFacts: [
      'Hottest planet in our solar system!',
      'Spins backwards compared to other planets',
      'Has clouds made of sulfuric acid',
      'Named after the Roman goddess of love'
    ],
    dayLength: '243 Earth days',
    yearLength: '225 Earth days',
    moons: 0,
    type: 'Rocky Planet'
  },
  {
    id: 'earth',
    name: 'Earth',
    emoji: '🌍',
    color: 'from-blue-400 to-green-500',
    size: 100,
    distanceFromSun: 150,
    funFacts: [
      'Our home planet!',
      'Only planet with liquid water on surface',
      '71% covered by oceans',
      'Perfect distance from Sun for life'
    ],
    dayLength: '24 hours',
    yearLength: '365 days',
    moons: 1,
    type: 'Rocky Planet'
  },
  {
    id: 'mars',
    name: 'Mars',
    emoji: '♂️',
    color: 'from-red-400 to-red-700',
    size: 53,
    distanceFromSun: 228,
    funFacts: [
      'Called the Red Planet!',
      'Has the largest volcano in the solar system',
      'Has polar ice caps like Earth',
      'May have had water billions of years ago'
    ],
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    moons: 2,
    type: 'Rocky Planet'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    emoji: '♃',
    color: 'from-orange-300 to-red-500',
    size: 280,
    distanceFromSun: 778,
    funFacts: [
      'Largest planet in our solar system!',
      'Great Red Spot is a giant storm',
      'Has 79 known moons!',
      'Made mostly of gas'
    ],
    dayLength: '10 hours',
    yearLength: '12 Earth years',
    moons: 79,
    type: 'Gas Giant'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    emoji: '♄',
    color: 'from-yellow-200 to-yellow-500',
    size: 235,
    distanceFromSun: 1427,
    funFacts: [
      'Famous for beautiful rings!',
      'Rings are made of ice and rock',
      'Could float in water (if there was a big enough ocean)!',
      'Has 82 known moons'
    ],
    dayLength: '10.7 hours',
    yearLength: '29 Earth years',
    moons: 82,
    type: 'Gas Giant'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    emoji: '♅',
    color: 'from-cyan-300 to-blue-500',
    size: 127,
    distanceFromSun: 2871,
    funFacts: [
      'Rotates on its side!',
      'Coldest planet in our solar system',
      'Made of ice and gas',
      'Has faint rings'
    ],
    dayLength: '17 hours',
    yearLength: '84 Earth years',
    moons: 27,
    type: 'Ice Giant'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    emoji: '♆',
    color: 'from-blue-500 to-indigo-700',
    size: 123,
    distanceFromSun: 4495,
    funFacts: [
      'Farthest planet from the Sun!',
      'Has the strongest winds in the solar system',
      'Named after the Roman god of the sea',
      'Takes 165 Earth years to orbit the Sun'
    ],
    dayLength: '16 hours',
    yearLength: '165 Earth years',
    moons: 14,
    type: 'Ice Giant'
  }
];

const solarSystemFacts = [
  'The Sun contains 99.8% of all the mass in our solar system!',
  'The solar system formed 4.6 billion years ago',
  'All planets orbit the Sun in the same direction',
  'There are 5 dwarf planets including Pluto',
  'Asteroids are rocky objects that orbit the Sun',
  'Comets are icy objects that develop tails near the Sun'
];

export default function SpaceExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [showSolarSystem, setShowSolarSystem] = useState(true);
  const [score, setScore] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const quizQuestions = [
    {
      question: 'Which planet is closest to the Sun?',
      options: ['Mercury', 'Venus', 'Earth', 'Mars'],
      correct: 'Mercury'
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correct: 'Mars'
    },
    {
      question: 'Which planet has beautiful rings?',
      options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      correct: 'Saturn'
    },
    {
      question: 'Which planet is the largest?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      correct: 'Jupiter'
    },
    {
      question: 'How many planets are in our solar system?',
      options: ['7', '8', '9', '10'],
      correct: '8'
    }
  ];

  const handleAnswer = (answer: string) => {
    if (answer === quizQuestions[currentQuestion].correct) {
      setScore(score + 20);
    }
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizMode(false);
      setCurrentQuestion(0);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold text-purple-600 mb-2 baloo flex items-center justify-center gap-3">
          <FaRocket className="text-6xl" /> Space Explorer
        </h1>
        <p className="text-xl text-gray-700">Explore the amazing planets in our solar system!</p>
        <div className="mt-4 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSolarSystem(!showSolarSystem)}
            className="px-6 py-3 bg-purple-500 text-white rounded-full font-bold"
          >
            {showSolarSystem ? '📋 Learn Mode' : '🌌 Solar System'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setQuizMode(!quizMode);
              setCurrentQuestion(0);
            }}
            className="px-6 py-3 bg-yellow-500 text-white rounded-full font-bold"
          >
            🧠 Take Quiz
          </motion.button>
        </div>
        {score > 0 && (
          <div className="mt-4 inline-block bg-yellow-100 border-2 border-yellow-400 rounded-full px-6 py-2">
            <span className="text-2xl font-bold text-yellow-700">⭐ Score: {score}</span>
          </div>
        )}
      </motion.div>

      {/* Quiz Mode */}
      {quizMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
        >
          <h3 className="text-3xl font-bold text-purple-600 mb-6 text-center">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </h3>
          <p className="text-2xl text-gray-800 mb-8 text-center">
            {quizQuestions[currentQuestion].question}
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(option)}
                className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white font-bold py-6 px-8 rounded-2xl text-xl hover:shadow-xl"
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Solar System View */}
      {showSolarSystem && !quizMode && (
        <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-black rounded-3xl p-8 mb-8 relative overflow-hidden min-h-[600px]">
          {/* Stars Background */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Sun */}
          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity
            }}
          >
            <div className="text-9xl filter drop-shadow-2xl">☀️</div>
          </motion.div>

          {/* Planets */}
          <div className="relative z-10 flex items-center justify-around h-[500px] pl-32">
            {planets.map((planet, index) => (
              <motion.div
                key={planet.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedPlanet(planet)}
                className="cursor-pointer relative group"
                style={{
                  width: planet.size,
                  height: planet.size
                }}
              >
                <motion.div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${planet.color} shadow-2xl flex items-center justify-center text-4xl`}
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2 + index * 0.5,
                    repeat: Infinity
                  }}
                >
                  {planet.emoji}
                </motion.div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {planet.name}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solar System Facts */}
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-2xl p-4">
            <motion.p
              key={Math.floor(Date.now() / 5000)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white text-center text-lg"
            >
              💡 {solarSystemFacts[Math.floor(Date.now() / 5000) % solarSystemFacts.length]}
            </motion.p>
          </div>
        </div>
      )}

      {/* Planet Grid View */}
      {!showSolarSystem && !quizMode && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planets.map((planet, index) => (
            <motion.div
              key={planet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => setSelectedPlanet(planet)}
              className={`bg-gradient-to-br ${planet.color} rounded-3xl p-6 cursor-pointer shadow-xl hover:shadow-2xl`}
            >
              <div className="text-center text-white">
                <div className="text-7xl mb-4">{planet.emoji}</div>
                <h3 className="text-2xl font-bold mb-2 baloo">{planet.name}</h3>
                <p className="text-sm opacity-90 mb-2">{planet.type}</p>
                <div className="text-xs space-y-1">
                  <div>🌙 Moons: {planet.moons}</div>
                  <div>⏱️ Day: {planet.dayLength}</div>
                  <div>📅 Year: {planet.yearLength}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Planet Detail Modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-gradient-to-br ${selectedPlanet.color} rounded-3xl p-8 max-w-2xl w-full relative`}
            >
              <button
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-4 right-4 text-white text-3xl hover:scale-110 transition-transform"
              >
                <FaTimes />
              </button>

              <div className="text-center text-white">
                <div className="text-9xl mb-6">{selectedPlanet.emoji}</div>
                <h2 className="text-5xl font-bold mb-4 baloo">{selectedPlanet.name}</h2>
                <p className="text-2xl mb-6 opacity-90">{selectedPlanet.type}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-lg">
                  <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <div className="font-bold">Distance from Sun</div>
                    <div>{selectedPlanet.distanceFromSun} million km</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <div className="font-bold">Number of Moons</div>
                    <div>{selectedPlanet.moons}</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <div className="font-bold">Day Length</div>
                    <div>{selectedPlanet.dayLength}</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-4">
                    <div className="font-bold">Year Length</div>
                    <div>{selectedPlanet.yearLength}</div>
                  </div>
                </div>

                <div className="text-left bg-white bg-opacity-20 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FaStar /> Fun Facts
                  </h3>
                  <ul className="space-y-2">
                    {selectedPlanet.funFacts.map((fact, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✨</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
