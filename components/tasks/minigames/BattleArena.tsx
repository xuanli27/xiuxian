
import React, { useState, useEffect, useRef } from 'react';
import { Swords, Shield, Zap } from 'lucide-react';
import { Button } from '../../ui/Shared';

export const BattleArena = ({ playerPower, enemy, onComplete }: { playerPower: number, enemy: any, onComplete: (s: boolean) => void }) => {
   const [log, setLog] = useState<string[]>(["遭遇了 " + enemy.name + "!"]);
   const [enemyHp, setEnemyHp] = useState(100);
   const [playerHp, setPlayerHp] = useState(100);
   const [finished, setFinished] = useState(false);
   const [attacking, setAttacking] = useState(false);
   const logRef = useRef<HTMLDivElement>(null);

   const attack = () => {
      if (finished || attacking) return;
      setAttacking(true);
      
      const dmg = 20 + Math.random() * 15 + (playerPower > 2000 ? 10 : 0);
      setEnemyHp(h => Math.max(0, h - dmg));
      setLog(l => [...l, `你发动了 "逻辑闭环" ! 造成 ${Math.floor(dmg)} 点精神伤害`]);

      if (enemyHp - dmg <= 0) {
         setFinished(true); 
         setTimeout(() => onComplete(true), 1500); 
         return;
      }

      setTimeout(() => {
         const eDmg = 10 + Math.random() * 20;
         setPlayerHp(h => Math.max(0, h - eDmg));
         setLog(l => [...l, `${enemy.name} 使用了 "无效需求" ! 造成 ${Math.floor(eDmg)} 点精神伤害`]);
         setAttacking(false);
         if (playerHp - eDmg <= 0) { setFinished(true); setTimeout(() => onComplete(false), 1500); }
      }, 800);
   };

   useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

   return (
      <div className="p-4 space-y-6 bg-surface-900 rounded-2xl">
         {/* Battle HUD */}
         <div className="flex justify-between items-center gap-4">
            <div className="flex-1 text-center">
                 <div className="text-4xl mb-2 transform -scale-x-100 inline-block">🦸</div>
                 <div className="relative h-4 bg-surface-800 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500" style={{width: `${playerHp}%`}}/>
                 </div>
                 <div className="text-xs mt-1 text-primary-400 font-bold">{playerHp.toFixed(0)} HP</div>
            </div>
            
            <div className="font-xianxia font-bold text-3xl text-danger-500 animate-pulse italic">VS</div>
             
            <div className="flex-1 text-center">
                 <div className="text-4xl mb-2 inline-block animate-bounce">{enemy.avatar}</div>
                 <div className="relative h-4 bg-surface-800 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-gradient-to-r from-danger-600 to-danger-400 transition-all duration-500" style={{width: `${enemyHp}%`}}/>
                 </div>
                 <div className="text-xs mt-1 text-danger-400 font-bold">{enemyHp.toFixed(0)} HP</div>
            </div>
         </div>

         {/* Battle Log */}
         <div ref={logRef} className="h-40 bg-surface-950 rounded-xl p-4 overflow-y-auto font-mono text-xs space-y-2 border border-white/5 shadow-inner scroll-smooth">
            {log.map((line, i) => (
                <div key={i} className="text-content-400 border-b border-white/5 pb-1 animate-in fade-in slide-in-from-left-2 last:text-content-100 last:font-bold">
                    {line}
                </div>
            ))}
         </div>

         {/* Action Bar */}
         {!finished ? (
            <Button 
                onClick={attack} 
                disabled={attacking}
                variant="danger" 
                className="w-full h-14 text-lg shadow-[0_0_20px_rgba(220,38,38,0.3)]" 
                icon={attacking ? <Zap className="animate-spin" /> : <Swords size={20} />}
            >
                {attacking ? "回合结算中..." : "发起嘴遁 (Attack)"}
            </Button>
         ) : (
            <div className="flex items-center justify-center h-14 bg-surface-800 rounded-xl border border-white/10">
                <span className={`text-2xl font-bold font-xianxia animate-pulse ${playerHp > 0 ? 'text-primary-400' : 'text-danger-400'}`}>
                    {playerHp > 0 ? "辩 论 胜 利" : "惨 遭 压 制"}
                </span>
            </div>
         )}
      </div>
   );
};
