
import React, { useState, useEffect } from 'react';
import { LOGIC_PUZZLES } from '@/data/constants';
import { CheckCircle, X, Bug } from 'lucide-react';
import clsx from 'clsx';

export const LogicPuzzleGame = ({ onComplete }: { onComplete: (s: boolean) => void }) => {
    const [puzzle, setPuzzle] = useState(LOGIC_PUZZLES[0]);
    const [answered, setAnswered] = useState<number | null>(null);

    useEffect(() => {
        const random = LOGIC_PUZZLES[Math.floor(Math.random() * LOGIC_PUZZLES.length)];
        setPuzzle(random);
    }, []);

    const handleAnswer = (idx: number) => {
        setAnswered(idx);
        const isCorrect = idx === puzzle.a;
        setTimeout(() => onComplete(isCorrect), 1500);
    };

    return (
        <div className="w-full max-w-md bg-surface-900/95 backdrop-blur rounded-2xl p-6 border border-primary-500/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2 text-primary-400 font-mono text-xs bg-primary-900/20 px-3 py-1.5 rounded-full border border-primary-500/30">
                    <Bug size={14} />
                    <span>DEBUGGING_SESSION_#892</span>
                </div>
            </div>
            
            
            <div className="font-mono text-lg text-content-100 mb-8 font-bold leading-relaxed border-l-4 border-primary-500 pl-4">
                {puzzle.q}
            </div>

            <div className="grid grid-cols-1 gap-3">
                {puzzle.options.map((opt, idx) => {
                    const isSelected = answered === idx;
                    const isCorrect = idx === puzzle.a;
                    
                    let variant = "bg-surface-800 border-surface-700 hover:bg-surface-700 hover:border-primary-500/50";
                    if (answered !== null) {
                        if (isCorrect) variant = "bg-primary-600 text-white border-primary-500";
                        else if (isSelected) variant = "bg-danger-600 text-white border-danger-500";
                        else variant = "bg-surface-800 opacity-30 border-transparent";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={answered !== null}
                            onClick={() => handleAnswer(idx)}
                            className={clsx("w-full text-left px-5 py-4 rounded-xl transition-all duration-300 font-mono text-sm flex justify-between items-center border", variant)}
                        >
                            <span>{opt}</span>
                            {answered !== null && isCorrect && <CheckCircle size={18} className="animate-in zoom-in" />}
                            {answered !== null && isSelected && !isCorrect && <X size={18} className="animate-in zoom-in" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
