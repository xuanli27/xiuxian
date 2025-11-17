
import React from 'react';
import { Task } from '../../types';
import { Scroll, Briefcase, Swords, Link2, CheckCircle, Coins } from 'lucide-react';
import { Button, Badge } from '../ui/Shared';
import clsx from 'clsx';

export const TaskCard = ({ task, onStart }: { task: Task, onStart: () => void }) => {
  const getIcon = () => {
    switch(task.type) {
      case 'GAME': return <Briefcase className="text-primary-400" size={24} />;
      case 'BATTLE': return <Swords className="text-danger-400" size={24} />;
      case 'LINK': return <Link2 className="text-blue-400" size={24} />;
      default: return <Scroll size={24} />;
    }
  };

  return (
    <div className={clsx(
        "relative bg-surface-800/50 backdrop-blur-sm rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01] group",
        task.completed 
            ? 'border-primary-600/20 opacity-60' 
            : 'border-border-base hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5'
    )}>
      <div className="flex items-start gap-5">
        <div className={clsx(
            "p-4 rounded-2xl border shadow-inner shrink-0 transition-colors",
            task.completed ? "bg-surface-900 border-primary-900/50" : "bg-surface-900 border-border-base group-hover:border-primary-500/30"
        )}>
          {task.completed ? <CheckCircle className="text-primary-500" size={24} /> : getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className={clsx("font-bold text-lg truncate pr-2", task.completed && "line-through decoration-primary-500/50 text-content-400")}>
                {task.title}
            </h3>
            {task.type === 'BATTLE' && !task.completed && <Badge label="BOSS战" variant="solid" color="bg-danger-600" />}
          </div>
          
          <p className="text-content-400 text-sm mt-1 leading-relaxed line-clamp-2">{task.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
             <Badge icon={<Coins size={10}/>} label={`贡献 ${task.reward.contribution}`} color="text-secondary-400" />
             <Badge icon="⚡" label={`灵气 ${task.reward.qi}`} color="text-primary-400" />
             {task.reward.stones > 0 && <Badge icon="💎" label={task.reward.stones} color="text-blue-400" />}
             {task.reward.materials && task.reward.materials.length > 0 && (
               <Badge label={`材料 +${task.reward.materials.length}`} color="text-purple-400" />
             )}
          </div>
        </div>

        {!task.completed && (
           <div className="self-center pl-2">
             <Button size="sm" onClick={onStart} icon={task.type === 'BATTLE' ? <Swords size={14}/> : undefined}>
                {task.type === 'BATTLE' ? '讨伐' : '执行'}
             </Button>
           </div>
        )}
      </div>
    </div>
  );
};
