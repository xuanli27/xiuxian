
import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Task } from '../types';
import { generateDailyTasks } from '../services/geminiService';
import { Scroll, Clock, Briefcase, Swords, Link2, CheckCircle, Loader2, Coins, X, BrainCircuit, Skull } from 'lucide-react';
import clsx from 'clsx';

export const TaskBoard: React.FC = () => {
  const { player, tasks, setTasks, completeTask } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'PROGRESS' | 'QUIZ' | 'BATTLE'>('PROGRESS');
  
  // Interactive Logic States
  const [progress, setProgress] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [battleOver, setBattleOver] = useState(false);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);

  useEffect(() => {
    if (tasks.length === 0) refreshTasks();
  }, []);

  const refreshTasks = async () => {
    setLoading(true);
    const newTasks = await generateDailyTasks(player.rank);
    setTasks(newTasks);
    setLoading(false);
  };

  const handleStartTask = (task: Task) => {
    setActiveTask(task);
    setShowModal(true);
    setProgress(0);
    setBattleLog([]);
    setBattleOver(false);
    setQuizResult(null);

    if (task.type === 'GAME') {
      setModalMode('PROGRESS');
      startProgress(task);
    } else if (task.type === 'LINK') {
      setModalMode('QUIZ');
    } else if (task.type === 'BATTLE') {
      setModalMode('BATTLE');
    }
  };

  const startProgress = (task: Task) => {
    const tickRate = 100;
    const step = 100 / ((task.duration * 1000) / tickRate);
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          handleComplete(task, true);
          return 100;
        }
        return next;
      });
    }, tickRate);
  };

  const handleBattle = () => {
    if (!activeTask?.enemy) return;
    const enemy = activeTask.enemy;
    
    let log = ["遭遇了 " + enemy.name + "！"];
    setBattleLog(log);

    // Simple Battle Simulation
    setTimeout(() => {
      const playerPower = player.qi + (Math.random() * 50);
      const enemyPower = enemy.power + (Math.random() * 20);
      
      log = [...log, `你施展了摸鱼心法，攻击力 ${Math.floor(playerPower)}`];
      setBattleLog(log);
      
      setTimeout(() => {
        log = [...log, `${enemy.name} 发动了 需求变更，攻击力 ${Math.floor(enemyPower)}`];
        setBattleLog(log);
        
        setTimeout(() => {
          const win = playerPower >= enemyPower;
          log = [...log, win ? "对方无言以对，你赢了！" : "你被怼得哑口无言..."];
          setBattleLog(log);
          setBattleOver(true);
          
          setTimeout(() => {
            handleComplete(activeTask, win);
          }, 1500);
        }, 1000);
      }, 1000);
    }, 500);
  };

  const handleQuiz = (idx: number) => {
    if (!activeTask?.quiz) return;
    const win = idx === activeTask.quiz.correctIndex;
    setQuizResult(win);
    setTimeout(() => {
      handleComplete(activeTask, win);
    }, 1000);
  };

  const handleComplete = (task: Task, success: boolean) => {
    completeTask(task, success);
    setTimeout(() => {
      setShowModal(false);
      setActiveTask(null);
    }, 500);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-xianxia text-3xl text-secondary-400">需求池</h1>
          <p className="text-content-400 text-sm mt-1">今日待办：{tasks.filter(t => !t.completed).length}</p>
        </div>
        <button 
          onClick={refreshTasks} 
          disabled={loading}
          className="px-4 py-2 bg-surface-800 border border-border-base rounded-lg hover:bg-surface-700 text-sm flex items-center gap-2 transition shadow-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Scroll size={14} />}
          刷新
        </button>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {loading ? (
           <div className="text-center py-12 text-content-400 animate-pulse">
             <Loader2 className="animate-spin mb-2 mx-auto" />
             正在同步 JIRA 数据...
           </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onStart={() => handleStartTask(task)} />
          ))
        )}
      </div>

      {/* Interaction Modal */}
      {showModal && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-800 w-full max-w-md rounded-3xl border border-border-base shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="bg-surface-900 p-4 border-b border-border-base flex justify-between items-center">
               <h3 className="font-bold text-lg flex items-center gap-2">
                  {modalMode === 'BATTLE' && <Swords size={18} className="text-danger-400"/>}
                  {modalMode === 'QUIZ' && <BrainCircuit size={18} className="text-blue-400"/>}
                  {modalMode === 'PROGRESS' && <Clock size={18} className="text-primary-400"/>}
                  {activeTask.title}
               </h3>
               <button onClick={() => setShowModal(false)} className="text-content-400 hover:text-content-100"><X size={20}/></button>
            </div>

            <div className="p-6 min-h-[200px] flex flex-col justify-center">
               
               {/* MODE: PROGRESS */}
               {modalMode === 'PROGRESS' && (
                 <div className="text-center">
                   <p className="mb-6 text-content-200">{activeTask.description}</p>
                   <div className="h-4 bg-surface-900 rounded-full overflow-hidden border border-border-base">
                      <div className="h-full bg-primary-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                   </div>
                   <div className="mt-2 text-xs text-content-400 font-mono">{Math.floor(progress)}%</div>
                 </div>
               )}

               {/* MODE: BATTLE */}
               {modalMode === 'BATTLE' && activeTask.enemy && (
                 <div className="space-y-4">
                    <div className="flex items-center justify-between bg-surface-900 p-4 rounded-xl">
                       <div className="text-center">
                          <div className="text-2xl">🧑‍💻</div>
                          <div className="text-xs mt-1 text-primary-400">你</div>
                       </div>
                       <div className="text-danger-500 font-bold">VS</div>
                       <div className="text-center">
                          <div className="text-2xl">{activeTask.enemy.avatar}</div>
                          <div className="text-xs mt-1 text-danger-400">{activeTask.enemy.name}</div>
                       </div>
                    </div>
                    
                    <div className="h-32 bg-surface-900/50 rounded-xl p-3 overflow-y-auto text-sm space-y-1 font-mono border border-border-base">
                       {battleLog.map((l, i) => <div key={i} className="text-content-400 border-b border-white/5 pb-1">{l}</div>)}
                    </div>

                    {!battleOver && battleLog.length < 2 && (
                      <button onClick={handleBattle} className="w-full py-3 bg-danger-600 hover:bg-danger-500 text-white rounded-xl font-bold">
                         开怼 (Battle)
                      </button>
                    )}
                 </div>
               )}

               {/* MODE: QUIZ */}
               {modalMode === 'QUIZ' && activeTask.quiz && (
                 <div>
                   <div className="bg-blue-900/20 p-3 rounded-lg text-blue-300 text-sm mb-4 border border-blue-500/30">
                      正在浏览: {activeTask.description}
                   </div>
                   <h4 className="font-bold text-lg mb-4">{activeTask.quiz.question}</h4>
                   <div className="space-y-2">
                     {activeTask.quiz.options.map((opt, idx) => (
                       <button 
                         key={idx}
                         onClick={() => handleQuiz(idx)}
                         disabled={quizResult !== null}
                         className={clsx(
                           "w-full p-3 rounded-lg text-left border transition-all",
                           quizResult === null ? "bg-surface-700 hover:bg-surface-600 border-transparent" : 
                           idx === activeTask.quiz?.correctIndex ? "bg-primary-600/20 border-primary-500 text-primary-400" : "bg-surface-700 opacity-50"
                         )}
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

            </div>
          </div>
        </div>
      )}
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
          
          {/* Rewards */}
          <div className="mt-3 flex flex-wrap gap-2">
             <RewardBadge icon={<Coins size={10}/>} value={task.reward.contribution} label="贡献" color="text-secondary-400" />
             <RewardBadge icon="⚡" value={task.reward.qi} label="灵气" color="text-primary-400" />
             <RewardBadge icon="💎" value={task.reward.stones} label="灵石" color="text-blue-400" />
             {task.reward.materials && task.reward.materials.length > 0 && (
               <span className="text-xs bg-surface-900 px-2 py-1 rounded border border-purple-500/30 text-purple-400">
                  🎁 材料 x{task.reward.materials.length}
               </span>
             )}
          </div>
        </div>

        {!task.completed && (
           <button 
             onClick={onStart}
             className="self-center px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 active:scale-95 transition-all"
           >
             接单
           </button>
        )}
      </div>
    </div>
  );
};

const RewardBadge = ({ icon, value, label, color }: any) => {
  if (!value) return null;
  return (
    <span className={`text-xs bg-surface-900 px-2 py-1 rounded border border-white/10 flex items-center gap-1 ${color}`}>
       <span>{icon}</span> {value}
    </span>
  );
}
