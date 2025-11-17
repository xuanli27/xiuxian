
import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameView } from '../types';
import { Home, ListTodo, Backpack, Crown, Armchair, User, Moon, Sun, Cpu } from 'lucide-react';
import clsx from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { view, player, setTheme, setView } = useGameStore();
  
  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', player.theme);
  }, [player.theme]);

  const showNav = view !== GameView.ONBOARDING_SPIRIT && view !== GameView.ONBOARDING_MIND && view !== GameView.TRIBULATION;

  return (
    <div className="min-h-screen bg-surface-950 text-content-100 font-serif selection:bg-primary-500/30 pb-20 transition-colors duration-500 relative overflow-hidden">
      
      {/* Inner Demon Vignette Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-1000 mix-blend-multiply"
        style={{ 
           background: `radial-gradient(circle at center, transparent 60%, #ef4444)`,
           opacity: Math.max(0, (player.innerDemon - 50) / 50) * 0.4
        }}
      />

      {/* Top Navbar */}
      {showNav && (
        <nav className="fixed top-0 w-full z-40 bg-surface-900/80 backdrop-blur-md border-b border-border-base px-4 py-3 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 overflow-hidden border border-primary-400 shadow-[0_0_10px_var(--color-primary-500)]">
               {player.avatar ? <img src={player.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={20} className="m-1.5" />}
            </div>
            <span className="font-xianxia text-xl text-primary-400 tracking-widest">仙欲宗</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggles */}
            <div className="flex gap-1 bg-surface-800 rounded-lg p-1 border border-border-base">
              <button onClick={() => setTheme('dark')} className={clsx("p-1.5 rounded hover:bg-surface-700 transition-colors", player.theme === 'dark' && "text-primary-400 bg-surface-700")}><Moon size={14} /></button>
              <button onClick={() => setTheme('ink')} className={clsx("p-1.5 rounded hover:bg-surface-700 transition-colors", player.theme === 'ink' && "text-primary-400 bg-surface-700")}><Sun size={14} /></button>
              <button onClick={() => setTheme('cyber')} className={clsx("p-1.5 rounded hover:bg-surface-700 transition-colors", player.theme === 'cyber' && "text-primary-400 bg-surface-700")}><Cpu size={14} /></button>
            </div>

            <div className="flex flex-col items-end text-xs text-content-400">
               <span className="text-secondary-400 font-bold">{player.sectRank}</span>
               <span className="scale-90 origin-right opacity-70">{player.spiritRoot}</span>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={showNav ? "pt-20 animate-in fade-in duration-500" : ""}>
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      {showNav && (
        <div className="fixed bottom-0 left-0 w-full bg-surface-900/90 backdrop-blur-lg border-t border-border-base z-40 pb-safe">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
            <NavButton 
              icon={<Home size={24} />} 
              label="工位" 
              active={view === GameView.DASHBOARD} 
              onClick={() => setView(GameView.DASHBOARD)} 
            />
            <NavButton 
              icon={<Armchair size={24} />} 
              label="洞府" 
              active={view === GameView.CAVE} 
              onClick={() => setView(GameView.CAVE)} 
            />
            <NavButton 
              icon={<ListTodo size={24} />} 
              label="需求" 
              active={view === GameView.TASKS} 
              onClick={() => setView(GameView.TASKS)} 
            />
            <NavButton 
              icon={<Crown size={24} />} 
              label="宗门" 
              active={view === GameView.SECT} 
              onClick={() => setView(GameView.SECT)} 
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
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={clsx(
      "flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative group",
      active ? 'text-primary-400 -translate-y-1' : 'text-content-400 hover:text-content-200'
    )}
  >
    <div className={clsx("transition-transform duration-300", active && "scale-110")}>
      {icon}
    </div>
    <span className={clsx("text-[10px] mt-1 font-bold transition-opacity", active ? "opacity-100" : "opacity-80")}>{label}</span>
    {active && <span className="absolute bottom-1 w-1 h-1 bg-primary-400 rounded-full animate-pulse" />}
  </button>
);
