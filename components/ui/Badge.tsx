import React from 'react';
import clsx from 'clsx';

export const Badge: React.FC<{ label: string | number; icon?: React.ReactNode; color?: string; variant?: 'solid' | 'outline' }> = ({ label, icon, color = "text-primary-400", variant = 'outline' }) => (
  <span className={clsx(
      "text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold tracking-wide uppercase",
      variant === 'outline' ? `bg-surface-900 border border-white/5 ${color}` : `bg-primary-600 text-white border-transparent`
    )}>
     {icon && <span className="opacity-80">{icon}</span>} {label}
  </span>
);