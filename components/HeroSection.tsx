'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaRocket, FaBook } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    // Generate random values only on client side
    setIsClient(true);
    setParticles(
      [...Array(20)].map(() => ({
        width: Math.random() * 10 + 5,
        height: Math.random() * 10 + 5,
        left: Math.random() * 100,
        top: Math.random() * 100,
        x: Math.random() * 20 - 10,
        duration: Math.random() * 3 + 2,
      }))
    );
    setStars(
      [...Array(5)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 2 + 2,
      }))
    );
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 overflow-hidden">
      {/* Floating particles background */}
      {isClient && (
        <div className="particles">
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
              animate={{
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
      )}

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
              className="text-5xl md:text-7xl font-extrabold text-white mb-6 baloo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Learn, Play, and Grow with{' '}
              <span className="text-yellow-300">Superfox!</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white mb-8 font-light"
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
              <button className="bg-white text-superfox-orange font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <FaRocket /> Start Learning
              </button>
              <button className="bg-superfox-orange text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <FaBook /> Read Stories
              </button>
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
              animate={{
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
            {isClient && stars.map((star, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                }}
                animate={{
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
      <div className="absolute bottom-0 left-0 w-full">
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
