import React, { useState } from 'react';
import { Home, FlaskConical } from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { CaveManager } from './CaveManager';
import { CraftingStation } from './CraftingStation';
import clsx from 'clsx';

export const CaveAbode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAVE' | 'CRAFT'>('CAVE');

  return (
    <div className="pb-24">
      <PageHeader 
        title="洞府" 
        subtitle="修仙者的私人领地"
        icon={<Home size={24} />}
        rightContent={
            <div className="bg-surface-800 p-1 rounded-xl border border-border-base flex gap-1 shadow-sm">
                <button onClick={() => setActiveTab('CAVE')} className={clsx("px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm", activeTab === 'CAVE' ? "bg-primary-600 text-white shadow-md" : "text-content-400 hover:text-content-200")}>
                    <Home size={14} /> 装修
                </button>
                <button onClick={() => setActiveTab('CRAFT')} className={clsx("px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm", activeTab === 'CRAFT' ? "bg-secondary-600 text-white shadow-md" : "text-content-400 hover:text-content-200")}>
                    <FlaskConical size={14} /> 炼器
                </button>
            </div>
        }
      />

      {activeTab === 'CAVE' ? <CaveManager /> : <CraftingStation />}
    </div>
  );
};