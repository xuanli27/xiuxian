
import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Task } from '../types';
import { getRankLabel } from '../data/constants';
import { generateDailyTasks } from '../services/geminiService';
import { Scroll, Briefcase, Swords, Link2, CheckCircle, Loader2, Coins, X, BrainCircuit, ExternalLink, MousePointerClick, RefreshCw } from 'lucide-react';
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
           <div className="text-center py-12 text-content-400 animate-pulse"><Loader2 className="animate-spin mb-2 mx-auto" />正在同步 JIRA 数据...</div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} onStart={() => handleStartTask(task)} />)
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={activeTask?.title || "任务进行中"}
        icon={activeTask?.type === 'BATTLE' ? <Swords size={18} className="text-danger-400"/> : (activeTask?.type === 'LINK' ? <BrainCircuit size={18} className="text-blue-400"/> : <MousePointerClick size={18} className="text-primary-400"/>)}
        maxWidth={activeTask?.type === 'LINK' ? "max-w-3xl h-[80vh]" : "max-w-md"}
      >
         {activeTask && (
            <>
              {activeTask.type === 'GAME' && <BugSquasherGame duration={activeTask.duration} onComplete={handleComplete} />}
              {activeTask.type === 'BATTLE' && activeTask.enemy && <BattleArena playerPower={player.qi} enemy={activeTask.enemy} onComplete={handleComplete} />}
              {activeTask.type === 'LINK' && activeTask.url && activeTask.quiz && <BrowserWindow url={activeTask.url} duration={activeTask.duration} quiz={activeTask.quiz} onComplete={handleComplete} />}
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

const BrowserWindow = ({ url, duration, quiz, onComplete }: { url: string, duration: number, quiz: any, onComplete: (s: boolean) => void }) => {
  const [timer, setTimer] = useState(duration);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-surface-800 p-2 border-b border-border-base flex items-center gap-2 shrink-0">
         <div className="flex gap-1.5 mr-2"><div className="w-3 h-3 rounded-full bg-red-500/50"/><div className="w-3 h-3 rounded-full bg-yellow-500/50"/><div className="w-3 h-3 rounded-full bg-green-500/50"/></div>
         <div className="flex-1 bg-surface-900 rounded-md px-3 py-1 text-xs text-content-400 font-mono truncate flex justify-between items-center">
            <span>{url}</span>
            {timer > 0 ? <span className="text-primary-400 animate-pulse">阅读中 {timer}s...</span> : <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle size={10}/> 就绪</span>}
         </div>
         <a href={url} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-surface-700 rounded text-content-400"><ExternalLink size={14} /></a>
      </div>
      <div className="flex-1 relative bg-white">
         {!showQuiz ? (
            <>
              <iframe src={url} className="w-full h-full" sandbox="allow-scripts allow-same-origin" title="Moyu Browser" />
              <div className="absolute bottom-6 right-6">
                 <Button disabled={timer > 0} onClick={() => setShowQuiz(true)} size="lg" className="shadow-xl">
                   {timer > 0 ? `请阅读 ${timer}秒` : "我学会了 (开始答题)"}
                 </Button>
              </div>
            </>
         ) : (
            <div className="absolute inset-0 bg-surface-900 flex flex-col items-center justify-center p-8 text-content-100">
               <BrainCircuit size={48} className="text-primary-400 mb-6" />
               <h3 className="text-2xl font-bold mb-8 text-center">{quiz.question}</h3>
               <div className="grid gap-4 w-full max-w-md">
                  {quiz.options.map((opt: string, idx: number) => (
                    <button key={idx} onClick={() => onComplete(idx === quiz.correctIndex)} className="p-4 rounded-xl bg-surface-800 hover:bg-primary-600 hover:text-white border border-border-base transition-all text-left font-bold">
                       {['A','B','C','D'][idx]}. {opt}
                    </button>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

const BugSquasherGame = ({ duration, onComplete }: { duration: number, onComplete: (s: boolean) => void }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [bugs, setBugs] = useState<{id: number, x: number, y: number}[]>([]);
  
  useEffect(() => {
     const timer = setInterval(() => {
        setTimeLeft(t => {
           if (t <= 0) { clearInterval(timer); onComplete(score >= 5); return 0; }
           return t - 0.1;
        });
     }, 100);
     const spawner = setInterval(() => {
        if (Math.random() > 0.3) setBugs(b => [...b, { id: Math.random(), x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }]);
     }, 600);
     return () => { clearInterval(timer); clearInterval(spawner); };
  }, []);

  return (
    <div className="h-[300px] relative bg-surface-900 select-none overflow-hidden cursor-crosshair">
       <div className="absolute top-2 left-2 text-xs font-mono text-primary-400 bg-surface-800 px-2 py-1 rounded">TIME: {timeLeft.toFixed(1)}s | SCORE: {score}/5</div>
       {bugs.map(bug => (
          <div key={bug.id} onMouseDown={() => { setBugs(b => b.filter(x => x.id !== bug.id)); setScore(s => s + 1); }} className="absolute text-2xl cursor-pointer hover:scale-125 transition-transform animate-bounce" style={{ left: `${bug.x}%`, top: `${bug.y}%` }}>🐞</div>
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
