'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaBook, FaPlay } from 'react-icons/fa';
import { useState } from 'react';
import MagicalForestStory from '@/components/stories/MagicalForestStory';

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
    hasInteractiveStory: false,
  },
  {
    title: 'The Magical Forest',
    description: 'Explore the enchanted forest with Superfox and friends!',
    image: '/images/Superfox exploring a magical forest.png',
    duration: '8 min',
    category: 'Adventure',
    audioPath: '/stories/magical-forest/narration.mp3',
    hasInteractiveStory: true,
  },
  {
    title: 'Superfox Learns to Share',
    description: 'A heartwarming story about friendship and kindness.',
    image: '/images/Superfox giving a high-five to a child.png',
    duration: '7 min',
    category: 'Friendship',
    hasInteractiveStory: false,
  },
  {
    title: 'The Great Garden Adventure',
    description: 'Help Superfox plant trees and learn about nature!',
    image: '/images/Superfox planting trees in a green garden.png',
    duration: '9 min',
    category: 'Nature',
    hasInteractiveStory: false,
  },
];

export default function StoryLibrary() {
  const [showMagicalForest, setShowMagicalForest] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const visibleStories = featuredStories.filter(story => categoryFilter === 'All' || story.category === categoryFilter);

  const handleStoryClick = (story: typeof featuredStories[0]) => {
    // If story has interactive version, open it
    if (story.hasInteractiveStory && story.title === 'The Magical Forest') {
      setShowMagicalForest(true);
    }
  };

  return (
    <>
      {/* Magical Forest Interactive Story */}
      {showMagicalForest && (
        <MagicalForestStory onClose={() => setShowMagicalForest(false)} />
      )}

      <section id="stories" className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
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
            <button onClick={() => setCategoryFilter('All')} aria-pressed={categoryFilter === 'All'} className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">All Stories</button>
            {storyCategories.map((category, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryFilter(category.name)}
                aria-pressed={categoryFilter === category.name}
                className={`${category.color} text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ${categoryFilter === category.name ? 'ring-4 ring-purple-700 ring-offset-2' : ''}`}
              >
                <span className="text-2xl">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {visibleStories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden group"
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
                  <button
                    aria-label={`Read ${story.title}`}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    onClick={() => handleStoryClick(story)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="bg-white rounded-full p-6"
                    >
                      <FaPlay className="text-superfox-orange text-4xl" />
                    </motion.div>
                  </button>
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
                  {story.hasInteractiveStory ? (
                    <button onClick={() => handleStoryClick(story)} className="bg-superfox-blue text-white font-bold px-4 py-3 rounded-full">Read Story</button>
                  ) : <span className="rounded-full bg-purple-100 text-purple-800 px-3 py-2 text-sm font-bold">Coming Soon</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {visibleStories.length === 0 && <p role="status" className="text-center text-purple-800 bg-white rounded-2xl p-8 mb-12">Science stories are Coming Soon! Choose another category to explore.</p>}

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
            Read The Magical Forest with narrated audio and illustrated pages. More adventures are coming soon!
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
              <p className="text-sm">Word highlighting is Coming Soon</p>
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
    </>
  );
}
