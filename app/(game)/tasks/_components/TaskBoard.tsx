'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Loader2, Swords, Compass, MousePointerClick } from 'lucide-react';
import { Button, Modal, PageHeader } from '@/components/ui';
import { TaskCard } from './TaskCard';
import { NavigationStation } from './NavigationStation';
import { MessageCleanerGame } from './minigames/MessageCleanerGame';
import { BattleArena } from './minigames/BattleArena';
import { getPlayerTasks } from '@/features/tasks/queries';
import { generateMultipleAITasks, completeTask } from '@/features/tasks/actions';
import type { Task as PrismaTask, Player } from '@prisma/client';
import type { Task } from '@/types/game';

interface Props {
  initialTasks: PrismaTask[]
  player: Player
}

export const TaskBoard: React.FC<Props> = ({ initialTasks, player }) => {
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: prismaTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', player.id],
    queryFn: () => getPlayerTasks(player.id),
    initialData: initialTasks,
  });

  // 转换为 Task 类型
  const tasks: Task[] = prismaTasks?.map((t: PrismaTask) => ({
    ...t,
    reward: {
      qi: t.rewardQi,
      contribution: t.rewardContribution,
      stones: t.rewardStones,
      materials: []
    },
    completed: t.status === 'COMPLETED'
  })) || [];

  const generateTasks = useMutation({
    mutationFn: () => generateMultipleAITasks([player.rank, player.sectRank], 4),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', player.id] });
    },
  });

  const complete = useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', player.id] });
      queryClient.invalidateQueries({ queryKey: ['player', player.id] });
    },
  });

  const handleStartTask = (task: Task) => {
    setActiveTask(task);
    setShowModal(true);
  };

  const handleComplete = (success: boolean) => {
    if (activeTask && success) {
      complete.mutate(activeTask.id);
      setTimeout(() => { setShowModal(false); setActiveTask(null); }, 500);
    } else {
      setShowModal(false);
      setActiveTask(null);
    }
  };

  return (
    <div className="pb-24">
      <PageHeader 
        title="需求池" 
        subtitle={`待办事项: ${tasks?.filter(t => t.status !== 'COMPLETED').length}`}
        rightContent={
             <Button variant="outline" size="sm" onClick={() => generateTasks.mutate()} loading={generateTasks.isPending} icon={<RefreshCw size={14} />}>
                刷新OA
            </Button>
        }
      />
      
      <div className="grid gap-4">
        {isLoadingTasks ? (
           <div className="flex flex-col items-center justify-center py-20 text-content-400 space-y-4">
               <Loader2 className="animate-spin text-primary-400" size={40} />
               <p className="font-mono text-sm animate-pulse">SYNCING_WORK_ORDERS...</p>
           </div>
        ) : (
          tasks?.map(task => <TaskCard key={task.id} task={task} onStart={() => handleStartTask(task)} />)
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