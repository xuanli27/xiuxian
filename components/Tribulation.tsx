
import React, { useState, useEffect } from 'react';
import { generateTribulationQuiz, QuizQuestion } from '../services/geminiService';
import { useGameStore } from '../store/useGameStore';
import { getRankLabel } from '../types';
import { Zap, Skull, CheckCircle, Briefcase } from 'lucide-react';

export const Tribulation: React.FC = () => {
  const { player, breakthroughSuccess, breakthroughFail, setView } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      const rankLabel = getRankLabel(player.rank, player.level);
      const qs = await generateTribulationQuiz(rankLabel);
      setQuestions(qs);
      setLoading(false);
    };
    load();
  }, [player.rank, player.level]);

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === questions[currentQ].correctIndex;
    setFeedback(isCorrect);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const passed = score >= 2; 

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-950/90 backdrop-blur-sm text-primary-500">
        <Zap size={64} className="animate-bounce mb-4" />
        <h2 className="font-xianxia text-4xl animate-pulse">绩效评估中...</h2>
        <p className="text-content-400 mt-2 font-serif">正在生成针对道友的职场危机</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/90 backdrop-blur-md p-4">
        <div className="bg-surface-800 p-8 rounded-3xl max-w-md w-full text-center border-2 border-border-base shadow-2xl animate-in zoom-in duration-300">
          {passed ? (
            <>
              <div className="mx-auto w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mb-6 border border-primary-500/50">
                <CheckCircle size={48} className="text-primary-500" />
              </div>
              <h2 className="text-4xl font-xianxia text-primary-500 mb-3">晋升成功</h2>
              <p className="text-content-400 mb-8">恭喜通过绩效考核，大境界突破，薪水(灵气上限)增加！</p>
              <button onClick={breakthroughSuccess} className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-600/30">
                办理入职/晋升手续
              </button>
            </>
          ) : (
            <>
               <div className="mx-auto w-24 h-24 bg-danger-500/20 rounded-full flex items-center justify-center mb-6 border border-danger-500/50">
                <Skull size={48} className="text-danger-500" />
              </div>
              <h2 className="text-4xl font-xianxia text-danger-500 mb-3">考核失败</h2>
              <p className="text-content-400 mb-8">不仅没涨薪，还背了P0事故锅...扣除半年绩效(修为)。</p>
              <button onClick={breakthroughFail} className="w-full py-4 bg-danger-600 hover:bg-danger-500 text-white rounded-xl font-bold shadow-lg shadow-danger-600/30">
                写检讨书 (损失修为)
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-surface-800 border border-border-base rounded-3xl overflow-hidden shadow-2xl shadow-primary-600/10 animate-in fade-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="bg-surface-900/50 p-6 flex justify-between items-center border-b border-border-base">
          <span className="font-xianxia text-2xl text-primary-400 flex items-center gap-2">
            <Briefcase size={24} /> 
            职场天劫 第 {currentQ + 1} 关
          </span>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className={`h-2 w-8 rounded-full transition-all duration-500 ${i < currentQ ? 'bg-primary-500' : 'bg-surface-700'}`} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="p-8">
          <h3 className="text-xl font-serif text-content-100 mb-8 leading-relaxed font-bold">
            {q.question}
          </h3>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let btnClass = "bg-surface-700 hover:bg-surface-600 border-transparent text-content-200";
              if (feedback !== null) {
                 if (idx === q.correctIndex) btnClass = "bg-primary-600/20 border-primary-500 text-primary-500";
                 else if (idx !== q.correctIndex && feedback === false) btnClass = "opacity-50";
              }

              return (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${btnClass} flex items-center`}
                >
                  <span className="font-bold mr-3 opacity-50 w-6">{['A','B','C','D'][idx]}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
