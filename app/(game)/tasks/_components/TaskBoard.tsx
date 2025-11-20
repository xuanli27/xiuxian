'use client'

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card } from '@/components/ui';
import { getAvailableTasks, acceptTask, completeTask, generateNextTask } from '@/features/tasks/actions';
import type { Task } from '@/types/database';
import { toast } from 'sonner';
import { Scroll, CheckCircle2, RefreshCw, MapPin, Sword, BookOpen } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  initialTasks: Task[];
}

export const TaskBoard: React.FC<Props> = ({ initialTasks }) => {
  const queryClient = useQueryClient();

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getAvailableTasks(),
    initialData: initialTasks,
  });

  const generateTask = useMutation({
    mutationFn: () => generateNextTask(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('新任务已发布');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const accept = useMutation({
    mutationFn: (taskId: string) => acceptTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('任务已接受');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const complete = useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['player'] }); // Update player resources
      toast.success('任务完成！', {
        description: `获得奖励: ${result.rewards.spiritStones} 灵石, ${result.rewards.sectContribution} 贡献`
      });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'MEDIUM': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'HARD': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'EXTREME': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-content-400 bg-surface-800 border-surface-700';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'COMBAT': return <Sword size={18} />;
      case 'GATHER': return <MapPin size={18} />;
      case 'CRAFT': return <RefreshCw size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary-900/30 rounded-2xl border border-secondary-500/30 text-secondary-400">
            <Scroll size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-xianxia text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">
              宗门任务榜
            </h1>
            <p className="text-content-400 text-sm mt-1">积攒功德，兑换资源</p>
          </div>
        </div>

        <Button
          onClick={() => generateTask.mutate()}
          loading={generateTask.isPending}
          variant="secondary"
          icon={<RefreshCw size={16} className={clsx(generateTask.isPending && "animate-spin")} />}
        >
          刷新榜单
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.map((task, index) => (
          <div
            key={task.id}
            className="group relative animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-surface-700 to-surface-900 rounded-xl opacity-50 group-hover:opacity-100 transition duration-500 blur-sm group-hover:blur"></div>
            <Card className="relative h-full flex flex-col justify-between border-surface-700/50 bg-surface-900/90 hover:bg-surface-900 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={clsx("px-2 py-1 rounded text-xs font-bold border flex items-center gap-1", getDifficultyColor(task.difficulty))}>
                    {getTaskIcon(task.type)}
                    {task.difficulty}
                  </span>
                  <span className={clsx(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    task.status === 'COMPLETED' ? "bg-green-500/20 text-green-400" :
                      task.status === 'IN_PROGRESS' ? "bg-blue-500/20 text-blue-400" :
                        "bg-surface-800 text-content-400"
                  )}>
                    {task.status === 'PENDING' && '待领取'}
                    {task.status === 'IN_PROGRESS' && '进行中'}
                    {task.status === 'COMPLETED' && '已完成'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-content-100 mb-2 line-clamp-1" title={task.title}>{task.title}</h3>
                <p className="text-sm text-content-400 mb-4 line-clamp-3 h-[60px]">{task.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-content-400 bg-surface-950/50 p-2 rounded border border-surface-800">
                    <span>奖励灵石</span>
                    <span className="text-primary-400 font-bold">+{task.reward_stones}</span>
                  </div>
                  <div className="flex justify-between text-xs text-content-400 bg-surface-950/50 p-2 rounded border border-surface-800">
                    <span>宗门贡献</span>
                    <span className="text-secondary-400 font-bold">+{task.reward_contribution}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-800">
                {task.status === 'PENDING' ? (
                  <Button
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 border-none shadow-lg shadow-primary-900/20"
                    onClick={() => accept.mutate(task.id)}
                    loading={accept.isPending && accept.variables === task.id}
                  >
                    一键接取
                  </Button>
                ) : task.status === 'IN_PROGRESS' ? (
                  <div className="w-full relative h-10 bg-surface-950 rounded-lg overflow-hidden border border-surface-800">
                    <div className="absolute inset-0 flex items-center justify-center z-10 text-xs font-bold text-primary-300">
                      任务进行中...
                    </div>
                    <div className="absolute inset-y-0 left-0 bg-primary-900/30 w-1/2 animate-pulse" />
                    <Button
                      className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                      onClick={() => complete.mutate(task.id)}
                    />
                  </div>
                ) : (
                  <Button className="w-full" variant="ghost" disabled>
                    <CheckCircle2 size={16} className="mr-2" /> 已完成
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ))}

        {(!tasks || tasks.length === 0) && (
          <div className="col-span-full text-center py-20 text-content-400 bg-surface-900/30 rounded-2xl border border-surface-800 border-dashed">
            <Scroll size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无任务，请刷新榜单</p>
          </div>
        )}
      </div>
    </div>
  );
};