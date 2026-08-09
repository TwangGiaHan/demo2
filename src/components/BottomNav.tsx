import React from 'react';
import { ViewTab } from '../types';

interface BottomNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  language: 'VIE' | 'ENG';
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, language }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe h-16 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 shadow-2xl">
      {/* Home / Dashboard */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
          currentTab === 'dashboard'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">home</span>
        <span className="text-[10px] font-medium mt-0.5">{language === 'VIE' ? 'Trang Chủ' : 'Home'}</span>
      </button>

      {/* History / Request Tracker */}
      <button
        onClick={() => onSelectTab('status')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
          currentTab === 'status' || currentTab === 'requests'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]" data-weight="fill">history</span>
        <span className="text-[10px] font-medium mt-0.5">{language === 'VIE' ? 'Lịch Sử' : 'History'}</span>
      </button>

      {/* Registration / Profile */}
      <button
        onClick={() => onSelectTab('registration')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
          currentTab === 'registration'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">person</span>
        <span className="text-[10px] font-medium mt-0.5">{language === 'VIE' ? 'Đăng Ký' : 'Profile'}</span>
      </button>

      {/* Help / Settings */}
      <button
        onClick={() => onSelectTab('settings')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
          currentTab === 'settings' || currentTab === 'ailogs'
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">help_outline</span>
        <span className="text-[10px] font-medium mt-0.5">{language === 'VIE' ? 'Trợ Giúp' : 'Help'}</span>
      </button>
    </nav>
  );
};
