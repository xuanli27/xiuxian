'use client'

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '@/features/leaderboard/actions';
import { LeaderboardCategory, type LeaderboardEntry } from '@/features/leaderboard/types';
import { Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';
import type { LeaderboardResponse } from '@/features/leaderboard/types';

interface Props {
  initialLeaderboardData: LeaderboardResponse;
}

export const Leaderboard: React.FC<Props> = ({ initialLeaderboardData }) => {
  const [category, setCategory] = useState<LeaderboardCategory>(LeaderboardCategory.POWER);

  const { data: leaderboardResponse, isLoading } = useQuery({
    queryKey: ['leaderboard', category],
    queryFn: () => getLeaderboard(category),
    initialData: initialLeaderboardData,
  });

  const leaderboardData = leaderboardResponse?.entries;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.values(LeaderboardCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={clsx(
              'px-4 py-2 text-sm font-bold rounded-lg transition-all',
              category === cat ? 'bg-primary-500 text-white' : 'bg-surface-800 hover:bg-surface-700'
            )}
          >
            {cat.toString()}
          </button>
        ))}
      </div>

      <div className="bg-surface-800 rounded-lg border border-border-base">
        <table className="w-full text-left">
          <thead className="border-b border-border-base">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Player</th>
              <th className="p-4">Value</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData?.map((entry) => (
              <tr key={entry.player_id} className="border-b border-border-base last:border-b-0 hover:bg-surface-700/50">
                <td className="p-4 font-bold flex items-center gap-2">
                  {entry.ranking === 1 ? <Crown className="text-yellow-400" /> : entry.ranking}
                  <RankChange change={entry.rankChange} />
                </td>
                <td className="p-4">{entry.player_name}</td>
                <td className="p-4 font-mono">
                  {renderValue(entry, category)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RankChange = ({ change }: { change?: number }) => {
  if (change === undefined || change === 0) {
    return <Minus size={16} className="text-gray-500" />;
  }
  if (change > 0) {
    return <TrendingUp size={16} className="text-green-500" />;
  }
  return <TrendingDown size={16} className="text-red-500" />;
};

const renderValue = (entry: LeaderboardEntry, category: LeaderboardCategory) => {
  switch (category) {
    case 'REALM':
      return `${entry.rank} ${entry.level}级`;
    case 'POWER':
      return `${Number(entry.power_score)} 战力`;
    case 'WEALTH':
      return `${Number(entry.wealth_score)} 灵石`;
    case 'CONTRIBUTION':
      return `${Number(entry.contribution_score)} 贡献`;
    default:
      return '-';
  }
}