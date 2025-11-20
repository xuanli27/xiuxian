'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Sparkles, ListTodo, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Task } from '@/types/enums'

interface QuickAccessCardProps {
  currentTasks: Task[]
  hasActiveEvent: boolean
}

export function QuickAccessCard({ currentTasks, hasActiveEvent }: QuickAccessCardProps) {
  const activeTasks = currentTasks.filter(t => t.status === 'IN_PROGRESS')
  const pendingTasks = currentTasks.filter(t => t.status === 'PENDING')

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* 事件流卡片 */}
      <Card className="p-6 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Sparkles className="text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">修仙事件</h3>
              <p className="text-sm text-gray-400">命运的抉择</p>
            </div>
          </div>
          {hasActiveEvent && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full animate-pulse">
              进行中
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-300 mb-4">
          {hasActiveEvent 
            ? '你正面临一个重要的选择，每个决定都会影响你的修仙之路...'
            : '暂无事件发生，继续修炼或完成任务可能触发新的事件。'}
        </p>
        
        <Link href="/events">
          <Button variant="outline" className="w-full" icon={<ArrowRight size={16} />}>
            {hasActiveEvent ? '查看事件' : '探索事件'}
          </Button>
        </Link>
      </Card>

      {/* 任务卡片 */}
      <Card className="p-6 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ListTodo className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">摸鱼任务</h3>
              <p className="text-sm text-gray-400">OA需求池</p>
            </div>
          </div>
          {activeTasks.length > 0 && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {activeTasks.length}个进行中
            </span>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          {activeTasks.length > 0 ? (
            <div className="text-sm">
              <p className="text-gray-300 mb-2">当前任务：</p>
              <div className="bg-surface-900/50 p-2 rounded">
                <p className="font-medium text-blue-400">{activeTasks[0].title}</p>
              </div>
            </div>
          ) : pendingTasks.length > 0 ? (
            <p className="text-sm text-gray-300">
              有 {pendingTasks.length} 个待办任务等待处理
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              暂无任务，点击刷新OA获取新的摸鱼任务
            </p>
          )}
        </div>
        
        <Link href="/tasks">
          <Button variant="outline" className="w-full" icon={<ArrowRight size={16} />}>
            前往任务大厅
          </Button>
        </Link>
      </Card>
    </div>
  )
}