'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPaintBrush, FaEraser, FaCircle, FaSquare, FaStar, FaUndo, FaRedo, FaDownload, FaTrash, FaImage, FaSave, FaFillDrip } from 'react-icons/fa';

type Tool = 'brush' | 'eraser' | 'circle' | 'square' | 'triangle' | 'star' | 'stamp' | 'fill';
type DrawingAction = {
  type: 'stroke' | 'shape' | 'stamp';
  data: any;
};

const colors = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Purple', value: '#800080' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Gray', value: '#808080' },
  { name: 'Cyan', value: '#00FFFF' },
];

const stamps = ['🌟', '⭐', '🌈', '☀️', '🌙', '⚡', '💫', '✨', '🎨', '🎭', '🎪', '🎡', '🎢', '🎠', '🎯', '🎲', '🎮', '🎸', '🎹', '🎺', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [shapeSize, setShapeSize] = useState(50);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showStamps, setShowStamps] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState('🌟');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [previewShape, setPreviewShape] = useState<{x: number, y: number, size: number} | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size responsive
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const width = Math.min(800, container.clientWidth - 32);
      const height = Math.min(600, width * 0.75);

      canvas.width = width;
      canvas.height = height;

      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save initial state
      saveToHistory();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
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

  const floodFill = (x: number, y: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixelColor(imageData, x, y);
    const fillRGB = hexToRgb(fillColor);

    if (!fillRGB || colorsMatch(targetColor, fillRGB)) return;

    const pixelsToCheck = [x, y];
    const width = canvas.width;
    const height = canvas.height;
    const checkedPixels = new Set();

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

  const getPixelColor = (imageData: ImageData, x: number, y: number) => {
    const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4;
    return {
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2],
      a: imageData.data[index + 3]
    };
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const colorsMatch = (a: any, b: any) => {
    return a.r === b.r && a.g === b.g && a.b === b.b;
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

      const saved = localStorage.getItem('superfox-artworks');
      const artworks = saved ? JSON.parse(saved) : [];
      artworks.push(artwork);
      localStorage.setItem('superfox-artworks', JSON.stringify(artworks));

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
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: (touch.clientX - rect.left) * (canvas.width / rect.width),
      y: (touch.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (currentTool === 'fill') {
      floodFill(Math.floor(pos.x), Math.floor(pos.y), currentColor);
      return;
    }

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

    if (['circle', 'square', 'triangle', 'star'].includes(currentTool)) {
      setPreviewShape({ x: pos.x, y: pos.y, size: shapeSize });
    }
  };

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getTouchPos(e);

    if (currentTool === 'fill') {
      floodFill(Math.floor(pos.x), Math.floor(pos.y), currentColor);
      return;
    }

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

    if (['circle', 'square', 'triangle', 'star'].includes(currentTool)) {
      setPreviewShape({ x: pos.x, y: pos.y, size: shapeSize });
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
    setPreviewShape(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);

    // Draw shapes with fixed size
    if (currentTool === 'circle') {
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, shapeSize, 0, 2 * Math.PI);
      ctx.fill();
    } else if (currentTool === 'square') {
      ctx.fillStyle = currentColor;
      ctx.fillRect(startPos.x - shapeSize/2, startPos.y - shapeSize/2, shapeSize, shapeSize);
    } else if (currentTool === 'triangle') {
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y - shapeSize/2);
      ctx.lineTo(startPos.x + shapeSize/2, startPos.y + shapeSize/2);
      ctx.lineTo(startPos.x - shapeSize/2, startPos.y + shapeSize/2);
      ctx.closePath();
      ctx.fill();
    } else if (currentTool === 'star') {
      drawStar(ctx, startPos.x, startPos.y, 5, shapeSize, shapeSize / 2);
    } else if (currentTool === 'stamp') {
      ctx.font = `${shapeSize}px Arial`;
      ctx.fillText(selectedStamp, pos.x - shapeSize/2, pos.y + shapeSize/4);
    }

    saveToHistory();
  };

  const stopDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    setPreviewShape(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastTouch = e.changedTouches[0];
    const rect = canvas.getBoundingClientRect();
    const pos = {
      x: (lastTouch.clientX - rect.left) * (canvas.width / rect.width),
      y: (lastTouch.clientY - rect.top) * (canvas.height / rect.height)
    };

    // Draw shapes with fixed size
    if (currentTool === 'circle') {
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, shapeSize, 0, 2 * Math.PI);
      ctx.fill();
    } else if (currentTool === 'square') {
      ctx.fillStyle = currentColor;
      ctx.fillRect(startPos.x - shapeSize/2, startPos.y - shapeSize/2, shapeSize, shapeSize);
    } else if (currentTool === 'triangle') {
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y - shapeSize/2);
      ctx.lineTo(startPos.x + shapeSize/2, startPos.y + shapeSize/2);
      ctx.lineTo(startPos.x - shapeSize/2, startPos.y + shapeSize/2);
      ctx.closePath();
      ctx.fill();
    } else if (currentTool === 'star') {
      drawStar(ctx, startPos.x, startPos.y, 5, shapeSize, shapeSize / 2);
    } else if (currentTool === 'stamp') {
      ctx.font = `${shapeSize}px Arial`;
      ctx.fillText(selectedStamp, pos.x - shapeSize/2, pos.y + shapeSize/4);
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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-purple-600 mb-2 baloo">🎨 Drawing Studio</h1>
        <p className="text-lg md:text-xl text-gray-700">Create amazing artwork!</p>
      </motion.div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 mb-6">
        {/* Tools */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentTool('brush')}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base transition-all ${currentTool === 'brush' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <FaPaintBrush className="text-sm md:text-base" /> <span className="hidden sm:inline">Brush</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentTool('fill')}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base transition-all ${currentTool === 'fill' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <FaFillDrip className="text-sm md:text-base" /> <span className="hidden sm:inline">Fill</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentTool('eraser')}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base transition-all ${currentTool === 'eraser' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <FaEraser className="text-sm md:text-base" /> <span className="hidden sm:inline">Eraser</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentTool('circle')}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base transition-all ${currentTool === 'circle' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <FaCircle className="text-sm md:text-base" /> <span className="hidden sm:inline">Circle</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentTool('square')}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base transition-all ${currentTool === 'square' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <FaSquare className="text-sm md:text-base" /> <span className="hidden sm:inline">Square</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentTool('triangle')}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base transition-all ${currentTool === 'triangle' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <span className="text-sm md:text-base">▲</span> <span className="hidden sm:inline">Triangle</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentTool('star')}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base transition-all ${currentTool === 'star' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <FaStar className="text-sm md:text-base" /> <span className="hidden sm:inline">Star</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setCurrentTool('stamp'); setShowStamps(!showStamps); }}
            className={`px-3 py-2 md:px-4 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm md:text-base transition-all ${currentTool === 'stamp' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            <FaImage className="text-sm md:text-base" /> <span className="hidden sm:inline">Stamps</span>
          </motion.button>
        </div>

        {/* Stamps Panel */}
        {showStamps && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-purple-50 rounded-2xl p-3 mb-4">
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {stamps.map((stamp) => (
                <motion.button key={stamp} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedStamp(stamp)}
                  className={`text-2xl md:text-3xl p-2 rounded-lg transition-all ${selectedStamp === stamp ? 'bg-purple-300 shadow-lg' : 'bg-white hover:bg-purple-100'}`}>
                  {stamp}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Professional Color Palette - Grid Layout */}
        <div className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-2">Colors:</p>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {colors.map((color) => (
              <motion.button key={color.value} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentColor(color.value)}
                className={`h-10 md:h-12 rounded-lg transition-all shadow-md ${currentColor === color.value ? 'ring-4 ring-purple-400 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Size Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 text-sm">Brush Size: {brushSize}px</label>
            <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 text-sm">Shape Size: {shapeSize}px</label>
            <input type="range" min="10" max="150" value={shapeSize} onChange={(e) => setShapeSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={undo} disabled={historyStep <= 0}
            className="px-3 py-2 md:px-4 md:py-3 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base">
            <FaUndo /> Undo
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={redo} disabled={historyStep >= history.length - 1}
            className="px-3 py-2 md:px-4 md:py-3 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base">
            <FaRedo /> Redo
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearCanvas}
            className="px-3 py-2 md:px-4 md:py-3 bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 text-sm md:text-base">
            <FaTrash /> Clear
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadArtwork}
            className="px-3 py-2 md:px-4 md:py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 text-sm md:text-base">
            <FaDownload /> <span className="hidden sm:inline">Download</span>
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={saveToGallery}
            className="px-3 py-2 md:px-4 md:py-3 bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-600 text-sm md:text-base">
            <FaSave /> <span className="hidden sm:inline">Save</span>
          </motion.button>
        </div>

        {/* Save Confirmation */}
        {showSaveConfirmation && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-4 bg-green-100 border-2 border-green-500 rounded-xl p-4 text-center">
            <p className="text-green-700 font-bold text-lg">✅ Artwork saved to gallery!</p>
          </motion.div>
        )}
      </div>

      {/* Canvas with Shape Preview */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-4 flex justify-center relative">
        <div className="relative">
          <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={() => setIsDrawing(false)}
            onTouchStart={startDrawingTouch} onTouchMove={drawTouch} onTouchEnd={stopDrawingTouch}
            className="border-4 border-purple-300 rounded-2xl cursor-crosshair touch-none max-w-full h-auto"
          />
          {/* Shape Size Preview */}
          {previewShape && ['circle', 'square', 'triangle', 'star'].includes(currentTool) && (
            <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-2 rounded-lg font-bold shadow-lg text-sm">
              Size: {shapeSize}px
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
