
import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Task } from '../types';
import { getRankLabel, MOYU_SITES, LOGIC_PUZZLES } from '../data/constants';
import { generateDailyTasks } from '../services/geminiService';
import { Scroll, Briefcase, Swords, Link2, CheckCircle, Loader2, Coins, X, BrainCircuit, ExternalLink, MousePointerClick, RefreshCw, Globe, BookOpen, MessageCircle, Mail, Compass, TrendingUp, TrendingDown, Cpu, Code } from 'lucide-react';
import { Button, Modal, Badge } from './ui/Shared';
import clsx from 'clsx';

export const TaskBoard: React.FC = () => {
  const { player, tasks, setTasks, completeTask } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { if (tasks.length === 0) refreshTasks(); }, []);

  const refreshTasks = async () => {
    setLoading(true);
    const newTasks = await generateDailyTasks(getRankLabel(player.rank, player.level)); 
    setTasks(newTasks);
    setLoading(false);
  };

  const handleStartTask = (task: Task) => {
    setActiveTask(task);
    setShowModal(true);
  };

  const handleComplete = (success: boolean) => {
    if (activeTask) {
        completeTask(activeTask, success);
        setTimeout(() => { setShowModal(false); setActiveTask(null); }, 500);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-xianxia text-3xl text-secondary-400">需求池</h1>
          <p className="text-content-400 text-sm mt-1">今日待办：{tasks.filter(t => !t.completed).length}</p>
        </div>
        <Button variant="outline" size="sm" onClick={refreshTasks} loading={loading} icon={<RefreshCw size={14} />}>
          刷新
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
           <div className="text-center py-12 text-content-400 animate-pulse"><Loader2 className="animate-spin mb-2 mx-auto" />正在同步 OA 系统...</div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} onStart={() => handleStartTask(task)} />)
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={activeTask?.title || "任务进行中"}
        icon={activeTask?.type === 'BATTLE' ? <Swords size={18} className="text-danger-400"/> : (activeTask?.type === 'LINK' ? <Compass size={18} className="text-blue-400"/> : <MousePointerClick size={18} className="text-primary-400"/>)}
        maxWidth={activeTask?.type === 'LINK' ? "w-[95vw] max-w-6xl h-[90vh]" : "max-w-md"}
        scrollable={activeTask?.type !== 'LINK'}
      >
         {activeTask && (
            <>
              {activeTask.type === 'GAME' && <MessageCleanerGame duration={activeTask.duration} onComplete={handleComplete} />}
              {activeTask.type === 'BATTLE' && activeTask.enemy && <BattleArena playerPower={player.qi} enemy={activeTask.enemy} onComplete={handleComplete} />}
              {activeTask.type === 'LINK' && <NavigationStation duration={activeTask.duration} onComplete={handleComplete} />}
            </>
         )}
      </Modal>
    </div>
  );
};

