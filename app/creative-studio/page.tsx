'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DrawingCanvas from '@/components/creative/DrawingCanvas';
import ArtGallery from '@/components/creative/ArtGallery';
import ColoringBook from '@/components/creative/ColoringBook';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

type View = 'hub' | 'draw' | 'gallery' | 'coloring';

export default function CreativeStudio() {
  const [currentView, setCurrentView] = useState<View>('hub');

  if (currentView === 'draw') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('hub')}
            className="mb-6 px-6 py-3 bg-white text-purple-600 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft /> Back to Hub
          </motion.button>
          <DrawingCanvas />
        </div>
      </div>
    );
  }

  if (currentView === 'gallery') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('hub')}
            className="mb-6 px-6 py-3 bg-white text-pink-600 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft /> Back to Hub
          </motion.button>
          <ArtGallery />
        </div>
      </div>
    );
  }

  if (currentView === 'coloring') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('hub')}
            className="mb-6 px-6 py-3 bg-white text-orange-600 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft /> Back to Hub
          </motion.button>
          <ColoringBook />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back to Home */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 px-6 py-3 bg-white text-purple-600 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft /> Back to Home
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-4 baloo">
            🎨 Creative Studio
          </h1>
          <p className="text-2xl text-gray-700">
            Draw, paint, and create your own masterpieces!
          </p>
        </motion.div>

        {/* Main Menu */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Drawing Canvas Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => setCurrentView('draw')}
            className="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-3xl p-8 cursor-pointer shadow-2xl hover:shadow-3xl transition-all"
          >
            <div className="text-center text-white">
              <div className="text-8xl mb-6">🎨</div>
              <h2 className="text-4xl font-bold mb-4 baloo">Drawing Canvas</h2>
              <p className="text-xl mb-6 opacity-90">
                Use brushes, shapes, colors, and stamps to create amazing artwork!
              </p>
              <ul className="text-left space-y-2 text-lg">
                <li>✓ Paint with colorful brushes</li>
                <li>✓ Draw shapes and stars</li>
                <li>✓ Add fun stickers</li>
                <li>✓ Undo/Redo support</li>
                <li>✓ Download your art</li>
              </ul>
            </div>
          </motion.div>

          {/* Coloring Books Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => setCurrentView('coloring')}
            className="bg-gradient-to-br from-orange-400 to-red-600 rounded-3xl p-8 cursor-pointer shadow-2xl hover:shadow-3xl transition-all"
          >
            <div className="text-center text-white">
              <div className="text-8xl mb-6">📚</div>
              <h2 className="text-4xl font-bold mb-4 baloo">Coloring Books</h2>
              <p className="text-xl mb-6 opacity-90">
                Color beautiful pages from different themed books!
              </p>
              <ul className="text-left space-y-2 text-lg">
                <li>✓ 4 themed coloring books</li>
                <li>✓ 11 pages per book</li>
                <li>✓ 18 vibrant colors</li>
                <li>✓ Page navigation</li>
                <li>✓ Save to gallery</li>
              </ul>
            </div>
          </motion.div>

          {/* Art Gallery Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => setCurrentView('gallery')}
            className="bg-gradient-to-br from-pink-400 to-rose-600 rounded-3xl p-8 cursor-pointer shadow-2xl hover:shadow-3xl transition-all"
          >
            <div className="text-center text-white">
              <div className="text-8xl mb-6">🖼️</div>
              <h2 className="text-4xl font-bold mb-4 baloo">Art Gallery</h2>
              <p className="text-xl mb-6 opacity-90">
                View, download, and manage all your saved artworks!
              </p>
              <ul className="text-left space-y-2 text-lg">
                <li>✓ View all your creations</li>
                <li>✓ Download any artwork</li>
                <li>✓ Delete old drawings</li>
                <li>✓ Full-screen preview</li>
                <li>✓ Organized collection</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-6 baloo">
            Creative Tools & Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
              <div className="text-5xl mb-3">🖌️</div>
              <h4 className="font-bold text-xl mb-2">Brush Tools</h4>
              <p className="text-gray-700">
                Adjustable brush sizes and smooth drawing for perfect strokes
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl">
              <div className="text-5xl mb-3">🎨</div>
              <h4 className="font-bold text-xl mb-2">Color Palette</h4>
              <p className="text-gray-700">
                20+ vibrant colors to bring your imagination to life
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
              <div className="text-5xl mb-3">⭐</div>
              <h4 className="font-bold text-xl mb-2">Shapes & Stamps</h4>
              <p className="text-gray-700">
                Add circles, squares, stars, and 30+ fun emoji stamps
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
              <div className="text-5xl mb-3">↩️</div>
              <h4 className="font-bold text-xl mb-2">Undo/Redo</h4>
              <p className="text-gray-700">
                Fix mistakes easily with unlimited undo and redo
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl">
              <div className="text-5xl mb-3">💾</div>
              <h4 className="font-bold text-xl mb-2">Save & Download</h4>
              <p className="text-gray-700">
                Keep your artwork forever as PNG images
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl">
              <div className="text-5xl mb-3">📱</div>
              <h4 className="font-bold text-xl mb-2">Touch Support</h4>
              <p className="text-gray-700">
                Works great on tablets and touch screens too
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-6 baloo">
            🌟 Creative Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-xl mb-3 text-purple-600">For Drawing:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Start with light sketches using thin brushes</li>
                <li>• Use different colors to make your art pop</li>
                <li>• Try combining shapes to create characters</li>
                <li>• Don&apos;t be afraid to experiment!</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-xl mb-3 text-pink-600">Fun Ideas:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Draw your favorite animal or pet</li>
                <li>• Create a magical landscape with stars</li>
                <li>• Make a colorful pattern using shapes</li>
                <li>• Design your dream house or castle</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
