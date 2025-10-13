'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaPalette, FaSave, FaUndo, FaRedo, FaHome, FaFillDrip } from 'react-icons/fa';
import Image from 'next/image';

type ColoringBook = {
  id: string;
  title: string;
  folder: string;
  totalPages: number;
  coverColor: string;
  emoji: string;
};

const coloringBooks: ColoringBook[] = [
  {
    id: 'fruits',
    title: 'Fruits Coloring Book',
    folder: 'fruits',
    totalPages: 11,
    coverColor: 'from-red-400 to-orange-600',
    emoji: '🍎'
  },
  {
    id: 'jungle',
    title: 'Jungle Adventures',
    folder: 'jungle',
    totalPages: 11,
    coverColor: 'from-green-400 to-emerald-600',
    emoji: '🦁'
  },
  {
    id: 'dinosaurs',
    title: 'Dinosaurs World',
    folder: 'dinosaurs',
    totalPages: 11,
    coverColor: 'from-purple-400 to-indigo-600',
    emoji: '🦕'
  },
  {
    id: 'animals',
    title: 'Animals Kingdom',
    folder: 'animals',
    totalPages: 11,
    coverColor: 'from-blue-400 to-cyan-600',
    emoji: '🐘'
  }
];

const colorPalette = [
  { name: 'Red', color: '#FF0000' },
  { name: 'Orange', color: '#FFA500' },
  { name: 'Yellow', color: '#FFFF00' },
  { name: 'Green', color: '#00FF00' },
  { name: 'Blue', color: '#0000FF' },
  { name: 'Purple', color: '#800080' },
  { name: 'Pink', color: '#FFC0CB' },
  { name: 'Brown', color: '#8B4513' },
  { name: 'Black', color: '#000000' },
  { name: 'Gray', color: '#808080' },
  { name: 'Light Blue', color: '#87CEEB' },
  { name: 'Light Green', color: '#90EE90' },
  { name: 'Light Pink', color: '#FFB6C1' },
  { name: 'Peach', color: '#FFDAB9' },
  { name: 'Turquoise', color: '#40E0D0' },
  { name: 'Violet', color: '#EE82EE' },
  { name: 'Gold', color: '#FFD700' },
  { name: 'Silver', color: '#C0C0C0' }
];

