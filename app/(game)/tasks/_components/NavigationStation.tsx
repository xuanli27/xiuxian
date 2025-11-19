import React, { useState, useEffect } from 'react';
import { MOYU_SITES } from '@/data/constants';
import { Compass, Globe, ExternalLink, CheckCircle, Loader2, Briefcase, BrainCircuit, Code, TrendingUp, X, Eye, Languages, Sparkles } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { StockMarketGame } from './minigames/StockMarketGame';
import { LogicPuzzleGame } from './minigames/LogicPuzzleGame';
import clsx from 'clsx';

export const NavigationStation = ({ duration, onComplete }: { duration: number, onComplete: (s: boolean) => void }) => {
  const [timer, setTimer] = useState(duration);
  const [currentSite, setCurrentSite] = useState<{name:string, url:string, gameType?: string} | null>(null);
  const [activeTimer, setActiveTimer] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [aiResult, setAiResult] = useState<{type: 'summary' | 'translate', content: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer && timer > 0) {
       interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timer]);

  const handleSiteClick = (site: { name: string; url: string; gameType?: string }) => {
      setCurrentSite(site);
      if (!site.gameType || site.gameType === 'TIMER') {
        setActiveTimer(true);
      }
  };

  const handleBack = () => {
      setCurrentSite(null);
      setActiveTimer(false);
      setTimer(duration);
      setIsEditingUrl(false);
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (customUrl.trim()) {
        let url = customUrl.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        setCurrentSite({ name: '自定义网址', url, gameType: 'TIMER' });
        setActiveTimer(true);
        setIsEditingUrl(false);
      }
  };

  const handleDivineScan = async () => {
      if (!currentSite?.url) return;
      setIsProcessing(true);
      try {
        const response = await fetch('/api/ai/process-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: currentSite.url, action: 'summarize' })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          alert(data.error || '神念扫视失败');
          setIsProcessing(false);
          return;
        }
        
        setAiResult({
          type: 'summary',
          content: `【神念扫视结果】\n\n你从这篇文章中领悟到了以下精要：\n\n${data.result}\n\n（消耗灵气：${data.cost}）`
        });
        setIsProcessing(false);
      } catch (error) {
        console.error('神念扫视失败:', error);
        alert('神念扫视失败，请稍后重试');
        setIsProcessing(false);
      }
  };

  const handleDecipherText = async () => {
      if (!currentSite?.url) return;
      setIsProcessing(true);
      try {
        const response = await fetch('/api/ai/process-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: currentSite.url, action: 'translate' })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          alert(data.error || '破译古籍失败');
          setIsProcessing(false);
          return;
        }
        
        setAiResult({
          type: 'translate',
          content: `【破译古籍结果】\n\n${data.result}\n\n（消耗灵气：${data.cost}）`
        });
        setIsProcessing(false);
      } catch (error) {
        console.error('破译古籍失败:', error);
        alert('破译古籍失败，请稍后重试');
        setIsProcessing(false);
      }
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
         
         {isEditingUrl ? (
           <form onSubmit={handleCustomUrlSubmit} className="flex-1 flex items-center gap-2">
             <div className="flex-1 bg-surface-950 rounded-lg px-4 py-2.5 border border-amber-500/50 flex items-center shadow-inner">
               <Globe size={14} className="mr-2 text-amber-400" />
               <input
                 type="text"
                 value={customUrl}
                 onChange={(e) => setCustomUrl(e.target.value)}
                 placeholder="输入网址..."
                 className="flex-1 bg-transparent text-xs text-content-100 font-mono outline-none"
                 autoFocus
               />
             </div>
             <Button type="submit" size="sm" variant="primary">前往</Button>
             <Button type="button" size="sm" variant="outline" onClick={() => setIsEditingUrl(false)}>取消</Button>
           </form>
         ) : (
           <div
             className="flex-1 bg-surface-950 rounded-lg px-4 py-2.5 text-xs text-content-400 font-mono truncate border border-border-base flex items-center shadow-inner cursor-pointer hover:border-amber-500/30 transition-colors"
             onClick={() => !currentSite && setIsEditingUrl(true)}
           >
             <Globe size={14} className="mr-2 text-primary-400" />
             <span className="truncate select-all">{currentSite?.url || "moyu://portal (点击输入自定义网址)"}</span>
           </div>
         )}

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
         
         {currentSite && currentSite.gameType === 'TIMER' && (
           <>
             <Button
               size="sm"
               variant="outline"
               onClick={handleDivineScan}
               disabled={isProcessing}
               className="border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 text-amber-400"
               icon={<Eye size={16} />}
             >
               神念扫视 (50灵气)
             </Button>
             <Button
               size="sm"
               variant="outline"
               onClick={handleDecipherText}
               disabled={isProcessing}
               className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 text-purple-400"
               icon={<Languages size={16} />}
             >
               破译古籍 (100灵气)
             </Button>
           </>
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
                                    {category.sites.map((site: { name: string; url: string; desc: string; gameType?: string }, sIdx) => (
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

      {/* AI结果展示弹窗 */}
      <Modal
        isOpen={!!aiResult}
        onClose={() => setAiResult(null)}
        title={aiResult?.type === 'summary' ? '神念扫视' : '破译古籍'}
        icon={aiResult?.type === 'summary' ? <Eye size={18} className="text-amber-400" /> : <Languages size={18} className="text-purple-400" />}
      >
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 rounded-xl border-2 border-amber-500/30 relative overflow-hidden">
          {/* 装饰性背景 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl" />
          
          {/* 内容 */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
              <Sparkles size={16} />
              <span className="text-sm font-bold">灵光一现</span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-serif text-slate-700 dark:text-slate-300 leading-relaxed">
                {aiResult?.content}
              </pre>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};