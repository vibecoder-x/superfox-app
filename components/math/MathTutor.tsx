'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCheckCircle, FaArrowRight, FaLightbulb } from 'react-icons/fa';

interface Lesson {
  id: number;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: {
    instruction: string;
    example: string;
    hint?: string;
  }[];
}

const mathLessons: Lesson[] = [
  {
    id: 1,
    title: 'Counting 1-10',
    topic: 'counting',
    difficulty: 'easy',
    steps: [
      {
        instruction: "Let's learn to count from 1 to 10!",
        example: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10',
        hint: 'Point to each number as you say it!',
      },
      {
        instruction: 'Now count the apples!',
        example: '🍎 🍎 🍎 = 3 apples',
        hint: 'Touch each apple as you count.',
      },
    ],
  },
  {
    id: 2,
    title: 'Simple Addition',
    topic: 'addition',
    difficulty: 'easy',
    steps: [
      {
        instruction: 'Addition means putting things together!',
        example: '2 + 3 = 5',
        hint: 'You can use your fingers to help!',
      },
      {
        instruction: "Let's add with pictures!",
        example: '🐶🐶 + 🐶🐶🐶 = 5 puppies',
        hint: 'Count all the puppies together.',
      },
    ],
  },
  {
    id: 3,
    title: 'Simple Subtraction',
    topic: 'subtraction',
    difficulty: 'medium',
    steps: [
      {
        instruction: 'Subtraction means taking away!',
        example: '5 - 2 = 3',
        hint: 'Start with 5 and take away 2.',
      },
      {
        instruction: "Let's practice taking away!",
        example: '🌟🌟🌟🌟🌟 - 🌟🌟 = 🌟🌟🌟',
        hint: 'Cross out 2 stars and count what remains.',
      },
    ],
  },
];

export default function MathTutor() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentStep(0);
    setShowHint(false);
  };

  const handleNext = () => {
    if (selectedLesson && currentStep < selectedLesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    }
  };

  const handleComplete = () => {
    setSelectedLesson(null);
    setCurrentStep(0);
    setShowHint(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full">
      {!selectedLesson ? (
        <div className="grid md:grid-cols-3 gap-6">
          {mathLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer border-4 border-blue-200 hover:border-blue-400 transition-all"
              onClick={() => handleLessonSelect(lesson)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-blue-600 baloo">
                  {lesson.title}
                </h3>
                <span
                  className={`${getDifficultyColor(
                    lesson.difficulty
                  )} text-white text-xs px-3 py-1 rounded-full font-bold`}
                >
                  {lesson.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Learn {lesson.topic} with Superfox!
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {lesson.steps.length} steps
                </span>
                <FaArrowRight className="text-blue-500 text-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-blue-700 baloo mb-2">
              {selectedLesson.title}
            </h2>
            <div className="flex justify-center gap-2 mb-4">
              {selectedLesson.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-12 h-2 rounded-full ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Lesson Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 mb-6 min-h-[300px] flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {selectedLesson.steps[currentStep].instruction}
            </h3>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-8 mb-6">
              <p className="text-4xl text-center font-bold text-gray-800 baloo">
                {selectedLesson.steps[currentStep].example}
              </p>
            </div>

            {selectedLesson.steps[currentStep].hint && (
              <div className="text-center">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center gap-2 mx-auto transition-all"
                  >
                    <FaLightbulb /> Need a Hint?
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-200 border-2 border-yellow-400 rounded-xl p-4"
                  >
                    <p className="text-gray-700 font-semibold">
                      💡 {selectedLesson.steps[currentStep].hint}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleComplete}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-full transition-all"
            >
              Back to Lessons
            </button>

            {currentStep < selectedLesson.steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all"
              >
                Next <FaArrowRight />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all"
              >
                <FaCheckCircle /> Complete!
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
