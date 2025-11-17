
import React, { useState, useEffect } from 'react';
import { MOYU_SITES } from '../../data/constants';
import { Compass, Globe, ExternalLink, CheckCircle, Loader2, Briefcase, BrainCircuit, Code, TrendingUp, X } from 'lucide-react';
import { Button } from '../ui/Shared';
import { StockMarketGame } from './minigames/StockMarketGame';
import { LogicPuzzleGame } from './minigames/LogicPuzzleGame';
import clsx from 'clsx';

export const NavigationStation = ({ duration, onComplete }: { duration: number, onComplete: (s: boolean) => void }) => {
  const [timer, setTimer] = useState(duration);
  const [currentSite, setCurrentSite] = useState<{name:string, url:string, gameType?: string} | null>(null);
  const [activeTimer, setActiveTimer] = useState(false);

  useEffect(() => {
    let interval: any;
    if (activeTimer && timer > 0) {
       interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timer]);

  const handleSiteClick = (site: any) => {
      setCurrentSite(site);
      if (!site.gameType || site.gameType === 'TIMER') {
        setActiveTimer(true);
      }
  };

  const handleBack = () => {
      setCurrentSite(null);
      setActiveTimer(false);
      setTimer(duration); 
  };

  const renderControlPanel = () => {
      if (!currentSite) return null;

      if (currentSite.gameType === 'STOCK') {
          return (
              <div className="absolute bottom-0 left-0 right-0 bg-surface-950/90 backdrop-blur-lg border-t border-border-base p-4 shadow-2xl animate-in slide-in-from-bottom-10 z-30">
                  <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
                      <StockMarketGame onComplete={onComplete} />
                  </div>
              </div>
          );
      }

      if (currentSite.gameType === 'LOGIC') {
          return (
               <div className="absolute bottom-0 left-0 right-0 bg-surface-950/90 backdrop-blur-lg border-t border-border-base p-4 shadow-2xl animate-in slide-in-from-bottom-10 z-30">
                  <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
                      <LogicPuzzleGame onComplete={onComplete} />
                  </div>
              </div>
          );
      }

      return (
        <div className="absolute bottom-8 right-8 z-30">
             <Button 
                disabled={timer > 0} 
                onClick={() => onComplete(true)} 
                size="lg" 
                variant={timer > 0 ? 'secondary' : 'primary'}
                className={clsx("shadow-2xl font-bold text-lg min-w-[200px]", timer > 0 ? "opacity-90" : "animate-bounce")}
            >
            {timer > 0 ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> 摸鱼中 {timer}s</span>
            ) : (
                "摸鱼完成 (领取奖励)"
            )}
            </Button>
        </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-surface-950 rounded-2xl overflow-hidden border border-border-base">
      {/* Address Bar */}
      <div className="bg-surface-900 p-3 border-b border-border-base flex items-center gap-3 shrink-0 shadow-sm z-20">
         <button onClick={handleBack} disabled={!currentSite} className="p-2 hover:bg-surface-800 rounded-lg text-content-400 disabled:opacity-30 transition-colors">
            <X size={20} />
         </button>
         
         <div className="flex-1 bg-surface-950 rounded-lg px-4 py-2.5 text-xs text-content-400 font-mono truncate border border-border-base flex items-center shadow-inner">
            <Globe size={14} className="mr-2 text-primary-400" />
            <span className="truncate select-all">{currentSite?.url || "moyu://portal (摸鱼导航站)"}</span>
         </div>

         {/* Timer display for generic sites */}
         {currentSite && (!currentSite.gameType || currentSite.gameType === 'TIMER') && (
            <div className="bg-surface-800 px-3 py-1.5 rounded-lg border border-border-base min-w-[80px] text-center">
                {timer > 0 ? (
                    <span className={clsx("font-mono font-bold flex items-center justify-center gap-1", activeTimer ? "text-secondary-400" : "text-content-400")}>
                        {timer}s
                    </span>
                ) : (
                    <span className="text-primary-400 font-bold flex items-center justify-center">
                        <CheckCircle size={14} />
                    </span>
                )}
            </div>
         )}
         
         {currentSite && (
             <a href={currentSite.url} target="_blank" rel="noreferrer" className="p-2 hover:bg-surface-800 rounded-lg text-content-400 transition-colors" title="在外部浏览器打开">
                <ExternalLink size={20} />
             </a>
         )}
      </div>

      {/* Viewport */}
      <div className="flex-1 relative bg-surface-100 w-full overflow-hidden">
         {currentSite ? (
             <>
                <iframe 
                    src={currentSite.url} 
                    className="w-full h-full border-0 bg-white" 
                    sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation"
                    title="Moyu Browser" 
                />
                {renderControlPanel()}
             </>
         ) : (
             <div className="h-full overflow-y-auto p-6 bg-surface-950 text-content-100">
                 <div className="max-w-5xl mx-auto mt-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-900/20 mb-4 border border-primary-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            <Compass size={40} className="text-primary-400" />
                        </div>
                        <h2 className="text-3xl font-xianxia text-primary-400 mb-2">摸鱼导航站</h2>
                        <p className="text-content-400 font-serif">“工欲善其事，必先利其器”</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {MOYU_SITES.map((category, idx) => (
                            <div key={idx} className="bg-surface-900/50 backdrop-blur-sm rounded-3xl border border-border-base p-6 shadow-lg">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-secondary-400 border-b border-white/5 pb-3">
                                    {idx === 0 ? <Briefcase size={20} /> : <BrainCircuit size={20} />}
                                    {category.category}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {category.sites.map((site: any, sIdx) => (
                                        <button 
                                            key={sIdx}
                                            onClick={() => handleSiteClick(site)}
                                            className="flex flex-col items-start p-4 rounded-2xl bg-surface-800 hover:bg-surface-700 hover:-translate-y-1 transition-all border border-transparent hover:border-primary-500/30 group text-left w-full relative overflow-hidden shadow-sm"
                                        >
                                            <span className="font-bold text-content-100 group-hover:text-primary-400 transition-colors z-10">{site.name}</span>
                                            <span className="text-xs text-content-400 mt-1 z-10 opacity-70">{site.desc}</span>
                                            {site.gameType === 'STOCK' && <TrendingUp className="absolute right-3 bottom-3 opacity-10 text-secondary-500" size={48} />}
                                            {site.gameType === 'LOGIC' && <Code className="absolute right-3 bottom-3 opacity-10 text-primary-500" size={48} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};
