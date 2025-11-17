
import React from 'react';
import clsx from 'clsx';
import { X, Loader2 } from 'lucide-react';

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', loading, icon, className, disabled, ...props 
}) => {
  const baseStyles = "rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/20",
    secondary: "bg-secondary-600 hover:bg-secondary-500 text-white shadow-secondary-600/20",
    danger: "bg-danger-600 hover:bg-danger-500 text-white shadow-danger-600/20",
    ghost: "bg-transparent hover:bg-surface-800 text-content-400 hover:text-content-100",
    outline: "bg-transparent border border-border-base hover:border-primary-400 text-content-200"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={clsx(baseStyles, variants[variant], sizes[size], className)} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
};

// --- Cards ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hover, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        "bg-surface-800 border border-border-base rounded-2xl p-4",
        hover && "transition-all hover:border-primary-500/30 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

// --- Modals ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  icon?: React.ReactNode;
  scrollable?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, onClose, title, children, maxWidth = "max-w-md", icon, scrollable = true 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={clsx("bg-surface-800 w-full rounded-3xl border border-border-base shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[95vh]", maxWidth)}>
        <div className="bg-surface-900 p-4 border-b border-border-base flex justify-between items-center shrink-0">
           <h3 className="font-bold text-lg flex items-center gap-2 truncate text-content-100">
              {icon}
              {title}
           </h3>
           <button onClick={onClose} className="text-content-400 hover:text-content-100 p-1 rounded hover:bg-surface-800 transition-colors">
             <X size={20} />
           </button>
        </div>
        <div className={clsx("flex-1 relative bg-surface-900/50 p-0 flex flex-col", scrollable ? "overflow-y-auto" : "overflow-hidden")}>
           {children}
        </div>
      </div>
    </div>
  );
};

// --- Badges ---
export const Badge: React.FC<{ label: string | number; icon?: React.ReactNode; color?: string }> = ({ label, icon, color = "text-primary-400" }) => (
  <span className={clsx("text-xs bg-surface-900 px-2 py-1 rounded border border-white/10 flex items-center gap-1 font-mono", color)}>
     {icon && <span>{icon}</span>} {label}
  </span>
);

// --- Page Header ---
export const PageHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode; rightContent?: React.ReactNode }> = ({ title, subtitle, icon, rightContent }) => (
  <div className="flex justify-between items-center mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
    <div className="flex items-center gap-3">
      {icon && (
        <div className="p-3 bg-surface-800 rounded-2xl border border-border-base shadow-inner text-primary-400">
          {icon}
        </div>
      )}
      <div>
        <h1 className="font-xianxia text-3xl text-secondary-400">{title}</h1>
        {subtitle && <p className="text-content-400 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
    {rightContent}
  </div>
);
