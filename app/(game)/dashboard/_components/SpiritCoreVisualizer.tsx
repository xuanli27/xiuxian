import React, { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { usePlayer } from '@/hooks/use-player';

interface Props {
  onClick: () => void;
}

export const SpiritCoreVisualizer: React.FC<Props> = ({ onClick }) => {
  const { player } = usePlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const progress = player ? Math.min(100, (player.qi / player.maxQi) * 100) : 0;

  useEffect(() => {
    if (!player || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    let animationId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
    }[] = [];

    const render = () => {
      const styles = getComputedStyle(document.documentElement);
      const pColor = styles.getPropertyValue('--accent-main').trim() || '#10B981';
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Draw Center Pulse
      const pulseSize = 50 + Math.sin(Date.now() / 500) * 5 + (progress / 5);
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, pulseSize * 2);
      gradient.addColorStop(0, `${pColor}40`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, pulseSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Core Ring
      ctx.beginPath();
      ctx.strokeStyle = pColor;
      ctx.lineWidth = 2;
      ctx.arc(w / 2, h / 2, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Rotating Ring
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Date.now() / 1000);
      ctx.beginPath();
      ctx.strokeStyle = pColor;
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([10, 10]);
      ctx.arc(0, 0, pulseSize - 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Particles
      if (particles.length < 20 + (progress / 2)) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 100;
        particles.push({
          x: w / 2 + Math.cos(angle) * dist,
          y: h / 2 + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3,
          life: 1
        });
      }

      particles.forEach((p, i) => {
        p.x += p.vx + (w / 2 - p.x) * 0.03; // Stronger attraction to center
        p.y += p.vy + (h / 2 - p.y) * 0.03;
        p.life -= 0.01;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0 || Math.abs(p.x - w / 2) < 5) particles.splice(i, 1);
      });

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [player, progress]);

  if (!player) return null;

  return (
    <div
      ref={containerRef}
      className="relative h-[400px] bg-surface-900 rounded-3xl border border-border-base overflow-hidden flex items-center justify-center cursor-pointer shadow-2xl shadow-black/50 transition-all hover:border-primary-500/30"
      onClick={onClick}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={16} className="text-primary-400 animate-pulse" />
          <span className="text-primary-400/70 font-mono text-xs tracking-widest">SPIRIT_CORE_MONITOR</span>
        </div>
        <h2 className="text-2xl font-xianxia text-content-100">内视运气图</h2>
      </div>

      <div className="z-10 text-center pointer-events-none select-none mt-48 group-hover:scale-110 transition-transform duration-500">
        <p className="text-primary-200/50 text-sm font-mono tracking-[0.2em] animate-pulse">CLICK_TO_CULTIVATE</p>
      </div>
    </div>
  );
};