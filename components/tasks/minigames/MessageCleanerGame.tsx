
import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle } from 'lucide-react';

export const MessageCleanerGame = ({ duration, onComplete }: { duration: number, onComplete: (s: boolean) => void }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [msgs, setMsgs] = useState<{id: number, x: number, y: number, type: 'mail'|'chat'}[]>([]);
  
  useEffect(() => {
     const timer = setInterval(() => {
        setTimeLeft(t => {
           if (t <= 0) { clearInterval(timer); onComplete(score >= 5); return 0; }
           return t - 0.1;
        });
     }, 100);
     const spawner = setInterval(() => {
        if (Math.random() > 0.2) {
            setMsgs(b => [...b, { 
                id: Math.random(), 
                x: Math.random() * 80 + 10, 
                y: Math.random() * 80 + 10,
                type: Math.random() > 0.5 ? 'mail' : 'chat'
            }]);
        }
     }, 500);
     return () => { clearInterval(timer); clearInterval(spawner); };
  }, []);

  return (
    <div className="h-[400px] relative bg-surface-900 select-none overflow-hidden cursor-crosshair rounded-2xl border border-border-base shadow-inner">
       {/* HUD */}
       <div className="absolute top-3 left-3 z-20 flex gap-3">
           <div className="text-xs font-mono text-primary-400 bg-surface-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-primary-500/30 shadow-lg">
               TIME: {timeLeft.toFixed(1)}s
           </div>
           <div className="text-xs font-mono text-white bg-surface-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
               CLEARED: {score}/5
           </div>
       </div>

       <div className="absolute bottom-3 right-3 text-[10px] text-content-400 opacity-50 font-mono">
           SYSTEM_OVERLOAD: CLICK_TO_DELETE
       </div>

       {msgs.map(msg => (
          <div 
            key={msg.id} 
            onMouseDown={() => { setMsgs(b => b.filter(x => x.id !== msg.id)); setScore(s => s + 1); }} 
            className="absolute text-4xl cursor-pointer hover:scale-125 active:scale-90 transition-transform animate-in zoom-in duration-300 drop-shadow-lg" 
            style={{ left: `${msg.x}%`, top: `${msg.y}%` }}
          >
            <div className="relative">
                {msg.type === 'mail' ? <Mail className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" /> : <MessageCircle className="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-surface-900 animate-bounce flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">1</span>
                </div>
            </div>
          </div>
       ))}
    </div>
  );
};
