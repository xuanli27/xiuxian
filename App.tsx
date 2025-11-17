
import React, { useEffect } from 'react';
import { GameView, Rank, SpiritRootType } from './types';
import { useGameStore } from './store/useGameStore';
import { SpiritRootCanvas, MindPathQuiz, IntroStory } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Tribulation } from './components/Tribulation';
import { TaskBoard } from './components/TaskBoard';
import { SectHall } from './components/SectHall';
import { Inventory } from './components/Inventory';
import { CaveAbode } from './components/CaveAbode';
import { Layout } from './components/Layout';
import { Modal } from './components/ui/Shared';
import { ScrollText, X } from 'lucide-react';

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
           <p className="whitespace-pre-line text-content-200 leading-relaxed text-sm mb-6">{offlineReport}</p>
           <button 
             onClick={clearOfflineReport}
             className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition shadow-lg shadow-primary-600/30"
           >
             继续搬砖
           </button>
         </div>
      </Modal>
    </Layout>
  );
}