import React from 'react';
import { ViewTab } from '../types';

interface HeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  language: 'VIE' | 'ENG';
  onToggleLanguage: () => void;
  onOpenQuickAdd: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  onOpenQuickAdd,
  onToggleMobileMenu,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 md:pl-[300px] transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-300 hover:bg-slate-800 transition-colors rounded-xl active:scale-95"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-md shadow-indigo-500/10">
            <span className="material-symbols-outlined text-xl">deployed_code</span>
          </div>
          <span className="font-headline-md text-xl md:text-2xl font-bold text-white tracking-tight">
            Uniform<span className="text-indigo-400 font-medium">AI</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Quick Add Request Button */}
        <button
          onClick={onOpenQuickAdd}
          className="hidden sm:flex items-center justify-center h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/25 active:scale-95 border border-indigo-400/30"
        >
          <span className="material-symbols-outlined mr-1.5 text-[18px]">add</span>
          {language === 'VIE' ? 'Tạo Yêu Cầu Nhanh' : 'Quick Add Request'}
        </button>

        {/* Notifications Icon */}
        <button 
          onClick={() => onSelectTab('ailogs')}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors relative"
          title="AI Automation Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
        </button>

        {/* Language Toggle Button */}
        <button
          onClick={onToggleLanguage}
          className="font-semibold text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors px-3 py-1.5 rounded-xl border border-slate-700/60 active:scale-95 uppercase tracking-wider bg-slate-800/40"
          title="Switch Language (VIE / ENG)"
        >
          {language}
        </button>

        {/* User Profile Headshot */}
        <div 
          onClick={() => onSelectTab('settings')}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500/40 cursor-pointer hover:border-indigo-400 hover:ring-2 hover:ring-indigo-500/30 transition-all shadow-md"
          title="System Admin Profile"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC17zF3bYKmKqtyAXipeMiNocSAImeh0RzXAtc_9cpU-pxUf98wC6RyGagASGckapD8_Y_UUsfxdodVIaehxs-Doe7AwAN_187QA_-85wHB0ljfwlf8idunsc890dmz0AvQeWbtLsJqU-CTSjaIp_K7fWlZTmd2WITj6yP5o-638Jfn_CcdkJX4nWiqBCtF3U0GH6XCV0Q0KGRb5xrMw64tURR1YbLHDMVuU9ImBblJZ-DXXMNEbgL-"
            alt="System Admin Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
