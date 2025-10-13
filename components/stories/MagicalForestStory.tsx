'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaPlay, FaPause, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const storyPages = [
  {
    page: 1,
    image: '/stories/magical-forest/page1.png',
    text: 'One sunny morning, the Magical Forest shimmered with golden light. Every tree, flower, and river sparkled with a secret waiting to be discovered. And somewhere near the edge of the woods, a clever little fox named Superfox was just waking up.\nSuperfox: What a beautiful morning! I feel like something exciting is waiting for me in the forest today! 🌞',
  },
  {
    page: 2,
    image: '/stories/magical-forest/page2.png',
    text: 'Superfox packed his little backpack, grabbed his map, and started trotting down the winding trail. The birds sang, the wind danced, and the sunlight sparkled through the leaves.\nSuperfox: Wow, everything feels... magical today. Let\'s see what I can find! 🌳✨',
  },
  {
    page: 3,
    image: '/stories/magical-forest/page3.png',
    text: 'As he walked, he noticed a small bunny hopping around in circles, looking worried.\nSuperfox: Hey there, little one! Are you okay?\nLuna the Rabbit: Oh, Superfox! I lost my shiny acorn, and it rolled somewhere deep into the woods!\nSuperfox: Don\'t worry, Luna. I\'ll help you find it! Let\'s go together.',
  },
  {
    page: 4,
    image: '/stories/magical-forest/page4.png',
    text: 'They searched high and low — under bushes, behind flowers, even near the glowing mushrooms. Finally, something shimmered beneath a tree root.\nSuperfox: There it is! I found your acorn! 🌰✨\nLuna the Rabbit: Yay! Thank you, Superfox! You\'re the best!',
  },
  {
    page: 5,
    image: '/stories/magical-forest/page5.png',
    text: 'Just then, a gentle voice echoed through the forest.\nOro the Owl: Bravery and kindness always bring light to the forest. Superfox, your good heart has awakened the magic once again.\nSuperfox: Wow... really? That\'s amazing!',
  },
  {
    page: 6,
    image: '/stories/magical-forest/page6.png',
    text: 'A warm glow surrounded Superfox, and a golden acorn appeared in his paw. It shimmered softly — a gift from the forest itself.\nOro the Owl: Keep it close, Superfox. Whenever you feel lost, it will light your way.\nSuperfox: Thank you, Oro! And thank you, Luna! What an adventure this has been!',
  },
  {
    page: 7,
    image: '/stories/magical-forest/page7.png',
    text: 'And as the sun began to set, Superfox walked home with a glowing heart and a new treasure — a reminder that kindness always brings magic to the world. ✨\nSuperfox: Can\'t wait for my next adventure! See you soon, friends! 🦊🌟',
  },
];

export default function MagicalForestStory({ onClose }: { onClose: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/stories/magical-forest/narration.mp3');

    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextPage = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 flex items-center justify-between text-white">
          <h2 className="text-2xl md:text-3xl font-bold baloo">🌳 The Magical Forest</h2>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Story Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Image */}
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src={storyPages[currentPage].image}
                alt={`Page ${currentPage + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Text */}
            <motion.div
              key={`text-${currentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-green-600">Page {currentPage + 1} of {storyPages.length}</span>
                <button
                  onClick={togglePlayPause}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-full hover:shadow-lg transition-all"
                >
                  {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
                </button>
              </div>
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                {storyPages[currentPage].text}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
          >
            <FaArrowLeft /> Previous
          </button>

          <div className="flex gap-2">
            {storyPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage ? 'bg-green-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === storyPages.length - 1}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
          >
            Next <FaArrowRight />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
