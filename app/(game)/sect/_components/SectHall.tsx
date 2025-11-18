'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Crown, Scroll, TrendingUp, Lock, ShoppingBag, Coins, Building2, Store } from 'lucide-react';
import { Button, Card, PageHeader } from '@/components/ui';
import { IdentityCard } from './IdentityCard';
import clsx from 'clsx';
import { getSectInfo, getPlayerSectStats, getSectPositions } from '@/features/sect/queries';
import { requestPromotion } from '@/features/sect/actions';
import { SECT_CONFIG } from '@/config/game';
import type { Player } from '@prisma/client';

interface Props {
  player: Player
}

export const SectHall: React.FC<Props> = ({ player }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'HALL' | 'SHOP'>('HALL');

  const { data: sectInfo } = useQuery({
    queryKey: ['sectInfo'],
    queryFn: () => getSectInfo(),
  });

  const { data: sectStats } = useQuery({
    queryKey: ['sectStats', player.id],
    queryFn: () => getPlayerSectStats(player.id),
  });

  const { data: positions } = useQuery({
    queryKey: ['sectPositions'],
    queryFn: () => getSectPositions(),
  });

  const promotion = useMutation({
    mutationFn: () => requestPromotion({ playerId: player.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectStats', player.id] });
      queryClient.invalidateQueries({ queryKey: ['player', player.id] });
    },
  });

  const currentPosition = positions?.find(p => p.rank === player.sectRank);
  const nextPosition = positions?.find(p => p.rank === SECT_CONFIG.ranks.names[player.sectRank]);
  const canPromote = sectStats && nextPosition && sectStats.totalContribution >= nextPosition.requiredContribution;

  return (
    <div className="pb-24">
      <PageHeader 
        title={sectInfo?.name} 
        subtitle={sectInfo?.description}
        icon={<Building2 size={24} />}
        rightContent={
             <div className="bg-surface-800 p-1 rounded-xl border border-border-base flex text-xs font-bold shadow-sm">
                <button onClick={() => setActiveTab('HALL')} className={clsx("px-5 py-2 rounded-lg transition-all duration-300 flex gap-2", activeTab === 'HALL' ? "bg-primary-600 text-white shadow-md" : "text-content-400 hover:text-content-100")}>
                    <Building2 size={14} /> 大殿
                </button>
                <button onClick={() => setActiveTab('SHOP')} className={clsx("px-5 py-2 rounded-lg transition-all duration-300 flex gap-2", activeTab === 'SHOP' ? "bg-secondary-600 text-white shadow-md" : "text-content-400 hover:text-content-100")}>
                    <Store size={14} /> 功德阁
                </button>
            </div>
        }
      />

      {activeTab === 'HALL' ? (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
          
          <IdentityCard player={player} />

          <div className="grid gap-6">
            <Card className="border-secondary-500/20 bg-secondary-900/5">
                <div className="flex items-center gap-3 mb-6 text-secondary-400 border-b border-secondary-500/20 pb-4">
                    <TrendingUp size={24} />
                    <h3 className="text-xl font-xianxia">职位晋升</h3>
                </div>
                
                {!nextPosition ? (
                <div className="text-center py-6 text-secondary-400 bg-secondary-400/10 rounded-2xl border border-secondary-400/20">
                    <Crown size={48} className="mx-auto mb-4 animate-bounce" />
                    <p className="text-lg font-bold">已至宗门巅峰</p>
                    <p className="text-sm opacity-70 mt-1">"高处不胜寒，唯有更咸鱼"</p>
                </div>
                ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-content-200 space-y-2">
                        <p className="text-sm text-content-400">下一职级</p>
                        <p className="text-2xl font-bold text-secondary-400">{nextPosition.name}</p>
                        <p className="text-xs text-content-400 flex items-center gap-1 bg-surface-900/50 px-2 py-1 rounded w-fit">
                            <Coins size={12}/> 晋升所需贡献: {nextPosition.requiredContribution}
                        </p>
                    </div>
                    <Button 
                        onClick={() => promotion.mutate()} 
                        disabled={!canPromote || promotion.isPending} 
                        variant="secondary" 
                        size="lg"
                        className="w-full md:w-auto"
                        icon={canPromote ? <TrendingUp size={18} /> : <Lock size={18} />}
                        loading={promotion.isPending}
                    >
                        {canPromote ? "申请晋升" : "贡献不足"}
                    </Button>
                </div>
                )}
            </Card>

            <Card>
                <div className="flex items-center gap-3 mb-4 text-content-400">
                    <Scroll size={20} />
                    <h3 className="text-lg font-serif">《仙欲宗门规·修订版》</h3>
                </div>
                <ul className="space-y-4 text-sm text-content-400 list-none pl-2 italic font-serif">
                    <li className="flex gap-3"><span className="text-primary-400">01.</span> 能坐着绝不站着，能躺着绝不坐着。</li>
                    <li className="flex gap-3"><span className="text-primary-400">02.</span> 遇到困难睡大觉，天塌下来有高个子顶着。</li>
                    <li className="flex gap-3"><span className="text-primary-400">03.</span> 严禁内卷，违者废除修为逐出宗门。</li>
                    <li className="flex gap-3"><span className="text-primary-400">04.</span> 宗主也是打工人，不要给他发消息。</li>
                </ul>
            </Card>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
           <div className="bg-surface-800 border border-secondary-500/20 rounded-2xl p-5 mb-6 flex justify-between items-center shadow-lg sticky top-20 z-20 backdrop-blur-md">
               <span className="text-secondary-400 font-bold flex items-center gap-2">
                   <Coins className="animate-bounce" /> 我的贡献
               </span>
               <span className="text-3xl font-mono text-secondary-400 font-bold drop-shadow-sm">{player.contribution}</span>
           </div>
           
           <div className="text-center py-20 text-content-400">功德阁开发中...</div>
        </div>
      )}
    </div>
  );
};