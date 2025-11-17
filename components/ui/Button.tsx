import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
      {!disabled && variant !== 'ghost' && variant !== 'outline' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </button>
  );
};