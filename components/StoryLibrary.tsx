'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaBook, FaPlay, FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { useAudio } from '@/hooks/useAudio';

const storyCategories = [
  {
    name: 'Adventure',
    color: 'bg-orange-400',
    icon: '🚀',
  },
  {
    name: 'Friendship',
    color: 'bg-pink-400',
    icon: '💗',
  },
  {
    name: 'Nature',
    color: 'bg-green-400',
    icon: '🌳',
  },
  {
    name: 'Science',
    color: 'bg-blue-400',
    icon: '🔬',
  },
];

const featuredStories = [
  {
    title: 'Superfox in Space',
    description: 'Join Superfox on an amazing journey to discover the planets!',
    image: '/images/Superfox as an astronaut floating in space.png',
    duration: '10 min',
    category: 'Adventure',
    audioPath: null,
  },
  {
    title: 'The Magical Forest',
    description: 'Explore the enchanted forest with Superfox and friends!',
    image: '/images/Superfox exploring a magical forest.png',
    duration: '8 min',
    category: 'Adventure',
    audioPath: '/audio/intro/The Magical Forest story.mp3',
  },
  {
    title: 'Superfox Learns to Share',
    description: 'A heartwarming story about friendship and kindness.',
    image: '/images/Superfox giving a high-five to a child.png',
    duration: '7 min',
    category: 'Friendship',
  },
  {
    title: 'The Great Garden Adventure',
    description: 'Help Superfox plant trees and learn about nature!',
    image: '/images/Superfox planting trees in a green garden.png',
    duration: '9 min',
    category: 'Nature',
  },
];

export default function StoryLibrary() {
  const { playAudio, stopAudio } = useAudio();
  const [playingStory, setPlayingStory] = useState<string | null>(null);

  const handlePlayStory = (story: typeof featuredStories[0]) => {
    if (!story.audioPath) return;

    // If this story is already playing, stop it
    if (playingStory === story.title) {
      stopAudio();
      setPlayingStory(null);
    } else {
      // Play the new story
      playAudio(story.audioPath);
      setPlayingStory(story.title);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-superfox-blue mb-4 baloo">
            Story Library
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Dive into magical stories with Superfox as your guide!
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {storyCategories.map((category, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`${category.color} text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2`}
              >
                <span className="text-2xl">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredStories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden group cursor-pointer"
            >
              {/* Story Image */}
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Play Button Overlay */}
                {story.audioPath && (
                  <div
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    onClick={() => handlePlayStory(story)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="bg-white rounded-full p-6"
                    >
                      <FaPlay className="text-superfox-orange text-4xl" />
                    </motion.div>
                  </div>
                )}
                {/* Duration Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-bold text-gray-800">
                  <FaBook className="inline mr-1" /> {story.duration}
                </div>
              </div>

              {/* Story Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 baloo">
                  {story.title}
                </h3>
                <p className="text-gray-600 mb-4">{story.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-superfox-blue">
                    {story.category}
                  </span>
                  <button className="text-red-500 hover:scale-125 transition-transform">
                    <FaHeart className="text-2xl" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Story Reading Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="/images/Superfox reading a bedtime story to small animals.png"
              alt="Superfox Reading"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h3 className="text-4xl font-bold mb-4 baloo">
            Interactive Story Experience
          </h3>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Every story comes with narrated audio, highlighted text, and beautiful animations!
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl mb-3">🎧</div>
              <h4 className="font-bold text-xl mb-2">Audio Narration</h4>
              <p className="text-sm">Listen to stories read aloud</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl mb-3">✨</div>
              <h4 className="font-bold text-xl mb-2">Text Highlights</h4>
              <p className="text-sm">Follow along with highlighted words</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-5xl mb-3">🎨</div>
              <h4 className="font-bold text-xl mb-2">Animations</h4>
              <p className="text-sm">Beautiful animated illustrations</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