export default function ColoringBook() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBook, setSelectedBook] = useState<ColoringBook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentTool, setCurrentTool] = useState<'brush' | 'fill'>('brush');

  useEffect(() => {
    if (selectedBook && canvasRef.current) {
      loadSVGToCanvas();
    }
  }, [selectedBook, currentPage]);

  const loadSVGToCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedBook) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setSvgLoaded(false);
    setImageLoaded(false);

    try {
      const svgPath = `/coloring-books/${selectedBook.folder}/${currentPage}.svg`;

      // Load SVG as image
      const img = new window.Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Set canvas size - adaptive to device width, square shape
        const availableWidth = window.innerWidth - 450; // Leave space for sidebar on desktop
        const mobileWidth = window.innerWidth - 64; // Mobile padding

        // Check if mobile/tablet (width < 1024px)
        const isMobile = window.innerWidth < 1024;
        const size = isMobile ? mobileWidth : availableWidth;

        // Make it square: width = height
        canvas.width = size;
        canvas.height = size;

        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the SVG image centered and scaled to fill canvas
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        setSvgLoaded(true);
        setImageLoaded(true);
        saveToHistory();
      };

      img.onerror = () => {
        console.error('Failed to load SVG');
        setSvgLoaded(true);
      };

      img.src = svgPath;
    } catch (error) {
      console.error('Error loading SVG:', error);
      setSvgLoaded(true);
    }
  };

  // Flood fill algorithm for paint bucket
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getPixelColor = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4;
    return {
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2],
      a: imageData.data[index + 3]
    };
  };

  const colorsMatch = (a: {r: number, g: number, b: number, a?: number}, b: {r: number, g: number, b: number, a?: number}) => {
    return a.r === b.r && a.g === b.g && a.b === b.b;
  };

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixelColor(imageData, startX, startY);
    const fillRGB = hexToRgb(fillColor);

    if (!fillRGB || colorsMatch(targetColor, fillRGB)) return;

    const pixelsToCheck: number[] = [startX, startY];
    const width = canvas.width;
    const height = canvas.height;
    const checkedPixels = new Set<number>();

    while (pixelsToCheck.length > 0) {
      const y = pixelsToCheck.pop()!;
      const x = pixelsToCheck.pop()!;
      const pixelPos = (y * width + x) * 4;

      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (checkedPixels.has(pixelPos)) continue;
      checkedPixels.add(pixelPos);

      const currentColor = getPixelColor(imageData, x, y);
      if (!colorsMatch(currentColor, targetColor)) continue;

      imageData.data[pixelPos] = fillRGB.r;
      imageData.data[pixelPos + 1] = fillRGB.g;
      imageData.data[pixelPos + 2] = fillRGB.b;
      imageData.data[pixelPos + 3] = 255;

      pixelsToCheck.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
    }

    ctx.putImageData(imageData, 0, 0);
    saveToHistory();
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setHistoryStep(historyStep - 1);
      ctx.putImageData(history[historyStep - 1], 0, 0);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setHistoryStep(historyStep + 1);
      ctx.putImageData(history[historyStep + 1], 0, 0);
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scale the position to canvas coordinates
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = Math.floor(pos.x * scaleX);
    const canvasY = Math.floor(pos.y * scaleY);

    if (currentTool === 'fill') {
      floodFill(canvasX, canvasY, selectedColor);
      return;
    }

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'fill') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = pos.x * scaleX;
    const canvasY = pos.y * scaleY;

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(canvasX, canvasY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getTouchPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scale the position to canvas coordinates
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = Math.floor(pos.x * scaleX);
    const canvasY = Math.floor(pos.y * scaleY);

    if (currentTool === 'fill') {
      floodFill(canvasX, canvasY, selectedColor);
      return;
    }

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(canvasX, canvasY);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'fill') return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getTouchPos(e);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = pos.x * scaleX;
    const canvasY = pos.y * scaleY;

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(canvasX, canvasY);
    ctx.stroke();
  };

  const stopDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      e.preventDefault();
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const saveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const artwork = {
        id: `coloring-${Date.now()}`,
        dataUrl: dataUrl,
        timestamp: Date.now()
      };

      const saved = localStorage.getItem('superfox-artworks');
      const artworks = saved ? JSON.parse(saved) : [];
      artworks.push(artwork);
      localStorage.setItem('superfox-artworks', JSON.stringify(artworks));

      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } catch (error) {
      console.error('Failed to save artwork:', error);
      alert('Failed to save to gallery');
    }
  };

  const nextPage = () => {
    if (selectedBook && currentPage < selectedBook.totalPages) {
      setCurrentPage(currentPage + 1);
      setHistory([]);
      setHistoryStep(-1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setHistory([]);
      setHistoryStep(-1);
    }
  };

  // Book Selection View
  if (!selectedBook) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-orange-600 mb-2 baloo">📚 Coloring Books</h1>
          <p className="text-xl text-gray-700">Choose a coloring book to start your adventure!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {coloringBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => {
                setSelectedBook(book);
                setCurrentPage(1);
                setHistory([]);
                setHistoryStep(-1);
              }}
              className={`bg-gradient-to-br ${book.coverColor} rounded-3xl p-8 cursor-pointer shadow-2xl hover:shadow-3xl transition-all`}
            >
              <div className="text-center text-white">
                <div className="text-8xl mb-4">{book.emoji}</div>
                <h2 className="text-3xl font-bold mb-2 baloo">{book.title}</h2>
                <p className="text-lg opacity-90 mb-4">{book.totalPages} pages to color</p>
                <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 inline-block">
                  <span className="font-bold">Click to Start!</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Coloring View
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedBook(null)}
          className="px-6 py-3 bg-white text-orange-600 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <FaHome /> Back to Books
        </motion.button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-600 baloo">{selectedBook.title}</h2>
          <p className="text-lg text-gray-600">Page {currentPage} of {selectedBook.totalPages}</p>
        </div>

        <div className="w-32"></div>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Color Palette Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaPalette className="text-2xl text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-800">Tools</h3>
          </div>

          {/* Tool Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTool('brush')}
              className={`px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                currentTool === 'brush' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaPalette /> Brush
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTool('fill')}
              className={`px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                currentTool === 'fill' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaFillDrip /> Fill
            </motion.button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <FaPalette className="text-2xl text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-800">Colors</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {colorPalette.map((c) => (
              <motion.button
                key={c.color}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedColor(c.color)}
                className={`w-full h-14 rounded-xl transition-all ${
                  selectedColor === c.color ? 'ring-4 ring-orange-400 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            ))}
          </div>

          {currentTool === 'brush' && (
            <div className="mb-6">
              <label className="font-bold text-gray-700 mb-2 block">Brush Size</label>
              <input
                type="range"
                min="5"
                max="40"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-orange-600 font-bold mt-2">{brushSize}px</div>
            </div>
          )}

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={undo}
              disabled={historyStep <= 0}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50"
            >
              <FaUndo /> Undo
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50"
            >
              <FaRedo /> Redo
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveToGallery}
              className="w-full px-4 py-3 bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-600"
            >
              <FaSave /> Save to Gallery
            </motion.button>
          </div>

          {showSaveConfirmation && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-green-100 border-2 border-green-500 rounded-xl p-3 text-center"
            >
              <p className="text-green-700 font-bold">✅ Saved!</p>
            </motion.div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-4"
          >
            {!imageLoaded && (
              <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-2xl text-gray-500">Loading coloring page...</div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawingTouch}
              onTouchMove={drawTouch}
              onTouchEnd={stopDrawingTouch}
              className={`border-4 border-orange-300 rounded-2xl touch-none w-full ${
                !imageLoaded ? 'hidden' : ''
              } ${currentTool === 'fill' ? 'cursor-pointer' : 'cursor-crosshair'}`}
              style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
            />
          </motion.div>

          {/* Page Navigation */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaArrowLeft /> Previous
            </motion.button>

            <div className="text-2xl font-bold text-orange-600">
              {currentPage} / {selectedBook.totalPages}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextPage}
              disabled={currentPage === selectedBook.totalPages}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <FaArrowRight />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
