import React, { useState, useRef } from 'react';
import { Check, BrainCircuit, Mail } from 'lucide-react';

export const MindPathQuiz: React.FC<{ onComplete: (mind: string, email: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
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

  const getMindState = () => {
    const sum = answersRef.current.reduce((a, b) => a + b, 0);
    if (sum <= 2) return "铁血战狂";
    if (sum <= 5) return "苟道中人";
    if (sum <= 8) return "闲云野鹤";
    return "乐子人";
  };

  const calculateResult = () => {
    setShowEmailInput(true);
  };

  const handleEmailSubmit = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('请输入有效的宗门令牌标识');
      return;
    }
    onComplete(getMindState(), email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 p-6 text-content-100 relative overflow-hidden">
      {/* 仙气背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-surface-950 to-surface-950" />
      
      <div className="text-center mb-10 animate-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 bg-surface-800 rounded-2xl mx-auto mb-4 flex items-center justify-center text-secondary-400 shadow-lg border border-border-base">
            <BrainCircuit size={32} />
        </div>
        <h1 className="font-xianxia text-4xl text-secondary-400 mb-2">问心路</h1>
        <p className="text-content-400">直面本心，方得始终</p>
      </div>
      
      <div className="w-full max-w-lg bg-surface-800/50 backdrop-blur-md p-8 rounded-3xl border border-border-base shadow-2xl relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-surface-700">
            <div 
                className="h-full bg-secondary-500 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
        </div>

        <div className="mb-6 flex justify-between text-xs text-content-400 font-bold tracking-widest mt-2">
          <span>QUESTION {step + 1}</span>
          <span>{questions.length} TOTAL</span>
        </div>
        
        {!showEmailInput ? (
          <>
            <h2 className="text-2xl font-serif mb-8 leading-relaxed font-bold animate-in fade-in slide-in-from-right-4 duration-300" key={step}>
                {questions[step].q}
            </h2>
            
            <div className="space-y-4">
              {questions[step].opts.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-5 rounded-xl bg-surface-700/50 hover:bg-secondary-600 hover:text-white transition-all duration-200 flex items-center justify-between group border border-transparent hover:border-secondary-400/50 hover:shadow-lg hover:-translate-x-1"
                >
                  <span className="font-serif text-lg">{opt}</span>
                  <div className="w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white/20">
                     <Check size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-primary-400 mb-2">道心已定</h2>
              <p className="text-content-300 text-sm">请留下你的宗门令牌,以便日后联络</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-serif text-content-300 flex items-center gap-2">
                <Mail size={16} className="text-primary-400" />
                宗门令牌
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="刻录你的宗门令牌标识"
                className="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-xl text-content-100 placeholder-content-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            <button
              onClick={handleEmailSubmit}
              className="w-full group relative px-6 py-4 bg-transparent overflow-hidden rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-primary-600 transition-all group-hover:brightness-110" />
              <span className="relative flex items-center justify-center gap-2 font-xianxia text-xl font-bold text-white tracking-widest">
                刻录令牌
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};