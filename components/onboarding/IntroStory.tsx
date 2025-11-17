
import React, { useState, useEffect } from 'react';
import { INTRO_SCENARIOS } from '../../data/constants';
import { Sparkles, ArrowRight } from 'lucide-react';

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
          <h1 className="font-xianxia text-5xl text-secondary-400 leading-relaxed drop-shadow-lg">{scenario.title}</h1>
          <p className="text-content-200 font-serif text-lg leading-relaxed border-t border-b border-white/5 py-6 bg-surface-900/30 backdrop-blur-sm rounded-xl px-4">
            {scenario.desc}
          </p>
        </div>

        <div className={`transition-all duration-1000 ease-out transform ${showQuote ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <blockquote className="relative p-6 bg-surface-900/80 border border-primary-500/30 rounded-xl shadow-2xl">
             <span className="absolute -top-4 left-4 text-6xl text-primary-600/20 font-serif">“</span>
             <p className="text-primary-400 font-xianxia text-2xl italic leading-loose tracking-wider">
               {scenario.quote}
             </p>
             <span className="absolute -bottom-8 right-4 text-6xl text-primary-600/20 font-serif rotate-180">“</span>
          </blockquote>
        </div>

        <div className={`pt-8 transition-all duration-1000 delay-500 ${showQuote ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={onNext}
            className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-primary-600 transition-all group-hover:brightness-110" />
            <span className="relative flex items-center gap-3 font-xianxia text-2xl font-bold text-white tracking-widest">
              踏入仙途 <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <p className="mt-6 text-xs text-content-400 opacity-50 tracking-widest uppercase">即使是咸鱼 · 也要做最咸的那一条</p>
        </div>
      </div>
    </div>
  );
};