const TaskCard = ({ task, onStart }: { task: Task, onStart: () => void }) => {
  const getIcon = () => {
    switch(task.type) {
      case 'GAME': return <Briefcase className="text-primary-400" />;
      case 'BATTLE': return <Swords className="text-danger-400" />;
      case 'LINK': return <Link2 className="text-blue-400" />;
      default: return <Scroll />;
    }
  };

  return (
    <div className={`relative bg-surface-800 rounded-2xl border ${task.completed ? 'border-primary-600/30 opacity-60' : 'border-border-base'} p-4 transition-all hover:border-content-400/50 shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-surface-900 rounded-xl shadow-inner border border-border-base h-12 w-12 flex items-center justify-center">
          {task.completed ? <CheckCircle className="text-primary-500" /> : getIcon()}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${task.completed ? 'line-through decoration-primary-500/50' : ''}`}>{task.title}</h3>
          <p className="text-content-400 text-sm mt-1 leading-snug">{task.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
             <Badge icon={<Coins size={10}/>} label={task.reward.contribution} color="text-secondary-400" />
             <Badge icon="⚡" label={task.reward.qi} color="text-primary-400" />
             <Badge icon="💎" label={task.reward.stones} color="text-blue-400" />
             {task.reward.materials && task.reward.materials.length > 0 && (
               <Badge label={`材料 x${task.reward.materials.length}`} color="text-purple-400" />
             )}
          </div>
        </div>

        {!task.completed && (
           <Button size="sm" onClick={onStart} className="self-center">接单</Button>
        )}
      </div>
    </div>
  );
};

const NavigationStation = ({ duration, onComplete }: { duration: number, onComplete: (s: boolean) => void }) => {
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
      // If it's a plain TIMER type, start timer immediately
      if (!site.gameType || site.gameType === 'TIMER') {
        setActiveTimer(true);
      }
  };

  const handleBack = () => {
      setCurrentSite(null);
      setActiveTimer(false);
      setTimer(duration); // Reset timer logic for new site
  };

  const renderControlPanel = () => {
      if (!currentSite) return null;

      // 1. Stock Market Game
      if (currentSite.gameType === 'STOCK') {
          return (
              <div className="absolute bottom-0 left-0 right-0 bg-surface-900/95 backdrop-blur border-t border-border-base p-4 shadow-2xl animate-in slide-in-from-bottom-10">
                  <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2 text-secondary-400 font-bold animate-pulse">
                          <TrendingUp size={20} />
                          <span>检测到剧烈市场波动，请预判走势以完成摸鱼！</span>
                      </div>
                      <StockMarketGame onComplete={onComplete} />
                  </div>
              </div>
          );
      }

      // 2. Logic Puzzle Game
      if (currentSite.gameType === 'LOGIC') {
          return (
               <div className="absolute bottom-0 left-0 right-0 bg-surface-900/95 backdrop-blur border-t border-border-base p-4 shadow-2xl animate-in slide-in-from-bottom-10">
                  <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2 text-primary-400 font-bold animate-pulse">
                          <Cpu size={20} />
                          <span>检测到逻辑漏洞，请修复BUG以继续摸鱼！</span>
                      </div>
                      <LogicPuzzleGame onComplete={onComplete} />
                  </div>
              </div>
          );
      }

      // 3. Default Timer
      return (
        <div className="absolute bottom-6 right-6 pointer-events-none">
            <div className="pointer-events-auto shadow-2xl">
                <Button 
                    disabled={timer > 0} 
                    onClick={() => onComplete(true)} 
                    size="lg" 
                    variant={timer > 0 ? 'secondary' : 'primary'}
                    className={clsx("shadow-xl border-2 backdrop-blur-md font-bold text-lg px-8 py-4 transition-all", timer > 0 ? "border-white/20 opacity-80" : "border-white animate-bounce")}
                >
                {timer > 0 ? `请继续浏览... (${timer}s)` : "摸鱼结束 (领取奖励)"}
                </Button>
            </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-surface-950">
      {/* Address & Toolbar */}
      <div className="bg-surface-800 p-2 border-b border-border-base flex items-center gap-3 shrink-0 shadow-sm">
         <button onClick={handleBack} disabled={!currentSite} className="p-2 hover:bg-surface-700 rounded-lg text-content-400 disabled:opacity-30">
            <Compass size={20} />
         </button>
         
         <div className="flex-1 bg-surface-900 rounded-lg px-3 py-2 text-xs text-content-400 font-mono truncate border border-border-base flex items-center">
            <Globe size={12} className="mr-2 text-primary-400" />
            <span className="truncate">{currentSite?.url || "moyu://portal (摸鱼导航站)"}</span>
         </div>

         {/* Timer display only for TIMER type */}
         {(!currentSite?.gameType || currentSite?.gameType === 'TIMER') && (
            <div className="bg-surface-900 px-3 py-1.5 rounded-lg border border-border-base min-w-[80px] text-center">
                {timer > 0 ? (
                    <span className={clsx("font-mono font-bold flex items-center justify-center gap-1", activeTimer ? "text-secondary-400 animate-pulse" : "text-content-400")}>
                        {activeTimer ? <Loader2 size={12} className="animate-spin" /> : "⏸"} {timer}s
                    </span>
                ) : (
                    <span className="text-primary-400 font-bold flex items-center justify-center gap-1">
                        <CheckCircle size={12} /> 完成
                    </span>
                )}
            </div>
         )}
         
         {currentSite && (
             <a href={currentSite.url} target="_blank" rel="noreferrer" className="p-2 hover:bg-surface-700 rounded-lg text-content-400 transition-colors" title="在外部浏览器打开">
                <ExternalLink size={20} />
             </a>
         )}
      </div>

      {/* Content Area */}
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
             <div className="h-full overflow-y-auto p-8 bg-surface-950">
                 <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-xianxia text-primary-400 mb-2">摸鱼导航站</h2>
                        <p className="text-content-400">"工欲善其事，必先利其器"</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {MOYU_SITES.map((category, idx) => (
                            <div key={idx} className="bg-surface-800 rounded-2xl border border-border-base p-5">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary-400">
                                    {idx === 0 ? <Briefcase size={18} /> : <BrainCircuit size={18} />}
                                    {category.category}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {category.sites.map((site: any, sIdx) => (
                                        <button 
                                            key={sIdx}
                                            onClick={() => handleSiteClick(site)}
                                            className="flex flex-col items-start p-3 rounded-xl bg-surface-700 hover:bg-surface-600 hover:scale-105 transition-all border border-transparent hover:border-primary-500/30 group text-left w-full relative overflow-hidden"
                                        >
                                            <span className="font-bold text-content-100 group-hover:text-primary-400 transition-colors z-10 relative">{site.name}</span>
                                            <span className="text-xs text-content-400 mt-1 z-10 relative">{site.desc}</span>
                                            {site.gameType === 'STOCK' && <TrendingUp className="absolute right-2 bottom-2 opacity-5 text-secondary-500" size={40} />}
                                            {site.gameType === 'LOGIC' && <Code className="absolute right-2 bottom-2 opacity-5 text-primary-500" size={40} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 p-4 bg-surface-800/50 rounded-xl border border-dashed border-content-400/20 text-center text-xs text-content-400">
                        <p>提示：部分站点包含特殊小游戏，成功挑战可获得额外奖励！</p>
                    </div>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

// --- Mini Game Components ---

const StockMarketGame = ({ onComplete }: { onComplete: (s: boolean) => void }) => {
    const [data, setData] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'WAITING' | 'BETTING' | 'RESULT'>('WAITING');
    const [bet, setBet] = useState<'UP' | 'DOWN' | null>(null);
    const [result, setResult] = useState<'WIN' | 'LOSE' | null>(null);

    // Initialize random chart data
    useEffect(() => {
        const start = 50;
        const points = [start];
        for (let i = 0; i < 10; i++) {
            points.push(points[i] + (Math.random() * 10 - 5));
        }
        setData(points);
        setGameState('BETTING');
    }, []);

    const handleBet = (type: 'UP' | 'DOWN') => {
        setBet(type);
        setGameState('RESULT');
        
        // Simulate next price movement
        const lastPrice = data[data.length - 1];
        const nextPrice = lastPrice + (Math.random() * 20 - 10);
        const newData = [...data, nextPrice];
        
        // Animation delay
        let step = 0;
        const animInterval = setInterval(() => {
             step++;
             const intermediatePrice = lastPrice + ((nextPrice - lastPrice) * (step/20));
             setData(prev => [...prev.slice(0, prev.length - 1), intermediatePrice]); // Smoothly update last point visually? No, simplified: just append
             
             if (step === 1) setData(prev => [...prev, lastPrice]); // Add the new point start
             else setData(prev => [...prev.slice(0, prev.length - 1), intermediatePrice]);

             if (step >= 20) {
                 clearInterval(animInterval);
                 const isWin = (type === 'UP' && nextPrice > lastPrice) || (type === 'DOWN' && nextPrice < lastPrice);
                 setResult(isWin ? 'WIN' : 'LOSE');
                 setTimeout(() => onComplete(isWin), 1500);
             }
        }, 50);
    };

    const maxVal = Math.max(...data) + 10;
    const minVal = Math.min(...data) - 10;
    const width = 300;
    const height = 100;
    
    const pointsStr = data.map((val, i) => {
        const x = (i / (data.length + (gameState === 'RESULT' ? 0 : 1) - 1)) * width;
        const y = height - ((val - minVal) / (maxVal - minVal)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full max-w-md bg-surface-800 rounded-xl p-4 border border-border-base shadow-lg">
            <div className="text-center mb-2 font-bold text-content-200">K线走势预测</div>
            <div className="h-[100px] w-full bg-surface-900 rounded mb-4 relative overflow-hidden border border-white/5">
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    <polyline 
                        points={pointsStr} 
                        fill="none" 
                        stroke={result === 'WIN' ? '#10B981' : (result === 'LOSE' ? '#EF4444' : '#3B82F6')} 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
                {result && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 font-xianxia text-2xl animate-in zoom-in">
                        {result === 'WIN' ? <span className="text-primary-400">预判成功!</span> : <span className="text-danger-400">韭菜被割!</span>}
                    </div>
                )}
            </div>

            {gameState === 'BETTING' && (
                <div className="flex gap-4">
                    <Button variant="primary" className="flex-1 bg-red-600 hover:bg-red-500 border-none" onClick={() => handleBet('UP')} icon={<TrendingUp />}>看涨 (Buy Call)</Button>
                    <Button variant="primary" className="flex-1 bg-green-600 hover:bg-green-500 border-none" onClick={() => handleBet('DOWN')} icon={<TrendingDown />}>看跌 (Buy Put)</Button>
                </div>
            )}
            {gameState === 'RESULT' && !result && <div className="text-center text-sm text-content-400 animate-pulse">市场波动中...</div>}
        </div>
    );
};

const LogicPuzzleGame = ({ onComplete }: { onComplete: (s: boolean) => void }) => {
    const [puzzle, setPuzzle] = useState(LOGIC_PUZZLES[0]);
    const [answered, setAnswered] = useState<number | null>(null);

    useEffect(() => {
        const random = LOGIC_PUZZLES[Math.floor(Math.random() * LOGIC_PUZZLES.length)];
        setPuzzle(random);
    }, []);

    const handleAnswer = (idx: number) => {
        setAnswered(idx);
        const isCorrect = idx === puzzle.a;
        setTimeout(() => onComplete(isCorrect), 1000);
    };

    return (
        <div className="w-full max-w-md bg-surface-800 rounded-xl p-6 border border-border-base shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-primary-400 font-mono text-xs bg-surface-900/50 p-2 rounded">
                <Code size={14} />
                <span>DEBUG_CONSOLE_V1.0</span>
            </div>
            
            <div className="font-mono text-lg text-content-100 mb-6 font-bold">
                {puzzle.q}
            </div>

            <div className="grid grid-cols-1 gap-2">
                {puzzle.options.map((opt, idx) => {
                    const isSelected = answered === idx;
                    const isCorrect = idx === puzzle.a;
                    
                    let variant = "bg-surface-700 hover:bg-surface-600";
                    if (answered !== null) {
                        if (isCorrect) variant = "bg-primary-600 text-white";
                        else if (isSelected) variant = "bg-danger-600 text-white";
                        else variant = "bg-surface-700 opacity-50";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={answered !== null}
                            onClick={() => handleAnswer(idx)}
                            className={clsx("w-full text-left px-4 py-3 rounded-lg transition-all font-mono text-sm flex justify-between items-center", variant)}
                        >
                            <span>{opt}</span>
                            {answered !== null && isCorrect && <CheckCircle size={16} />}
                            {answered !== null && isSelected && !isCorrect && <X size={16} />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const MessageCleanerGame = ({ duration, onComplete }: { duration: number, onComplete: (s: boolean) => void }) => {
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
    <div className="h-[300px] relative bg-surface-900 select-none overflow-hidden cursor-crosshair rounded-xl border border-border-base">
       <div className="absolute top-2 left-2 text-xs font-mono text-primary-400 bg-surface-800 px-2 py-1 rounded z-10 border border-primary-500/30">TIME: {timeLeft.toFixed(1)}s | CLEARED: {score}/5</div>
       <div className="absolute bottom-2 right-2 text-xs text-content-400 opacity-50">点击未读消息消除红点</div>
       {msgs.map(msg => (
          <div 
            key={msg.id} 
            onMouseDown={() => { setMsgs(b => b.filter(x => x.id !== msg.id)); setScore(s => s + 1); }} 
            className="absolute text-3xl cursor-pointer hover:scale-110 transition-transform animate-in zoom-in duration-300" 
            style={{ left: `${msg.x}%`, top: `${msg.y}%` }}
          >
            <div className="relative">
                {msg.type === 'mail' ? <Mail className="text-blue-400" /> : <MessageCircle className="text-green-400" />}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-surface-900 animate-pulse" />
            </div>
          </div>
       ))}
    </div>
  );
};

const BattleArena = ({ playerPower, enemy, onComplete }: { playerPower: number, enemy: any, onComplete: (s: boolean) => void }) => {
   const [log, setLog] = useState<string[]>(["遭遇了 " + enemy.name + "!"]);
   const [enemyHp, setEnemyHp] = useState(100);
   const [playerHp, setPlayerHp] = useState(100);
   const [finished, setFinished] = useState(false);
   const logRef = useRef<HTMLDivElement>(null);

   const attack = () => {
      if (finished) return;
      const dmg = 20 + Math.random() * 10;
      setEnemyHp(h => Math.max(0, h - dmg));
      setLog(l => [...l, `你提出了无法反驳的论点! 造成 ${Math.floor(dmg)} 点精神伤害`]);

      if (enemyHp - dmg <= 0) {
         setFinished(true); setTimeout(() => onComplete(true), 1500); return;
      }

      setTimeout(() => {
         const eDmg = 15 + Math.random() * 15;
         setPlayerHp(h => Math.max(0, h - eDmg));
         setLog(l => [...l, `${enemy.name} 使用了 '不讲道理'! 造成 ${Math.floor(eDmg)} 点精神伤害`]);
         if (playerHp - eDmg <= 0) { setFinished(true); setTimeout(() => onComplete(false), 1500); }
      }, 800);
   };

   useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

   return (
      <div className="p-4 space-y-4">
         <div className="flex justify-between items-center">
            <div className="text-center w-1/3"><div className="text-2xl mb-1">🧑‍💻</div><div className="h-2 bg-surface-700 rounded-full overflow-hidden"><div className="h-full bg-primary-500 transition-all" style={{width: `${playerHp}%`}}/></div></div>
            <div className="text-danger-500 font-xianxia font-bold text-xl">VS</div>
             <div className="text-center w-1/3"><div className="text-2xl mb-1">{enemy.avatar}</div><div className="h-2 bg-surface-700 rounded-full overflow-hidden"><div className="h-full bg-danger-500 transition-all" style={{width: `${enemyHp}%`}}/></div></div>
         </div>
         <div ref={logRef} className="h-32 bg-surface-950 rounded-xl p-3 overflow-y-auto font-mono text-xs space-y-1 border border-white/10">
            {log.map((line, i) => <div key={i} className="text-content-400 border-b border-white/5 pb-1 animate-in fade-in slide-in-from-left-2">{line}</div>)}
         </div>
         {!finished ? (
            <Button onClick={attack} variant="danger" className="w-full" icon={<Swords size={18} />}>发起嘴遁 (Attack)</Button>
         ) : (
            <div className="text-center font-bold animate-pulse">{playerHp > 0 ? <span className="text-primary-400">胜   利!</span> : <span className="text-danger-400">败   北...</span>}</div>
         )}
      </div>
   );
};
