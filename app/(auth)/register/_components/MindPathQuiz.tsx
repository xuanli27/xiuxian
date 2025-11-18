import React, { useState, useRef } from 'react';
import { Check, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui';
import clsx from 'clsx';

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
      <div className="text-center mb-10 animate-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 bg-surface-800 rounded-2xl mx-auto mb-4 flex items-center justify-center text-secondary-400 shadow-lg border border-border-base">
            <BrainCircuit size={32} />
        </div>
        <h1 className="font-xianxia text-4xl text-secondary-400 mb-2">问心路</h1>
        <p className="text-content-400">直面本心，方得始终</p>
      </div>
      
      <div className="w-full max-w-lg bg-surface-800/50 backdrop-blur-md p-8 rounded-3xl border border-border-base shadow-2xl relative overflow-hidden">
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
        
        <h2 className="text-2xl font-serif mb-8 leading-relaxed font-bold animate-in fade-in slide-in-from-right-4 duration-300 key={step}">
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
      </div>
    </div>
  );
};