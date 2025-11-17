import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../../ui';

export const StockMarketGame = ({ onComplete }: { onComplete: (s: boolean) => void }) => {
    const [data, setData] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'WAITING' | 'BETTING' | 'RESULT'>('WAITING');
    const [bet, setBet] = useState<'UP' | 'DOWN' | null>(null);
    const [result, setResult] = useState<'WIN' | 'LOSE' | null>(null);

    // Initialize random chart data
    useEffect(() => {
        const start = 50;
        const points = [start];
        for (let i = 0; i < 15; i++) {
            points.push(points[i] + (Math.random() * 10 - 5));
        }
        setData(points);
        setGameState('BETTING');
    }, []);

    const handleBet = (type: 'UP' | 'DOWN') => {
        setBet(type);
        setGameState('RESULT');
        
        const lastPrice = data[data.length - 1];
        const nextPrice = lastPrice + (Math.random() * 20 - 10);
        
        // Animation
        let step = 0;
        const steps = 25;
        const animInterval = setInterval(() => {
             step++;
             const intermediatePrice = lastPrice + ((nextPrice - lastPrice) * (step/steps));
             
             if (step === 1) setData(prev => [...prev, lastPrice]);
             else setData(prev => [...prev.slice(0, prev.length - 1), intermediatePrice]);

             if (step >= steps) {
                 clearInterval(animInterval);
                 const isWin = (type === 'UP' && nextPrice > lastPrice) || (type === 'DOWN' && nextPrice < lastPrice);
                 setResult(isWin ? 'WIN' : 'LOSE');
                 setTimeout(() => onComplete(isWin), 2000);
             }
        }, 40);
    };

    const maxVal = Math.max(...data) + 10;
    const minVal = Math.min(...data) - 10;
    const width = 300;
    const height = 120;
    
    const pointsStr = data.map((val, i) => {
        const x = (i / (data.length + (gameState === 'RESULT' ? 0 : 1) - 1)) * width;
        const y = height - ((val - minVal) / (maxVal - minVal)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full max-w-md bg-surface-900/90 rounded-xl p-5 border border-border-base shadow-2xl">
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold text-content-200 flex items-center gap-2">
                    <TrendingUp className="text-secondary-400" size={18}/> 
                    K线走势预测
                </div>
                {result && (
                    <span className={`text-lg font-bold font-xianxia ${result === 'WIN' ? 'text-primary-400' : 'text-danger-400'} animate-in zoom-in`}>
                        {result === 'WIN' ? '预判成功!' : '韭菜被割!'}
                    </span>
                )}
            </div>
            
            <div className="h-[120px] w-full bg-surface-950 rounded-lg mb-6 relative overflow-hidden border border-white/5">
                {/* Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_20px]" />
                
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="relative z-10">
                    <defs>
                         <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={result === 'LOSE' ? '#EF4444' : '#10B981'} stopOpacity="0.3"/>
                            <stop offset="100%" stopColor={result === 'LOSE' ? '#EF4444' : '#10B981'} stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <polygon 
                         points={`0,${height} ${pointsStr} ${width},${height}`} 
                         fill="url(#chartGradient)"
                    />
                    <polyline 
                        points={pointsStr} 
                        fill="none" 
                        stroke={result === 'LOSE' ? '#EF4444' : '#10B981'} 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>

            {gameState === 'BETTING' && (
                <div className="flex gap-4">
                    <Button variant="danger" className="flex-1 h-12" onClick={() => handleBet('UP')} icon={<TrendingUp />}>看涨 (Call)</Button>
                    <Button variant="primary" className="flex-1 h-12 bg-green-600 hover:bg-green-500 border-none shadow-green-600/20" onClick={() => handleBet('DOWN')} icon={<TrendingDown />}>看跌 (Put)</Button>
                </div>
            )}
            {gameState === 'RESULT' && !result && <div className="text-center text-sm text-content-400 animate-pulse font-mono">MARKET_VOLATILITY_DETECTED...</div>}
        </div>
    );
};