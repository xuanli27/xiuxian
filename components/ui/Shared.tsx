
import React from 'react';
import clsx from 'clsx';
import { X, Loader2, ChevronRight } from 'lucide-react';

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
  const baseStyles = "relative overflow-hidden rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 group";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 border border-transparent",
    secondary: "bg-gradient-to-r from-secondary-600 to-secondary-500 text-white shadow-lg shadow-secondary-600/20 hover:shadow-secondary-600/40 border border-transparent",
    danger: "bg-gradient-to-r from-danger-600 to-danger-500 text-white shadow-lg shadow-danger-600/20 hover:shadow-danger-600/40 border border-transparent",
    ghost: "bg-transparent hover:bg-surface-800/50 text-content-400 hover:text-content-100",
    outline: "bg-transparent border border-border-base hover:border-primary-400 text-content-200 hover:bg-surface-800/30"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={clsx(baseStyles, variants[variant], sizes[size], className)} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {!loading && icon && <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>}
      {children}
      {/* Shine effect overlay */}
      {!disabled && variant !== 'ghost' && variant !== 'outline' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </button>
  );
};

// --- Cards ---
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className={clsx(
          "bg-surface-900 w-full rounded-3xl border border-border-base shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh] relative",
          maxWidth
        )}
      >
        {/* Decorative glowing border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />

        <div className="bg-surface-900/90 p-5 border-b border-border-base flex justify-between items-center shrink-0 z-10">
           <h3 className="font-bold text-xl flex items-center gap-3 text-content-100 font-xianxia">
              {icon && <span className="text-primary-400">{icon}</span>}
              {title}
           </h3>
           <button onClick={onClose} className="text-content-400 hover:text-content-100 p-2 rounded-full hover:bg-surface-800 transition-colors">
             <X size={20} />
           </button>
        </div>
        <div className={clsx("flex-1 relative bg-surface-950/50 p-0 flex flex-col", scrollable ? "overflow-y-auto" : "overflow-hidden")}>
           {children}
        </div>
      </div>
    </div>
  );
};

// --- Badges ---
export const Badge: React.FC<{ label: string | number; icon?: React.ReactNode; color?: string; variant?: 'solid' | 'outline' }> = ({ label, icon, color = "text-primary-400", variant = 'outline' }) => (
  <span className={clsx(
      "text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold tracking-wide uppercase",
      variant === 'outline' ? `bg-surface-900 border border-white/5 ${color}` : `bg-primary-600 text-white border-transparent`
    )}>
     {icon && <span className="opacity-80">{icon}</span>} {label}
  </span>
);

// --- Page Header ---
export const PageHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode; rightContent?: React.ReactNode }> = ({ title, subtitle, icon, rightContent }) => (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
    <div className="flex items-center gap-4">
      {icon && (
        <div className="p-3.5 bg-gradient-to-br from-surface-800 to-surface-900 rounded-2xl border border-border-base shadow-lg text-primary-400 group hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
      <div>
        <h1 className="font-xianxia text-4xl text-transparent bg-clip-text bg-gradient-to-r from-content-100 to-content-400">{title}</h1>
        {subtitle && <p className="text-content-400 text-sm mt-1 font-serif italic">{subtitle}</p>}
      </div>
    </div>
    {rightContent}
  </div>
);
