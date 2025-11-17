import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  title?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, hover, onClick, title, icon }) => {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        "bg-surface-800/60 backdrop-blur-sm border border-border-base rounded-2xl p-5 relative overflow-hidden",
        hover && "transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1 cursor-pointer group",
        className
      )}
    >
      {(title || icon) && (
         <div className="flex items-center gap-3 mb-4 border-b border-border-base pb-3">
            {icon && <div className="text-primary-400">{icon}</div>}
            {title && <h3 className="font-bold text-lg text-content-100">{title}</h3>}
         </div>
      )}
      {children}
    </div>
  );
};