import React, { useRef, useState, useEffect } from 'react';
import { GameView, SpiritRootType } from '../types';
import { generateSpiritRootFeedback } from '../services/geminiService';
import { Zap, Check, Eraser } from 'lucide-react';

interface Props {
  onComplete: (root: SpiritRootType, mind: string, avatar: string) => void;
}

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
    ctx.strokeStyle = '#A7F3D0'; // Emerald 200
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

    // Simple Pixel Analysis
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
      const avatarUrl = canvas.toDataURL(); // Save drawing as avatar
      onNext(rootType, avatarUrl);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 text-slate-200">
      <h1 className="font-xianxia text-4xl text-emerald-400 mb-2">测灵根</h1>
      <p className="mb-6 text-slate-400 text-sm">请随心绘制一笔，感知天地灵气</p>
      
      <div className="relative border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl shadow-emerald-900/20 bg-slate-800">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="cursor-crosshair touch-none"
        />
        {analyzing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
             <div className="animate-pulse text-emerald-400 font-bold">鉴别中...</div>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button 
          onClick={() => {
             const canvas = canvasRef.current;
             if(canvas) canvas.getContext('2d')?.clearRect(0,0, canvas.width, canvas.height);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 transition"
        >
          <Eraser size={18} /> 重绘
        </button>
        <button 
          onClick={analyzeSpirit}
          disabled={analyzing}
          className="flex items-center gap-2 px-6 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-600/30"
        >
          <Zap size={18} /> 鉴定
        </button>
      </div>

      {feedback && (
        <div className="mt-6 p-4 bg-slate-800 border border-emerald-500/30 rounded max-w-md animate-fade-in">
          <p className="text-emerald-300 italic">“{feedback}”</p>
        </div>
      )}
    </div>
  );
};

export const MindPathQuiz: React.FC<{ onComplete: (mind: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const answersRef = useRef<number[]>([]);

  const questions = [
    {
      q: "修仙路漫漫，若遇强敌阻路，你当如何？",
      opts: ["正面硬刚，虽死无悔", "跪地求饶，留得青山", "转身就跑，日后再战", "试图向他推销保险"]
    },
    {
      q: "获得一本无上魔功，修炼需献祭发际线，你练吗？",
      opts: ["练！变强无需头发", "不练，颜值即正义", "偷偷练，带假发", "把它卖给秃头师兄"]
    },
    {
      q: "师门遭遇围攻，掌门命你突围求援，你会？",
      opts: ["立刻出发，如实求援", "找个地方躲起来睡觉", "投靠敌方做卧底", "在路边摆摊卖瓜"]
    }
  ];

  const handleAnswer = (idx: number) => {
    answersRef.current.push(idx);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const sum = answersRef.current.reduce((a, b) => a + b, 0);
    let mind = "凡夫俗子";
    if (sum <= 2) mind = "铁血战狂";
    else if (sum <= 5) mind = "苟道中人";
    else if (sum <= 8) mind = "闲云野鹤";
    else mind = "乐子人";
    
    onComplete(mind);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 text-slate-200">
      <h1 className="font-xianxia text-3xl text-indigo-400 mb-8">问心路</h1>
      
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
        <div className="mb-4 flex justify-between text-xs text-slate-500">
          <span>QUESTION {step + 1}</span>
          <span>{questions.length} TOTAL</span>
        </div>
        
        <h2 className="text-xl font-serif mb-6 leading-relaxed">{questions[step].q}</h2>
        
        <div className="space-y-3">
          {questions[step].opts.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full text-left p-4 rounded-lg bg-slate-700 hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-between group"
            >
              <span>{opt}</span>
              <Check size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};