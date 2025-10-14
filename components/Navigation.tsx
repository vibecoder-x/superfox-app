'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaBars, FaTimes, FaRocket, FaBook, FaGamepad, FaHeart, FaUserFriends } from 'react-icons/fa';

interface NavigationProps {
  onNavigate?: (section: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: <FaRocket />, color: 'from-blue-400 to-blue-500' },
    { id: 'learning', label: 'Learning World', icon: <FaRocket />, color: 'from-green-400 to-green-500' },
    { id: 'stories', label: 'Stories', icon: <FaBook />, color: 'from-purple-400 to-purple-500' },
    { id: 'games', label: 'Mini Games', icon: <FaGamepad />, color: 'from-orange-400 to-orange-500' },
    { id: 'about', label: 'About Superfox', icon: <FaHeart />, color: 'from-pink-400 to-pink-500' },
    { id: 'parent', label: 'Parent Zone', icon: <FaUserFriends />, color: 'from-indigo-400 to-indigo-500' },
  ];

  const handleMenuClick = (sectionId: string) => {
    setIsMenuOpen(false);

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-xl z-50 border-b-4 border-superfox-orange"
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between lg:justify-center lg:gap-8">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 cursor-pointer lg:absolute lg:left-6 bg-white rounded-2xl px-3 py-2 shadow-lg"
              onClick={() => handleMenuClick('home')}
            >
              <div className="relative w-28 h-12 md:w-36 md:h-14">
                <Image
                  src="/images/menulogo.png"
                  alt="Superfox Menu Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Desktop Menu - Centered with Fun Design */}
            <div className="hidden lg:flex items-center gap-4">
              {menuItems.slice(1).map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMenuClick(item.id)}
                  className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-gradient-to-br ${item.color} text-white font-bold shadow-lg hover:shadow-2xl transition-all duration-300 group`}
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                  <span className="text-xs baloo">{item.label}</span>

                  {/* Sparkle effect on hover */}
                  <motion.div
                    className="absolute -top-1 -right-1 text-yellow-300 opacity-0 group-hover:opacity-100"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button - More Kid-Friendly */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden bg-gradient-to-r from-superfox-orange to-yellow-400 text-white p-3 rounded-2xl shadow-xl relative overflow-hidden"
              animate={{
                boxShadow: isMenuOpen
                  ? ['0 10px 30px rgba(255,165,0,0.3)', '0 15px 40px rgba(255,165,0,0.5)', '0 10px 30px rgba(255,165,0,0.3)']
                  : '0 10px 30px rgba(255,165,0,0.3)',
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}

              {/* Pulse effect */}
              {!isMenuOpen && (
                <motion.div
                  className="absolute inset-0 bg-white opacity-20 rounded-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile/Tablet Full-Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 z-40 lg:hidden"
          >
            <div className="container mx-auto px-4 py-20 h-full flex flex-col items-center justify-center">
              {/* Superfox Logo in Menu */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mb-12"
              >
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src="/images/superfox.png"
                    alt="Superfox Character"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <h2 className="text-4xl font-bold text-white text-center baloo">
                  Let&apos;s Explore!
                </h2>
              </motion.div>

              {/* Menu Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMenuClick(item.id)}
                    className={`bg-gradient-to-br ${item.color} text-white rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center gap-3 min-h-[140px] transform transition-all duration-300`}
                  >
                    <div className="text-5xl">{item.icon}</div>
                    <span className="text-xl font-bold baloo">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Fun Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="mt-12 text-6xl"
              >
                🦊
              </motion.div>

              {/* Floating Stars */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl pointer-events-none"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${10 + (i % 3) * 30}%`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {i % 2 === 0 ? '⭐' : '✨'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed nav */}
      <div className="h-20"></div>
    </>
  );
}
