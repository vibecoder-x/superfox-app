'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaTrash, FaTimes, FaDownload, FaSync } from 'react-icons/fa';
import ActivityDialog from '@/components/ActivityDialog';
import { readArtworks, writeArtworks, type Artwork } from './artworkStorage';

export default function ArtGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = () => {
    try {
      setArtworks(readArtworks());
      setStorageError('');
    } catch {
      setStorageError('The saved gallery could not be opened. Ask an adult to check browser storage.');
    }
  };

  const deleteArtwork = (id: string) => {
    try {
      const filtered = readArtworks().filter((art) => art.id !== id);
      writeArtworks(filtered);
      setArtworks(filtered);
      setStorageError('');
      if (selectedArtwork?.id === id) {
        setSelectedArtwork(null);
      }
    } catch {
      setStorageError('This device could not update the gallery. Your artwork has not been deleted.');
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
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          <h1 className="text-3xl sm:text-5xl font-bold text-pink-600 baloo">🖼️ Art Gallery</h1>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={loadArtworks}
            className="text-2xl text-pink-600 hover:text-pink-700 p-2 rounded-full bg-pink-100 hover:bg-pink-200"
            title="Refresh gallery"
            aria-label="Refresh gallery"
          >
            <FaSync />
          </motion.button>
        </div>
        <p className="text-xl text-gray-700">Your amazing artwork collection, saved on this device!</p>
      </motion.div>
      {storageError && <p role="status" className="mb-6 rounded-2xl bg-orange-100 p-4 text-orange-900">{storageError}</p>}

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
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <button className="block w-full aspect-[4/3] bg-gray-100 relative overflow-hidden" onClick={() => setSelectedArtwork(artwork)} aria-label={`Preview artwork ${index + 1}`}>
                <Image
                  src={artwork.dataUrl}
                  alt={`Artwork ${index + 1}`}
                  width={800}
                  height={800}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </button>
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
                  aria-label={`Delete artwork ${index + 1}`}
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
        <ActivityDialog
          label="Artwork preview"
          closeOnBackdrop
          onClose={() => setSelectedArtwork(null)}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-4xl w-full relative max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close artwork preview"
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl"
            >
              <FaTimes />
            </button>

            <div className="mb-4">
              <Image
                src={selectedArtwork.dataUrl}
                alt="Selected artwork"
                width={800}
                height={800}
                unoptimized
                className="w-full max-h-[65dvh] object-contain rounded-2xl shadow-lg"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
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
                }}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600"
              >
                <FaTrash /> Delete
              </motion.button>
            </div>
          </motion.div>
        </ActivityDialog>
      )}
    </div>
  );
}
