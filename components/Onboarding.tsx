
import React, { useRef, useState, useEffect } from 'react';
import { GameView, SpiritRootType, Rank } from '../types';
import { generateSpiritRootFeedback } from '../services/geminiService';
import { INTRO_SCENARIOS } from '../data/constants';
import { Zap, Check, Eraser, Sparkles, ArrowRight } from 'lucide-react';

export const IntroStory: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [scenario, setScenario] = useState(INTRO_SCENARIOS[0]);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    const randomScenario = INTRO_SCENARIOS[Math.floor(Math.random() * INTRO_SCENARIOS.length)];
    setScenario(randomScenario);
    const timer = setTimeout(() => setShowQuote(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 p-6 text-content-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-800/50 via-surface-950 to-surface-950 z-0" />
      
      <div className="max-w-lg w-full z-10 space-y-8 text-center">
        <div className="space-y-4 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-block p-3 bg-surface-900 rounded-full border border-primary-500/30 mb-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
             <Sparkles size={32} className="text-primary-400 animate-pulse" />
          </div>
          <h1 className="font-xianxia text-4xl text-secondary-400 leading-relaxed drop-shadow-lg">{scenario.title}</h1>
          <p className="text-content-200 font-serif text-lg leading-relaxed border-t border-b border-white/5 py-4">
            {scenario.desc}
          </p>
        </div>

        <div className={`transition-all duration-1000 ease-out transform ${showQuote ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <blockquote className="relative p-6 bg-surface-900/80 border border-primary-500/30 rounded-xl shadow-xl">
             <span className="absolute -top-4 left-4 text-6xl text-primary-600/20 font-serif">“</span>
             <p className="text-primary-400 font-xianxia text-xl italic leading-loose tracking-wider">
               {scenario.quote}
             </p>
             <span className="absolute -bottom-8 right-4 text-6xl text-primary-600/20 font-serif rotate-180">“</span>
          </blockquote>
        </div>

        <div className={`pt-8 transition-all duration-1000 delay-500 ${showQuote ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={onNext}
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-primary-600 transition-all group-hover:brightness-110" />
            <span className="relative flex items-center gap-2 font-xianxia text-xl font-bold text-white tracking-widest">
              踏入仙途 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <p className="mt-4 text-xs text-content-400 opacity-50">即使是咸鱼，也要做最咸的那一条</p>
        </div>
      </div>
    </div>
  );
};

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