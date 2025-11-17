
'use client';

import React, { useEffect } from 'react';
import { GameView, Rank, SpiritRootType } from '../types';
import { useGameStore } from '../store/useGameStore';
import { IntroStory } from '../components/onboarding/IntroStory';
import { SpiritRootCanvas } from '../components/onboarding/SpiritRootCanvas';
import { MindPathQuiz } from '../components/onboarding/MindPathQuiz';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Tribulation } from '../components/tribulation/Tribulation';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { SectHall } from '../components/sect/SectHall';
import { Inventory } from '../components/inventory/Inventory';
import { CaveAbode } from '../components/cave/CaveAbode';

export default function Home() {
  const { 
    view, 
    setView, setPlayer, tick, initializeGame 
  } = useGameStore();
  
  // Initialize Game on Mount
  useEffect(() => { initializeGame(); }, []);
  
  // Main Game Loop
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
    <>
      {renderView()}
    </>
  );
}
