'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaTimes, FaDownload } from 'react-icons/fa';

type Artwork = {
  id: string;
  dataUrl: string;
  timestamp: number;
};

export default function ArtGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = () => {
    try {
      const saved = localStorage.getItem('superfox-artworks');
      if (saved) {
        setArtworks(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load artworks:', error);
    }
  };

  const deleteArtwork = (id: string) => {
    try {
      const filtered = artworks.filter((art) => art.id !== id);
      setArtworks(filtered);
      localStorage.setItem('superfox-artworks', JSON.stringify(filtered));
      if (selectedArtwork?.id === id) {
        setSelectedArtwork(null);
      }
    } catch (error) {
      console.error('Failed to delete artwork:', error);
    }
  };

  const downloadArtwork = (artwork: Artwork) => {
    const link = document.createElement('a');
    link.download = `superfox-artwork-${artwork.id}.png`;
    link.href = artwork.dataUrl;
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-5xl font-bold text-pink-600 mb-2 baloo">🖼️ Art Gallery</h1>
        <p className="text-xl text-gray-700">Your amazing artwork collection!</p>
      </motion.div>

      {artworks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-12 text-center shadow-2xl"
        >
          <div className="text-8xl mb-6">🎨</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 baloo">No Artworks Yet!</h2>
          <p className="text-xl text-gray-600">
            Start creating in the Drawing Canvas and save your masterpieces!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <img
                  src={artwork.dataUrl}
                  alt={`Artwork ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {new Date(artwork.timestamp).toLocaleDateString()}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteArtwork(artwork.id);
                  }}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <FaTrash />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full View Modal */}
      {selectedArtwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArtwork(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl"
            >
              <FaTimes />
            </button>

            <div className="mb-4">
              <img
                src={selectedArtwork.dataUrl}
                alt="Selected artwork"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadArtwork(selectedArtwork)}
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-600"
              >
                <FaDownload /> Download
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  deleteArtwork(selectedArtwork.id);
                  setSelectedArtwork(null);
                }}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600"
              >
                <FaTrash /> Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
