'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAudio, mathAudioFiles, getRandomAudio } from '@/hooks/useAudio';

type ProblemLevel = 'addition-stories' | 'subtraction-stories' | 'multiplication-stories' | 'mixed-stories';

interface WordProblem {
  story: string;
  answer: number;
  emoji: string;
}

export default function WordProblems() {
  const { playAudio } = useAudio();
  const [level, setLevel] = useState<ProblemLevel | null>(null);
  const [currentProblem, setCurrentProblem] = useState<WordProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [lives, setLives] = useState(5);

  const levels = [
    { id: 'addition-stories' as ProblemLevel, title: 'Addition Stories', emoji: '➕', color: 'from-green-400 to-emerald-600' },
    { id: 'subtraction-stories' as ProblemLevel, title: 'Subtraction Stories', emoji: '➖', color: 'from-blue-400 to-cyan-600' },
    { id: 'multiplication-stories' as ProblemLevel, title: 'Times Stories', emoji: '✖️', color: 'from-purple-400 to-pink-600' },
    { id: 'mixed-stories' as ProblemLevel, title: 'Mixed Stories', emoji: '📚', color: 'from-orange-400 to-red-600' },
  ];

  const generateAdditionStory = (): WordProblem => {
    const templates = [
      { story: (a: number, b: number) => `Emma has ${a} apples. Her friend gives her ${b} more apples. How many apples does Emma have now?`, emoji: '🍎' },
      { story: (a: number, b: number) => `There are ${a} birds in a tree. ${b} more birds fly in. How many birds are there total?`, emoji: '🐦' },
      { story: (a: number, b: number) => `Tom has ${a} toy cars. He gets ${b} more for his birthday. How many toy cars does he have?`, emoji: '🚗' },
      { story: (a: number, b: number) => `Sarah read ${a} books in June and ${b} books in July. How many books did she read in total?`, emoji: '📚' },
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;

    return {
      story: template.story(a, b),
      answer: a + b,
      emoji: template.emoji,
    };
  };

  const generateSubtractionStory = (): WordProblem => {
    const templates = [
      { story: (a: number, b: number) => `Jake has ${a} candies. He eats ${b} candies. How many candies does he have left?`, emoji: '🍬' },
      { story: (a: number, b: number) => `There are ${a} cookies on a plate. ${b} cookies are eaten. How many cookies are left?`, emoji: '🍪' },
      { story: (a: number, b: number) => `A tree has ${a} leaves. ${b} leaves fall off. How many leaves are still on the tree?`, emoji: '🍃' },
      { story: (a: number, b: number) => `Lily has ${a} stickers. She gives ${b} stickers to her friend. How many stickers does she have now?`, emoji: '⭐' },
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const a = Math.floor(Math.random() * 30) + 10;
    const b = Math.floor(Math.random() * (a - 1)) + 1;

    return {
      story: template.story(a, b),
      answer: a - b,
      emoji: template.emoji,
    };
  };

  const generateMultiplicationStory = (): WordProblem => {
    const templates = [
      { story: (a: number, b: number) => `There are ${a} boxes. Each box has ${b} balls. How many balls are there in total?`, emoji: '⚽' },
      { story: (a: number, b: number) => `A spider has ${a} legs. If there are ${b} spiders, how many legs in total?`, emoji: '🕷️' },
      { story: (a: number, b: number) => `${a} children each have ${b} pencils. How many pencils are there altogether?`, emoji: '✏️' },
      { story: (a: number, b: number) => `There are ${a} rows of chairs. Each row has ${b} chairs. How many chairs total?`, emoji: '🪑' },
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 10) + 1;

    return {
      story: template.story(a, b),
      answer: a * b,
      emoji: template.emoji,
    };
  };

  const generateQuestion = (lvl: ProblemLevel) => {
    let problem: WordProblem;

    if (lvl === 'addition-stories') {
      problem = generateAdditionStory();
    } else if (lvl === 'subtraction-stories') {
      problem = generateSubtractionStory();
    } else if (lvl === 'multiplication-stories') {
      problem = generateMultiplicationStory();
    } else {
      const types = [generateAdditionStory, generateSubtractionStory, generateMultiplicationStory];
      problem = types[Math.floor(Math.random() * types.length)]();
    }

    setCurrentProblem(problem);
  };

  const startLevel = (lvl: ProblemLevel) => {
    setLevel(lvl);
    generateQuestion(lvl);
    setScore(0);
    setQuestionsAnswered(0);
    setLives(5);
    setUserAnswer('');
    setShowFeedback(null);
  };

  const handleSubmit = () => {
    if (!currentProblem || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playAudio(getRandomAudio(mathAudioFiles.correct));
      setScore(score + 25);
      setQuestionsAnswered(questionsAnswered + 1);

      setTimeout(() => {
        if (level) generateQuestion(level);
        setUserAnswer('');
        setShowFeedback(null);
      }, 2000);
    } else {
      playAudio(getRandomAudio(mathAudioFiles.incorrect));
      setLives(lives - 1);

      if (lives - 1 <= 0) {
        setTimeout(() => {
          setLevel(null);
        }, 2000);
      } else {
        setTimeout(() => {
          setUserAnswer('');
          setShowFeedback(null);
        }, 2000);
      }
    }
  };

  if (!level) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-5xl font-bold text-purple-600 mb-4 baloo">📖 Word Problems!</h2>
          <p className="text-xl text-gray-700 mb-8">Solve real-life math stories!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {levels.map((lvl, index) => (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => startLevel(lvl.id)}
              className={`bg-gradient-to-br ${lvl.color} rounded-3xl p-8 cursor-pointer shadow-xl hover:shadow-2xl transition-all`}
            >
              <div className="text-center text-white">
                <div className="text-7xl mb-4">{lvl.emoji}</div>
                <h3 className="text-3xl font-bold mb-2 baloo">{lvl.title}</h3>
                <p className="text-lg opacity-90">
                  {lvl.id === 'addition-stories' && 'Stories about adding!'}
                  {lvl.id === 'subtraction-stories' && 'Stories about taking away!'}
                  {lvl.id === 'multiplication-stories' && 'Stories about groups!'}
                  {lvl.id === 'mixed-stories' && 'All types of stories!'}
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 text-center shadow-2xl">
        <div className="text-8xl mb-6">📚</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4 baloo">Story Solver!</h2>
        <p className="text-2xl text-gray-600 mb-6">You solved {questionsAnswered} word problems!</p>
        <p className="text-3xl font-bold text-purple-600 mb-8">Score: {score} points ⭐</p>
        <button onClick={() => setLevel(null)} className="bg-gradient-to-r from-purple-400 to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl hover:scale-105 transition-transform">
          Try Another Level! 🔄
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="text-2xl font-bold text-purple-600">Score: {score}</div>
          <div className="text-2xl font-bold text-pink-600">Solved: {questionsAnswered}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-3xl">{i < lives ? '💜' : '🖤'}</span>
          ))}
        </div>
      </div>

      {currentProblem && (
        <motion.div key={currentProblem.story} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 shadow-2xl">
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">Read and Solve!</h3>

            <div className="text-8xl mb-4">{currentProblem.emoji}</div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-2xl text-gray-800 leading-relaxed">{currentProblem.story}</p>
            </div>

            <div className="space-y-4">
              <p className="text-xl font-bold text-gray-700">What is the answer?</p>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-48 text-5xl text-center font-bold border-4 border-purple-500 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-purple-300"
                placeholder="?"
                autoFocus
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={userAnswer === ''}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 px-12 rounded-full text-2xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              Submit Answer! ✓
            </button>

            {showFeedback && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-6xl ${showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                {showFeedback === 'correct' ? '✅ Perfect!' : `❌ It\'s ${currentProblem.answer}!`}
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
