import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

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