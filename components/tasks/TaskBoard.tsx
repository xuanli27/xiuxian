import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Task } from '../../types';
import { getRankLabel } from '../../data/constants';
import { generateDailyTasks } from '../../services/geminiService';
import { RefreshCw, Loader2, Swords, Compass, MousePointerClick } from 'lucide-react';
import { Button, Modal, PageHeader } from '../ui';
import { TaskCard } from './TaskCard';
import { NavigationStation } from './NavigationStation';
import { MessageCleanerGame } from './minigames/MessageCleanerGame';
import { BattleArena } from './minigames/BattleArena';

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
    <div className="pb-24">
      <PageHeader 
        title="需求池" 
        subtitle={`待办事项: ${tasks.filter(t => !t.completed).length}`}
        rightContent={
             <Button variant="outline" size="sm" onClick={refreshTasks} loading={loading} icon={<RefreshCw size={14} />}>
                刷新OA
            </Button>
        }
      />

      <div className="grid gap-4">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-content-400 space-y-4">
               <Loader2 className="animate-spin text-primary-400" size={40} />
               <p className="font-mono text-sm animate-pulse">SYNCING_WORK_ORDERS...</p>
           </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} onStart={() => handleStartTask(task)} />)
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={activeTask?.title || "执行中..."}
        icon={activeTask?.type === 'BATTLE' ? <Swords size={18} className="text-danger-400"/> : (activeTask?.type === 'LINK' ? <Compass size={18} className="text-blue-400"/> : <MousePointerClick size={18} className="text-primary-400"/>)}
        maxWidth={activeTask?.type === 'LINK' ? "w-[95vw] max-w-6xl h-[90vh]" : "max-w-lg"}
        scrollable={activeTask?.type !== 'LINK'}
      >
         {activeTask && (
            <div className="h-full flex flex-col">
              {activeTask.type === 'GAME' && <MessageCleanerGame duration={activeTask.duration} onComplete={handleComplete} />}
              {activeTask.type === 'BATTLE' && activeTask.enemy && <BattleArena playerPower={player.qi} enemy={activeTask.enemy} onComplete={handleComplete} />}
              {activeTask.type === 'LINK' && <NavigationStation duration={activeTask.duration} onComplete={handleComplete} />}
            </div>
         )}
      </Modal>
    </div>
  );
};