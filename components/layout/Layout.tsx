
import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GameView } from '../../types';
import { Home, ListTodo, Backpack, Crown, Armchair, User, Moon, Sun, Cpu, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { view, player, setTheme, setView } = useGameStore();
  
  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', player.theme);
  }, [player.theme]);

  const showNav = view !== GameView.INTRO && view !== GameView.ONBOARDING_SPIRIT && view !== GameView.ONBOARDING_MIND && view !== GameView.TRIBULATION;

  return (
    <div className="min-h-screen bg-surface-950 text-content-100 font-serif selection:bg-primary-500/30 pb-24 transition-colors duration-700 relative overflow-hidden">
      
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-900/10 blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-900/10 blur-[120px]" />
      </div>

      {/* Inner Demon Vignette Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-1000 mix-blend-multiply"
        style={{ 
           background: `radial-gradient(circle at center, transparent 60%, #ef4444)`,
           opacity: Math.max(0, (player.innerDemon - 60) / 40) * 0.6
        }}
      />

      {/* Top Navbar */}
      {showNav && (
        <nav className="fixed top-0 w-full z-40 px-4 py-3 flex justify-between items-center">
          {/* Glass Background for Top Bar */}
          <div className="absolute inset-0 bg-surface-950/70 backdrop-blur-md border-b border-white/5 mask-gradient-b" />

          <div className="relative flex items-center gap-3 group cursor-pointer" onClick={() => setView(GameView.DASHBOARD)}>
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 p-0.5 shadow-[0_0_15px_var(--color-primary-500)] group-hover:shadow-[0_0_25px_var(--color-primary-500)] transition-shadow duration-500">
                    <div className="w-full h-full rounded-full bg-surface-900 overflow-hidden relative">
                         {player.avatar ? <img src={player.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={20} className="m-2 text-content-400" />}
                    </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-surface-900 rounded-full p-1 border border-border-base">
                    <span className="block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="font-xianxia text-lg text-content-100 leading-none tracking-widest">{player.name}</span>
                <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider mt-0.5">{player.sectRank}</span>
            </div>
          </div>
          
          <div className="relative flex items-center gap-3">
            {/* Theme Toggles */}
            <div className="flex gap-1 bg-surface-800/50 rounded-full p-1 border border-white/5 backdrop-blur-sm">
              <ThemeBtn active={player.theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon size={14} />} />
              <ThemeBtn active={player.theme === 'ink'} onClick={() => setTheme('ink')} icon={<Sun size={14} />} />
              <ThemeBtn active={player.theme === 'cyber'} onClick={() => setTheme('cyber')} icon={<Cpu size={14} />} />
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={clsx("relative z-10 max-w-5xl mx-auto transition-all duration-500", showNav ? "pt-24 px-4" : "")}>
        {children}
      </main>

      {/* Floating Bottom Navigation */}
      {showNav && (
        <div className="fixed bottom-6 left-4 right-4 z-40 flex justify-center">
          <div className="bg-surface-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 px-2 py-2 flex justify-between items-center gap-1 w-full max-w-md">
            <NavButton 
              icon={<Home size={20} />} 
              label="工位" 
              active={view === GameView.DASHBOARD} 
              onClick={() => setView(GameView.DASHBOARD)} 
            />
            <NavButton 
              icon={<Armchair size={20} />} 
              label="洞府" 
              active={view === GameView.CAVE} 
              onClick={() => setView(GameView.CAVE)} 
            />
             {/* Central Call to Action - Tasks */}
            <button 
                onClick={() => setView(GameView.TASKS)}
                className={clsx(
                    "relative -mt-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group",
                    view === GameView.TASKS 
                        ? "bg-primary-500 shadow-[0_0_20px_var(--color-primary-500)] scale-110" 
                        : "bg-surface-800 border border-border-base text-content-400 hover:text-content-100 hover:-translate-y-1"
                )}
            >
                <ListTodo size={24} className={view === GameView.TASKS ? "text-white" : ""} />
                {view === GameView.TASKS && (
                     <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                )}
            </button>

            <NavButton 
              icon={<Crown size={20} />} 
              label="宗门" 
              active={view === GameView.SECT} 
              onClick={() => setView(GameView.SECT)} 
            />
             <NavButton 
              icon={<Backpack size={20} />} 
              label="行囊" 
              active={view === GameView.INVENTORY} 
              onClick={() => setView(GameView.INVENTORY)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ThemeBtn = ({ active, onClick, icon }: any) => (
    <button onClick={onClick} className={clsx("w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300", active ? "bg-surface-700 text-primary-400 shadow-sm" : "text-content-400 hover:text-content-100 hover:bg-surface-700/50")}>
        {icon}
    </button>
);

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={clsx(
      "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-300 relative group hover:bg-white/5",
      active ? 'text-primary-400' : 'text-content-400'
    )}
  >
    <div className={clsx("transition-transform duration-300", active && "scale-110")}>
      {icon}
    </div>
    <span className={clsx("text-[9px] mt-1 font-bold transition-opacity", active ? "opacity-100" : "opacity-0 group-hover:opacity-70")}>{label}</span>
    {active && <span className="absolute bottom-1 w-1 h-1 bg-primary-400 rounded-full" />}
  </button>
);
