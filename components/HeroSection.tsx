'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { FaRocket, FaBook } from 'react-icons/fa';

// Stable decorative positions keep the server and first client render identical.
const particles = Array.from({ length: 20 }, (_, index) => ({
  width: 5 + (index * 7 % 10),
  height: 5 + (index * 11 % 10),
  left: index * 37 % 100,
  top: index * 23 % 100,
  x: index * 13 % 20 - 10,
  duration: 2 + (index % 4),
}));
const stars = Array.from({ length: 5 }, (_, index) => ({
  left: 10 + (index * 37 % 80),
  top: 10 + (index * 23 % 80),
  duration: 2 + (index % 3),
}));

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" aria-labelledby="welcome-title" className="relative min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 overflow-hidden">
      {/* Floating particles background */}
        <div className="particles" aria-hidden="true">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                width: particle.width + 'px',
                height: particle.height + 'px',
                left: particle.left + '%',
                top: particle.top + '%',
              }}
              animate={reduceMotion ? undefined : {
                y: [0, -30, 0],
                x: [0, particle.x, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <motion.h1
              id="welcome-title"
              className="text-5xl md:text-7xl font-extrabold text-slate-950 mb-6 baloo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Learn, Play, and Grow with{' '}
              <span className="text-yellow-300 bg-slate-900/90 rounded-xl px-2">Superfox!</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-950 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Join Superfox on amazing adventures filled with learning, fun, and
              discovery!
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <a href="#learning" className="bg-white text-orange-800 font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <FaRocket aria-hidden="true" /> Start Learning
              </a>
              <a href="#stories" className="bg-superfox-orange text-slate-950 font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <FaBook aria-hidden="true" /> Read Stories
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Superfox character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={reduceMotion ? undefined : {
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-full max-w-md mx-auto"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src="/images/superfox.png"
                  alt="Superfox - Your Learning Hero"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Floating stars around Superfox */}
            {stars.map((star, i) => (
              <motion.div
                key={i}
                aria-hidden="true"
                className="absolute text-4xl"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                }}
                animate={reduceMotion ? undefined : {
                  rotate: [0, 360],
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ⭐
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
