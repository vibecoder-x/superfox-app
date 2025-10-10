'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHeart, FaBrain, FaLightbulb, FaHandsHelping } from 'react-icons/fa';

const superfoxQualities = [
  {
    icon: <FaHeart className="text-4xl" />,
    title: 'Kind & Caring',
    description: 'Superfox always helps friends and shows compassion',
    color: 'from-pink-400 to-red-400',
  },
  {
    icon: <FaBrain className="text-4xl" />,
    title: 'Smart & Curious',
    description: 'Loves to learn and discover new things every day',
    color: 'from-blue-400 to-purple-400',
  },
  {
    icon: <FaLightbulb className="text-4xl" />,
    title: 'Creative & Fun',
    description: 'Makes learning an exciting and joyful adventure',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    icon: <FaHandsHelping className="text-4xl" />,
    title: 'Helpful & Brave',
    description: 'Always ready to help others and face new challenges',
    color: 'from-green-400 to-teal-400',
  },
];

export default function AboutSuperfox() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 text-8xl opacity-20">🦊</div>
      <div className="absolute bottom-20 left-10 text-8xl opacity-20">⭐</div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-superfox-orange mb-4 baloo">
            Meet Superfox
          </h2>
          <p className="text-xl md:text-2xl text-gray-700">
            Your friendly learning hero and guide to knowledge!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left side - Superfox Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-full aspect-square max-w-md mx-auto"
            >
              <Image
                src="/images/Superfox flying with its blue cape in the sky.png"
                alt="Superfox Flying"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

          {/* Right side - Story */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-4xl font-bold text-gray-800 baloo">
              The Story of Superfox
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Once upon a time, in a magical forest filled with books and wonder,
              a curious little fox discovered the power of learning. With every
              book he read and every question he asked, he grew stronger and
              wiser.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              One day, he found a special blue cape and goggles that gave him
              the power to make learning fun and exciting for everyone! From that
              day forward, he became <span className="font-bold text-superfox-orange">Superfox</span>,
              the hero of education and friend to all curious minds.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Now, Superfox travels the world helping kids discover the joy of
              learning through stories, games, and adventures. And the best part?
              YOU can join him on this amazing journey!
            </p>
          </motion.div>
        </div>

        {/* Superfox Qualities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12 baloo">
            What Makes Superfox Special?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {superfoxQualities.map((quality, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${quality.color} rounded-3xl p-6 text-white shadow-xl`}
              >
                <div className="mb-4">{quality.icon}</div>
                <h4 className="text-2xl font-bold mb-2 baloo">{quality.title}</h4>
                <p className="text-white/90">{quality.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-superfox-blue to-superfox-purple rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <Image
              src="/images/LOGO.png"
              alt="Superfox Logo"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-4xl md:text-5xl font-bold mb-6 baloo">
            Superfox&apos;s Mission
          </h3>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            To make learning an adventure filled with joy, curiosity, and discovery
            for every child. Together, we&apos;ll explore the world, one exciting lesson
            at a time!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
