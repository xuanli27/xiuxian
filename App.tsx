
import React, { useEffect } from 'react';
import { GameView, Rank, SpiritRootType } from './types';
import { useGameStore } from './store/useGameStore';
import { IntroStory } from './components/onboarding/IntroStory';
import { SpiritRootCanvas } from './components/onboarding/SpiritRootCanvas';
import { MindPathQuiz } from './components/onboarding/MindPathQuiz';
import { Dashboard } from './components/dashboard/Dashboard';
import { Tribulation } from './components/Tribulation';
import { TaskBoard } from './components/tasks/TaskBoard';
import { SectHall } from './components/sect/SectHall';
import { Inventory } from './components/inventory/Inventory';
import { CaveAbode } from './components/cave/CaveAbode';
import { Layout } from './components/layout/Layout';
import { Modal } from './components/ui/Shared';
import { ScrollText } from 'lucide-react';

export default function App() {
  const { 
    view, offlineReport, 
    setView, setPlayer, tick, clearOfflineReport, initializeGame 
  } = useGameStore();
  
  useEffect(() => { initializeGame(); }, []);
  useEffect(() => {
    const timer = setInterval(() => tick(), 100);
    return () => clearInterval(timer);
  }, []);

  const handleIntroComplete = () => {
    setView(GameView.ONBOARDING_SPIRIT);
  };

  const handleSpiritComplete = (root: SpiritRootType, avatar: string) => {
    setPlayer({ spiritRoot: root, avatar });
    setView(GameView.ONBOARDING_MIND);
  };

  const handleMindComplete = (mind: string) => {
    setPlayer({ mindState: mind, rank: Rank.MORTAL, level: 1 });
    setView(GameView.DASHBOARD);
  };

  const renderView = () => {
    switch (view) {
      case GameView.INTRO: return <IntroStory onNext={handleIntroComplete} />;
      case GameView.ONBOARDING_SPIRIT: return <SpiritRootCanvas onNext={handleSpiritComplete} />;
      case GameView.ONBOARDING_MIND: return <MindPathQuiz onComplete={handleMindComplete} />;
      case GameView.TRIBULATION: return <Tribulation />;
      case GameView.TASKS: return <TaskBoard />;
      case GameView.SECT: return <SectHall />;
      case GameView.INVENTORY: return <Inventory />;
      case GameView.CAVE: return <CaveAbode />;
      case GameView.DASHBOARD: default:
        return <Dashboard onBreakthrough={() => setView(GameView.TRIBULATION)} />;
    }
  };

  return (
    <Layout>
      {renderView()}
      
      <Modal 
        isOpen={!!offlineReport} 
        onClose={clearOfflineReport}
        title="摸鱼周报"
        icon={<ScrollText className="text-primary-400" size={24} />}
      >
         <div className="p-6">
           <p className="whitespace-pre-line text-content-200 leading-relaxed text-sm mb-8 font-serif p-4 bg-surface-950/50 rounded-xl border border-white/5">
             {offlineReport}
           </p>
           <button 
             onClick={clearOfflineReport}
             className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-600/30"
           >
             继续搬砖
           </button>
         </div>
      </Modal>
    </Layout>
  );
}
