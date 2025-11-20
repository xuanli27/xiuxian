import React, { useState } from 'react';
import { usePlayer } from '@/hooks/use-player';
import { craftItem } from '@/features/cave/actions';
import { RECIPES, MATERIALS } from '@/data/constants';
import { Info, Hammer, Flame } from 'lucide-react';
import { Button } from '@/components/ui';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const CraftingStation: React.FC = () => {
  const { player } = usePlayer();
  const queryClient = useQueryClient();
  const [craftingId, setCraftingId] = useState<string | null>(null);
  const [result, setResult] = useState<'SUCCESS' | 'FAIL' | null>(null);

  const craftMutation = useMutation({
    mutationFn: (recipeId: string) => craftItem({ recipeId }),
    onSuccess: (data) => {
      setResult(data.success ? 'SUCCESS' : 'FAIL');
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ['player'] });
    },
    onError: (error) => {
      setResult('FAIL');
      toast.error('炼制过程中发生了意外');
      console.error(error);
    },
    onSettled: () => {
      setCraftingId(null);
      setTimeout(() => setResult(null), 2000);
    }
  });

  const handleCraft = (recipeId: string) => {
    setCraftingId(recipeId);
    setResult(null);
    // Add a small artificial delay for the animation
    setTimeout(() => {
      craftMutation.mutate(recipeId);
    }, 1500);
  };

  if (!player) return null;

  // Safe access to materials
  const playerMaterials = (player.materials as Record<string, number>) || {};

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center gap-2 text-content-400 text-sm bg-surface-800 p-3 rounded-xl border border-border-base">
        <Info size={16} className="text-primary-400" />
        <span>炼器成功率受洞府风水(Cave Level)与心性(Mind State)影响。</span>
      </div>

      <div className="grid gap-5">
        {RECIPES.map(recipe => {
          const canAffordStones = (player.spirit_stones || 0) >= recipe.baseCost;
          let canAffordMats = true;
          for (const [id, count] of Object.entries(recipe.materials)) {
            if ((playerMaterials[id] || 0) < count) canAffordMats = false;
          }
          const canCraft = canAffordStones && canAffordMats;
          const isCraftingThis = craftingId === recipe.id;

          return (
            <div key={recipe.id} className="bg-surface-800/60 backdrop-blur-sm p-5 rounded-2xl border border-border-base relative overflow-hidden group hover:border-secondary-500/30 transition-all shadow-sm">
              {/* Crafting Overlay */}
              {result && !isCraftingThis && craftingId === null && (
                // Simple toast logic would be better globally, but keeping local for simplicity
                null
              )}

              {/* Active Crafting Overlay */}
              {isCraftingThis && (
                <div className="absolute inset-0 z-20 bg-surface-900/90 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Flame className="text-secondary-500 animate-bounce mb-2" size={32} />
                  <span className="font-xianxia text-xl text-secondary-400 animate-pulse">炼制中...</span>
                </div>
              )}

              {/* Result Overlay */}
              {result && craftingId === null && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-surface-900/95 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                  <div className={clsx("text-4xl font-xianxia font-bold drop-shadow-lg", result === 'SUCCESS' ? "text-primary-400" : "text-danger-400")}>
                    {result === 'SUCCESS' ? "炼制成功!" : "炸炉了..."}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="font-bold text-content-100 text-lg">{recipe.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 w-20 bg-surface-900 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary-500" style={{ width: `${recipe.successRate * 100}%` }} />
                    </div>
                    <div className="text-xs text-content-400">成功率 {Math.round(recipe.successRate * 100)}%</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={!canCraft || craftingId !== null}
                  onClick={() => handleCraft(recipe.id)}
                  variant={canCraft ? 'secondary' : 'outline'}
                  icon={!isCraftingThis && <Hammer size={14} />}
                >
                  开炉
                </Button>
              </div>

              <div className="bg-surface-900/50 rounded-xl p-3 text-xs space-y-2 border border-white/5">
                <CraftCostItem name="灵石" current={player.spirit_stones || 0} cost={recipe.baseCost} icon="💎" />
                {Object.entries(recipe.materials).map(([matId, count]) => {
                  const mat = MATERIALS.find(m => m.id === matId);
                  return <CraftCostItem key={matId} name={mat?.name || matId} current={playerMaterials[matId] || 0} cost={count} icon={mat?.icon || '📦'} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CraftCostItem = ({ name, current, cost, icon }: { name: string, current: number, cost: number, icon: string }) => {
  const canAfford = current >= cost;
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-content-300"><span>{icon}</span> {name}</div>
      <div className={clsx("font-mono font-bold", canAfford ? "text-content-200" : "text-danger-400")}>
        {current}/{cost}
      </div>
    </div>
  );
};