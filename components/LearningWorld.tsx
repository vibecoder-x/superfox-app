'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalculator, FaBook, FaFlask, FaPalette, FaStar } from 'react-icons/fa';

const learningModules = [
  {
    title: 'Math Adventures',
    description: 'Count, add, and solve fun math puzzles with Superfox!',
    icon: <FaCalculator className="text-5xl" />,
    color: 'from-blue-400 to-blue-600',
    image: '/images/Superfox teaching math to kids on a chalkboard.png',
    stars: 5,
    link: '/math-adventures',
  },
  {
    title: 'Reading World',
    description: 'Discover amazing stories and learn to read with joy!',
    icon: <FaBook className="text-5xl" />,
    color: 'from-green-400 to-green-600',
    image: '/images/Superfox reading a storybook under a big tree.png',
    stars: 5,
    link: '#',
  },
  {
    title: 'Science Lab',
    description: 'Explore planets, nature, and exciting experiments!',
    icon: <FaFlask className="text-5xl" />,
    color: 'from-purple-400 to-purple-600',
    image: '/images/Superfox discovering planets with a telescope.png',
    stars: 5,
    link: '#',
  },
  {
    title: 'Creative Studio',
    description: 'Draw, paint, and create beautiful art with Superfox!',
    icon: <FaPalette className="text-5xl" />,
    color: 'from-pink-400 to-pink-600',
    image: '/images/Superfox and kids drawing together on the floor.png',
    stars: 5,
    link: '#',
  },
];

export default function LearningWorld() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-superfox-orange mb-4 baloo">
            Learning World
          </h2>
          <p className="text-xl md:text-2xl text-gray-700">
            Choose your adventure and start learning today!
          </p>
        </motion.div>

        {/* Learning Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {learningModules.map((module, index) => (
            <Link key={index} href={module.link}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className={`bg-gradient-to-br ${module.color} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="text-white mb-4 flex justify-center">
                      {module.icon}
                    </div>

                    {/* Module Image */}
                    <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden">
                      <Image
                        src={module.image}
                        alt={module.title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2 baloo text-center">
                      {module.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/90 text-center mb-4">
                      {module.description}
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(module.stars)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-300 text-xl" />
                      ))}
                    </div>

                    {/* Start Button */}
                    <button className="w-full bg-white text-gray-800 font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition-colors duration-300">
                      Start Learning
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-superfox-orange to-superfox-blue rounded-3xl p-8 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4 baloo">Your Learning Journey</h3>
          <p className="text-xl mb-6">
            Earn stars, badges, and level up as you learn!
          </p>
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">0</div>
              <div className="text-sm">Stars Earned</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">0</div>
              <div className="text-sm">Badges</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold">1</div>
              <div className="text-sm">Level</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
