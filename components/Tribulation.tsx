import React, { useState, useEffect } from 'react';
import { generateTribulationQuiz, QuizQuestion } from '../services/geminiService';
import { Zap, Skull, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  rank: string;
  onSuccess: () => void;
  onFail: () => void;
  onClose: () => void;
}

export const Tribulation: React.FC<Props> = ({ rank, onSuccess, onFail, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      const qs = await generateTribulationQuiz(rank);
      setQuestions(qs);
      setLoading(false);
    };
    load();
  }, [rank]);

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

  const passed = score >= 2; // Need 2/3 to pass

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-indigo-400">
        <Zap size={64} className="animate-bounce mb-4" />
        <h2 className="font-xianxia text-3xl animate-pulse">天道运筹中...</h2>
        <p className="text-slate-500 mt-2">正在生成针对道友的心魔劫数</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
        <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full text-center border-2 border-slate-600">
          {passed ? (
            <>
              <div className="mx-auto w-20 h-20 bg-emerald-900/50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-xianxia text-emerald-400 mb-2">渡劫成功</h2>
              <p className="text-slate-400 mb-6">道友福缘深厚，境界已破！</p>
              <button onClick={onSuccess} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold">
                巩固修为
              </button>
            </>
          ) : (
            <>
               <div className="mx-auto w-20 h-20 bg-rose-900/50 rounded-full flex items-center justify-center mb-6">
                <Skull size={40} className="text-rose-400" />
              </div>
              <h2 className="text-3xl font-xianxia text-rose-400 mb-2">渡劫失败</h2>
              <p className="text-slate-400 mb-6">天雷滚滚，道友不幸陨落...速速兵解重修！</p>
              <button onClick={onFail} className="w-full py-3 bg-rose-600 hover:bg-rose-500 rounded-lg font-bold">
                兵解重修 (损失修为)
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/50 rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/50">
        {/* Header */}
        <div className="bg-indigo-900/30 p-4 flex justify-between items-center border-b border-indigo-500/20">
          <span className="font-xianxia text-xl text-indigo-300">天罚第 {currentQ + 1} 重</span>
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className={`h-2 w-6 rounded-full ${i < currentQ ? 'bg-indigo-500' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="p-8">
          <h3 className="text-xl font-serif text-slate-200 mb-8 leading-relaxed">
            {q.question}
          </h3>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let btnClass = "bg-slate-800 hover:bg-slate-700 border-slate-700";
              if (feedback !== null) {
                 if (idx === q.correctIndex) btnClass = "bg-emerald-900 border-emerald-500 text-emerald-200";
                 else if (idx !== q.correctIndex && feedback === false) btnClass = "opacity-50";
              }

              return (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${btnClass}`}
                >
                  <span className="font-bold mr-3 text-slate-500">{['A','B','C','D'][idx]}.</span>
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