
import React, { useRef, useState } from 'react';
import { SpiritRootType } from '../../types';
import { generateSpiritRootFeedback } from '../../services/geminiService';
import { Zap, Eraser, Palette } from 'lucide-react';
import { Button } from '../ui/Shared';

export const SpiritRootCanvas: React.FC<{ onNext: (root: SpiritRootType, avatar: string) => void }> = ({ onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e as React.MouseEvent;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e as React.MouseEvent;
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#10B981');
    gradient.addColorStop(1, '#3B82F6');
    ctx.strokeStyle = gradient;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const analyzeSpirit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setAnalyzing(true);

    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let coloredPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i+3] > 0) coloredPixels++;
    }
    
    const coverage = (coloredPixels / (canvas.width * canvas.height)) * 100;
    let rootType = SpiritRootType.WASTE;
    let chaosScore = 50;

    if (coverage < 2) {
      rootType = SpiritRootType.WASTE;
      chaosScore = 10;
    } else if (coverage < 10) {
      rootType = SpiritRootType.HUMAN;
      chaosScore = 40;
    } else if (coverage < 25) {
      rootType = SpiritRootType.EARTH;
      chaosScore = 70;
    } else {
      rootType = SpiritRootType.HEAVEN;
      chaosScore = 90;
    }

    const aiFeedback = await generateSpiritRootFeedback(chaosScore);
    setFeedback(aiFeedback);
    setAnalyzing(false);

    setTimeout(() => {
      const avatarUrl = canvas.toDataURL();
      onNext(rootType, avatarUrl);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 p-4 text-content-100">
      <div className="text-center mb-8 animate-in slide-in-from-top-4 duration-700">
        <div className="w-16 h-16 bg-surface-800 rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-400 shadow-lg border border-border-base">
            <Palette size={32} />
        </div>
        <h1 className="font-xianxia text-4xl text-transparent bg-clip-text bg-gradient-to-b from-primary-300 to-primary-600 mb-2">测灵根</h1>
        <p className="text-content-400 text-sm font-serif">请随心绘制一笔，感知天地灵气</p>
      </div>
      
      <div className="relative border-4 border-surface-700 rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10 bg-surface-900 mb-8 group">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="cursor-crosshair touch-none bg-surface-900"
        />
        
        {/* Instructions Overlay */}
        {!isDrawing && !analyzing && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 group-hover:opacity-0 transition-opacity">
                 <span className="text-content-400 text-xs border border-dashed border-content-400/30 px-4 py-2 rounded-full">在此区域绘制</span>
             </div>
        )}

        {analyzing && (
          <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
             <Zap size={48} className="text-primary-400 animate-bounce mb-4" />
             <div className="text-primary-400 font-bold font-xianxia text-2xl animate-pulse">鉴定中...</div>
          </div>
        )}
      </div>

      <div className="flex gap-4 z-10">
        <Button 
          variant="ghost"
          onClick={() => {
             const canvas = canvasRef.current;
             if(canvas) canvas.getContext('2d')?.clearRect(0,0, canvas.width, canvas.height);
          }}
          icon={<Eraser size={18} />}
        >
          重绘
        </Button>
        <Button 
          variant="primary"
          size="lg"
          onClick={analyzeSpirit}
          disabled={analyzing}
          icon={<Zap size={18} />}
        >
          开始鉴定
        </Button>
      </div>

      {feedback && (
        <div className="mt-8 p-6 bg-surface-800/90 border border-primary-500/30 rounded-2xl max-w-md animate-in zoom-in duration-500 shadow-xl">
          <p className="text-primary-400 italic text-center text-xl font-serif leading-relaxed">“{feedback}”</p>
        </div>
      )}
    </div>
  );
};
