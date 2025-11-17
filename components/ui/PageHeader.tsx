import React from 'react';

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