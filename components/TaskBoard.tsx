import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Task } from '../types';
import { generateDailyTasks } from '../services/geminiService';
import { Scroll, Clock, Briefcase, Swords, Link2, CheckCircle, Loader2, Coins } from 'lucide-react';

export const TaskBoard: React.FC = () => {
  const { player, tasks, setTasks, completeTask } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Initial load if empty
  useEffect(() => {
    if (tasks.length === 0) {
      refreshTasks();
    }
  }, []);

  const refreshTasks = async () => {
    setLoading(true);
    const newTasks = await generateDailyTasks(player.rank);
    setTasks(newTasks);
    setLoading(false);
  };

  const startTask = (task: Task) => {
    if (activeTaskId) return;
    setActiveTaskId(task.id);
    setProgress(0);

    const tickRate = 100; // ms
    const step = 100 / ((task.duration * 1000) / tickRate);

    timerRef.current = window.setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          finishTask(task);
          return 100;
        }
        return next;
      });
    }, tickRate);
  };

  const finishTask = (task: Task) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setActiveTaskId(null);
    completeTask(task);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-xianxia text-3xl text-amber-400">摸鱼任务榜</h1>
          <p className="text-slate-400 text-sm mt-1">今日目标：看起来很忙</p>
        </div>
        <button 
          onClick={refreshTasks} 
          disabled={loading}
          className="px-4 py-2 bg-slate-800 border border-slate-600 rounded hover:bg-slate-700 text-sm flex items-center gap-2 transition"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Scroll size={14} />}
          刷新
        </button>
      </div>

      <div className="grid gap-4">
        {loading && tasks.length === 0 ? (
           <div className="text-center py-12 text-slate-500 animate-pulse flex flex-col items-center">
             <Loader2 className="animate-spin mb-2" />
             正在从天机阁(JIRA)获取需求...
           </div>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              isActive={activeTaskId === task.id}
              progress={activeTaskId === task.id ? progress : 0}
              isBlocked={activeTaskId !== null && activeTaskId !== task.id}
              onStart={() => startTask(task)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, isActive, progress, isBlocked, onStart }: { 
  task: Task, 
  isActive: boolean, 
  progress: number, 
  isBlocked: boolean,
  onStart: () => void 
}) => {
  
  const getIcon = () => {
    switch(task.type) {
      case 'GAME': return <Briefcase className="text-emerald-400" />;
      case 'BATTLE': return <Swords className="text-rose-400" />;
      case 'LINK': return <Link2 className="text-blue-400" />;
      default: return <Scroll />;
    }
  };

  return (
    <div className={`relative bg-slate-800 rounded-xl border ${task.completed ? 'border-emerald-900/50 opacity-50' : 'border-slate-700'} p-4 overflow-hidden transition-all hover:border-slate-500`}>
      {/* Progress Bar Background */}
      {isActive && (
        <div className="absolute inset-0 bg-emerald-900/20 pointer-events-none">
          <div className="h-full bg-emerald-900/30 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="relative flex items-start gap-4 z-10">
        <div className="p-3 bg-slate-900 rounded-lg shadow-inner">
          {task.completed ? <CheckCircle className="text-emerald-500" /> : getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
             <h3 className={`font-bold text-lg ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
               {task.title}
             </h3>
             <div className="flex gap-2">
                <span className="text-xs bg-slate-900 px-2 py-1 rounded text-amber-400 border border-amber-900/50 flex items-center gap-1">
                  <Coins size={10} /> {task.reward.contribution || 10}
                </span>
                <span className="text-xs bg-slate-900 px-2 py-1 rounded text-emerald-400 border border-emerald-900/50">
                  +{task.reward.qi} 灵气
                </span>
             </div>
          </div>
          <p className="text-slate-400 text-sm mt-1">{task.description}</p>
          
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock size={12} /> {task.duration}s</span>
            {task.reward.item && <span className="text-indigo-400">奖励: {task.reward.item}</span>}
          </div>
        </div>

        {!task.completed && (
           <button 
             onClick={onStart}
             disabled={isActive || isBlocked}
             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
               isActive 
                 ? 'bg-emerald-600 text-white animate-pulse'
                 : isBlocked 
                   ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                   : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105'
             }`}
           >
             {isActive ? `${Math.floor(progress)}%` : '接单'}
           </button>
        )}
      </div>
    </div>
  );
};