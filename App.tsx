import React, { useState, useEffect } from 'react';
import { 
  GameView, Rank, SpiritRootType, 
  PlayerStats, Task, RANK_THRESHOLDS 
} from './types';
import { SpiritRootCanvas, MindPathQuiz } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Tribulation } from './components/Tribulation';
import { TaskBoard } from './components/TaskBoard';
import { generateOfflineSummary } from './services/geminiService';
import { ScrollText, User, X, Home, ListTodo, Backpack } from 'lucide-react';

const INITIAL_STATS: PlayerStats = {
  name: '道友',
  avatar: '',
  rank: Rank.MORTAL,
  level: 1,
  qi: 0,
  maxQi: 100,
  spiritRoot: SpiritRootType.WASTE,
  mindState: '凡人',
  innerDemon: 0,
  coins: 0,
  location: '新手村',
  history: [],
  createTime: Date.now(),
  lastLoginTime: Date.now()
};

const OFFLINE_QI_RATE = 0.5; // Qi per second offline
const ONLINE_QI_RATE = 2;   // Qi per second online

export default function App() {
  const [view, setView] = useState<GameView>(GameView.ONBOARDING_SPIRIT);
  const [player, setPlayer] = useState<PlayerStats>(INITIAL_STATS);
  const [tasks, setTasks] = useState<Task[]>([]); // Manage tasks here
  const [offlineReport, setOfflineReport] = useState<string | null>(null);
  
  // Load Game
  useEffect(() => {
    const saved = localStorage.getItem('xiuxian_save_v1');
    if (saved) {
      const parsed: PlayerStats = JSON.parse(saved);
      // Offline Calculation
      const now = Date.now();
      const diffSeconds = (now - parsed.lastLoginTime) / 1000;
      
      if (diffSeconds > 60) { // More than 1 minute offline
        const gainedQi = diffSeconds * OFFLINE_QI_RATE;
        parsed.qi += gainedQi;
        
        // Trigger offline report generation
        generateOfflineSummary(diffSeconds / 3600, parsed.rank, parsed.innerDemon).then(summary => {
          setOfflineReport(`离线 ${Math.floor(diffSeconds/60)} 分钟。\n获得灵气 ${Math.floor(gainedQi)}。\n\n${summary}`);
        });
      }
      
      setPlayer({ ...parsed, lastLoginTime: now });
      setView(GameView.DASHBOARD);
    }
  }, []);

  // Auto-Save Loop & Passive Gain
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayer(p => {
        // Only gain passive Qi if not in onboarding
        if (view === GameView.ONBOARDING_MIND || view === GameView.ONBOARDING_SPIRIT) return p;
        
        const newQi = p.qi + (ONLINE_QI_RATE / 10); // Tick every 100ms
        const newState = { ...p, qi: newQi, lastLoginTime: Date.now() };
        
        localStorage.setItem('xiuxian_save_v1', JSON.stringify(newState));
        return newState;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [view]);

  const handleSpiritComplete = (root: SpiritRootType, avatar: string) => {
    setPlayer(p => ({ ...p, spiritRoot: root, avatar }));
    setView(GameView.ONBOARDING_MIND);
  };

  const handleMindComplete = (mind: string) => {
    setPlayer(p => ({ ...p, mindState: mind }));
    // Finish setup
    const finalState = { ...player, mindState: mind, rank: Rank.QI_REFINING };
    setPlayer(finalState);
    localStorage.setItem('xiuxian_save_v1', JSON.stringify(finalState));
    setView(GameView.DASHBOARD);
  };

  const handleQiClick = () => {
    setPlayer(p => ({ ...p, qi: p.qi + 10 })); // Active click bonus
  };

  const handleBreakthroughSuccess = () => {
    setPlayer(p => {
      const ranks = Object.values(Rank);
      const currentIndex = ranks.indexOf(p.rank);
      const nextRank = ranks[currentIndex + 1] as Rank || Rank.IMMORTAL;
      
      return {
        ...p,
        rank: nextRank,
        qi: 0, // Reset Qi for next rank
        level: 1,
        maxQi: RANK_THRESHOLDS[nextRank] || Infinity
      };
    });
    setView(GameView.DASHBOARD);
  };

  const handleBreakthroughFail = () => {
    setPlayer(p => ({
      ...p,
      qi: Math.floor(p.qi * 0.5), // Lose half Qi
      innerDemon: Math.min(100, p.innerDemon + 20)
    }));
    setView(GameView.DASHBOARD);
  };

  const handleTaskComplete = (completedTask: Task) => {
    setPlayer(p => ({
      ...p,
      qi: p.qi + completedTask.reward.qi,
      // Add item logic here if inventory existed
    }));
    
    // Mark task as completed locally
    setTasks(prev => prev.map(t => t.id === completedTask.id ? { ...t, completed: true } : t));
  };

  // --- Render ---

  const renderView = () => {
    switch (view) {
      case GameView.ONBOARDING_SPIRIT:
        return <SpiritRootCanvas onNext={handleSpiritComplete} />;
      case GameView.ONBOARDING_MIND:
        return <MindPathQuiz onComplete={handleMindComplete} />;
      case GameView.TRIBULATION:
        return (
          <Tribulation 
            rank={player.rank} 
            onSuccess={handleBreakthroughSuccess} 
            onFail={handleBreakthroughFail}
            onClose={() => setView(GameView.DASHBOARD)}
          />
        );
      case GameView.TASKS:
        return (
          <TaskBoard 
            rank={player.rank}
            tasks={tasks}
            setTasks={setTasks}
            onCompleteTask={handleTaskComplete}
          />
        );
      case GameView.DASHBOARD:
      default:
        return (
          <Dashboard 
            stats={player} 
            onClickQi={handleQiClick} 
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 overflow-hidden border border-emerald-400">
               {player.avatar ? <img src={player.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={20} className="m-1.5" />}
            </div>
            <span className="font-xianxia text-xl text-emerald-100">摸鱼修仙录</span>
          </div>
          <div className="flex gap-3 text-xs text-slate-400">
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
        <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 z-40 pb-safe">
          <div className="flex justify-around items-center h-16">
            <NavButton 
              icon={<Home size={24} />} 
              label="洞府" 
              active={view === GameView.DASHBOARD} 
              onClick={() => setView(GameView.DASHBOARD)} 
            />
            <NavButton 
              icon={<ListTodo size={24} />} 
              label="任务" 
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
          <div className="bg-slate-800 border border-emerald-600 rounded-lg max-w-md w-full p-6 shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setOfflineReport(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <ScrollText size={24} />
              <h2 className="font-xianxia text-2xl">闭关日志</h2>
            </div>
            <p className="whitespace-pre-line text-slate-300 leading-relaxed">
              {offlineReport}
            </p>
            <button 
               onClick={() => setOfflineReport(null)}
               className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
            >
              出关
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
    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${active ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-xs mt-1 font-bold">{label}</span>
  </button>
);