
import React, { useRef, useState, useEffect } from 'react';
import { GameView, SpiritRootType, Rank } from '../types';
import { generateSpiritRootFeedback } from '../services/geminiService';
import { Zap, Check, Eraser } from 'lucide-react';

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
    ctx.strokeStyle = '#10B981'; // Emerald 500 default for spirit
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
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 p-4 text-content-100">
      <h1 className="font-xianxia text-4xl text-primary-400 mb-2 animate-in fade-in slide-in-from-top-4 duration-700">测灵根</h1>
      <p className="mb-6 text-content-400 text-sm font-serif">请随心绘制一笔，感知天地灵气</p>
      
      <div className="relative border-4 border-surface-700 rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10 bg-surface-800">
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
          className="cursor-crosshair touch-none bg-surface-800"
        />
        {analyzing && (
          <div className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm flex items-center justify-center">
             <div className="animate-pulse text-primary-400 font-bold font-xianxia text-2xl">鉴别中...</div>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button 
          onClick={() => {
             const canvas = canvasRef.current;
             if(canvas) canvas.getContext('2d')?.clearRect(0,0, canvas.width, canvas.height);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-700 hover:bg-surface-600 transition text-content-200 font-bold"
        >
          <Eraser size={18} /> 重绘
        </button>
        <button 
          onClick={analyzeSpirit}
          disabled={analyzing}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition shadow-lg shadow-primary-600/30"
        >
          <Zap size={18} /> 鉴定
        </button>
      </div>

      {feedback && (
        <div className="mt-8 p-6 bg-surface-800 border border-primary-500/30 rounded-2xl max-w-md animate-in zoom-in duration-300 shadow-xl">
          <p className="text-primary-400 italic text-center text-lg font-serif">“{feedback}”</p>
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 p-6 text-content-100">
      <h1 className="font-xianxia text-4xl text-secondary-400 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">问心路</h1>
      
      <div className="w-full max-w-md bg-surface-800 p-8 rounded-3xl border border-border-base shadow-2xl">
        <div className="mb-6 flex justify-between text-xs text-content-400 font-bold tracking-widest">
          <span>QUESTION {step + 1}</span>
          <span>{questions.length} TOTAL</span>
        </div>
        
        <h2 className="text-2xl font-serif mb-8 leading-relaxed font-bold">{questions[step].q}</h2>
        
        <div className="space-y-4">
          {questions[step].opts.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full text-left p-5 rounded-xl bg-surface-700 hover:bg-secondary-600 hover:text-white transition-all duration-200 flex items-center justify-between group border border-transparent hover:border-secondary-400/50 hover:shadow-lg"
            >
              <span className="font-serif">{opt}</span>
              <Check size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
