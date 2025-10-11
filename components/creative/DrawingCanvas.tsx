'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaintBrush, FaEraser, FaCircle, FaSquare, FaStar, FaUndo, FaRedo, FaDownload, FaTrash, FaImage, FaSave } from 'react-icons/fa';

type Tool = 'brush' | 'eraser' | 'circle' | 'square' | 'triangle' | 'star' | 'stamp';
type DrawingAction = {
  type: 'stroke' | 'shape' | 'stamp';
  data: any;
};

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#E63946', '#A8DADC', '#457B9D', '#1D3557', '#F1FAEE',
  '#000000', '#FFFFFF', '#8B4513', '#FFB6C1', '#DDA15E'
];

const stamps = ['🌟', '⭐', '🌈', '☀️', '🌙', '⚡', '💫', '✨', '🎨', '🎭', '🎪', '🎡', '🎢', '🎠', '🎯', '🎲', '🎮', '🎸', '🎹', '🎺', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const [currentColor, setCurrentColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showStamps, setShowStamps] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState('🌟');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    saveToHistory();
  }, []);

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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const downloadArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `superfox-artwork-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const artwork = {
        id: `artwork-${Date.now()}`,
        dataUrl: dataUrl,
        timestamp: Date.now()
      };

      // Get existing artworks
      const saved = localStorage.getItem('superfox-artworks');
      const artworks = saved ? JSON.parse(saved) : [];

      // Add new artwork
      artworks.push(artwork);

      // Save back to localStorage
      localStorage.setItem('superfox-artworks', JSON.stringify(artworks));

      // Show confirmation
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } catch (error) {
      console.error('Failed to save artwork:', error);
      alert('Failed to save artwork to gallery');
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
    setIsDrawing(true);
    setStartPos(pos);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentTool === 'brush' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getTouchPos(e);
    setIsDrawing(true);
    setStartPos(pos);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentTool === 'brush' || currentTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);

    if (currentTool === 'brush') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getTouchPos(e);

    if (currentTool === 'brush') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);

    // Draw shapes
    if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    } else if (currentTool === 'square') {
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      ctx.fillStyle = currentColor;
      ctx.fillRect(startPos.x, startPos.y, width, height);
    } else if (currentTool === 'triangle') {
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineTo(startPos.x - (pos.x - startPos.x), pos.y);
      ctx.closePath();
      ctx.fill();
    } else if (currentTool === 'star') {
      drawStar(ctx, startPos.x, startPos.y, 5, Math.abs(pos.x - startPos.x), Math.abs(pos.x - startPos.x) / 2);
    } else if (currentTool === 'stamp') {
      ctx.font = '48px Arial';
      ctx.fillText(selectedStamp, pos.x - 24, pos.y + 16);
    }

    saveToHistory();
  };

  const stopDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getTouchPos(e);

    // Draw shapes
    if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    } else if (currentTool === 'square') {
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      ctx.fillStyle = currentColor;
      ctx.fillRect(startPos.x, startPos.y, width, height);
    } else if (currentTool === 'triangle') {
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineTo(startPos.x - (pos.x - startPos.x), pos.y);
      ctx.closePath();
      ctx.fill();
    } else if (currentTool === 'star') {
      drawStar(ctx, startPos.x, startPos.y, 5, Math.abs(pos.x - startPos.x), Math.abs(pos.x - startPos.x) / 2);
    } else if (currentTool === 'stamp') {
      ctx.font = '48px Arial';
      ctx.fillText(selectedStamp, pos.x - 24, pos.y + 16);
    }

    saveToHistory();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.fillStyle = currentColor;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-5xl font-bold text-purple-600 mb-2 baloo">🎨 Creative Studio</h1>
        <p className="text-xl text-gray-700">Draw, paint, and create amazing artwork!</p>
      </motion.div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
        {/* Tools */}
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTool('brush')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentTool === 'brush'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaPaintBrush /> Brush
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTool('eraser')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentTool === 'eraser'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaEraser /> Eraser
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTool('circle')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentTool === 'circle'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaCircle /> Circle
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTool('square')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentTool === 'square'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaSquare /> Square
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTool('triangle')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentTool === 'triangle'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ▲ Triangle
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentTool('star')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentTool === 'star'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaStar /> Star
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentTool('stamp');
              setShowStamps(!showStamps);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              currentTool === 'stamp'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaImage /> Stamps
          </motion.button>
        </div>

        {/* Stamps Panel */}
        {showStamps && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-purple-50 rounded-2xl p-4 mb-4"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {stamps.map((stamp) => (
                <motion.button
                  key={stamp}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedStamp(stamp)}
                  className={`text-4xl p-2 rounded-lg transition-all ${
                    selectedStamp === stamp
                      ? 'bg-purple-300 shadow-lg'
                      : 'bg-white hover:bg-purple-100'
                  }`}
                >
                  {stamp}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Color Palette */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {colors.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentColor(color)}
              className={`w-10 h-10 rounded-full transition-all ${
                currentColor === color ? 'ring-4 ring-purple-400 ring-offset-2' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-4 mb-4 justify-center">
          <label className="font-bold text-gray-700">Brush Size:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-48"
          />
          <span className="font-bold text-purple-600">{brushSize}px</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            disabled={historyStep <= 0}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUndo /> Undo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaRedo /> Redo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCanvas}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600"
          >
            <FaTrash /> Clear
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadArtwork}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-600"
          >
            <FaDownload /> Download
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveToGallery}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-purple-600"
          >
            <FaSave /> Save to Gallery
          </motion.button>
        </div>

        {/* Save Confirmation */}
        {showSaveConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 bg-green-100 border-2 border-green-500 rounded-xl p-4 text-center"
          >
            <p className="text-green-700 font-bold text-lg">
              ✅ Artwork saved to gallery!
            </p>
          </motion.div>
        )}
      </div>

      {/* Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-4 flex justify-center"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={() => setIsDrawing(false)}
          onTouchStart={startDrawingTouch}
          onTouchMove={drawTouch}
          onTouchEnd={stopDrawingTouch}
          className="border-4 border-purple-300 rounded-2xl cursor-crosshair touch-none"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </motion.div>
    </div>
  );
}
