import React, { useEffect } from 'react';
import { GameView, Rank, SpiritRootType } from './types';
import { useGameStore } from './store/useGameStore';
import { SpiritRootCanvas, MindPathQuiz } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Tribulation } from './components/Tribulation';
import { TaskBoard } from './components/TaskBoard';
import { SectHall } from './components/SectHall';
import { Inventory } from './components/Inventory';
import { ScrollText, User, X, Home, ListTodo, Backpack, Crown } from 'lucide-react';

export default function App() {
  const { 
    view, player, offlineReport, 
    setView, setPlayer, tick, clearOfflineReport, initializeGame 
  } = useGameStore();
  
  // Init Logic
  useEffect(() => {
    initializeGame();
  }, []);

  // Game Loop
  useEffect(() => {
    const timer = setInterval(() => tick(), 100);
    return () => clearInterval(timer);
  }, []);

  const handleSpiritComplete = (root: SpiritRootType, avatar: string) => {
    setPlayer({ spiritRoot: root, avatar });
    setView(GameView.ONBOARDING_MIND);
  };

  const handleMindComplete = (mind: string) => {
    setPlayer({ mindState: mind, rank: Rank.MORTAL });
    setView(GameView.DASHBOARD);
  };

  // --- Render ---
  const renderView = () => {
    switch (view) {
      case GameView.ONBOARDING_SPIRIT:
        return <SpiritRootCanvas onNext={handleSpiritComplete} />;
      case GameView.ONBOARDING_MIND:
        return <MindPathQuiz onComplete={handleMindComplete} />;
      case GameView.TRIBULATION:
        return <Tribulation />;
      case GameView.TASKS:
        return <TaskBoard />;
      case GameView.SECT:
        return <SectHall />;
      case GameView.INVENTORY:
        return <Inventory />;
      case GameView.DASHBOARD:
      default:
        return (
          <Dashboard 
            onBreakthrough={() => setView(GameView.TRIBULATION)}
          />
        );
    }
  };

  const showNav = view !== GameView.ONBOARDING_SPIRIT && view !== GameView.ONBOARDING_MIND && view !== GameView.TRIBULATION;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-serif selection:bg-emerald-500/30 pb-20">
      {/* Top Navbar */}
      {showNav && (
        <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 overflow-hidden border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
               {player.avatar ? <img src={player.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={20} className="m-1.5" />}
            </div>
            <span className="font-xianxia text-xl text-emerald-100">仙欲宗</span>
          </div>
          <div className="flex gap-3 text-xs text-slate-400 items-center">
             <span className="text-amber-400 font-bold">{player.sectRank}</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{player.spiritRoot}</span>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={showNav ? "pt-20" : ""}>
        {renderView()}
      </main>

      {/* Bottom Navigation Bar */}
      {showNav && (
        <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur border-t border-slate-800 z-40 pb-safe">
          <div className="flex justify-around items-center h-16">
            <NavButton 
              icon={<Home size={24} />} 
              label="工位" 
              active={view === GameView.DASHBOARD} 
              onClick={() => setView(GameView.DASHBOARD)} 
            />
            <NavButton 
              icon={<Crown size={24} />} 
              label="宗门" 
              active={view === GameView.SECT} 
              onClick={() => setView(GameView.SECT)} 
            />
            <NavButton 
              icon={<ListTodo size={24} />} 
              label="需求" 
              active={view === GameView.TASKS} 
              onClick={() => setView(GameView.TASKS)} 
            />
             <NavButton 
              icon={<Backpack size={24} />} 
              label="行囊" 
              active={view === GameView.INVENTORY} 
              onClick={() => setView(GameView.INVENTORY)} 
            />
          </div>
        </div>
      )}

      {/* Offline Modal */}
      {offlineReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-800 border border-emerald-600 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={clearOfflineReport} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <ScrollText size={24} />
              <h2 className="font-xianxia text-2xl">摸鱼周报</h2>
            </div>
            <p className="whitespace-pre-line text-slate-300 leading-relaxed text-sm">
              {offlineReport}
            </p>
            <button 
               onClick={clearOfflineReport}
               className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition shadow-lg shadow-emerald-900/50"
            >
              继续搬砖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative ${active ? 'text-emerald-400 -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-xs mt-1 font-bold">{label}</span>
    {active && <span className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full" />}
  </button>
);