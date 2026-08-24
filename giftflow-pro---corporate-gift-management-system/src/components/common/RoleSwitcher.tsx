import React, { useState } from 'react';
import { Shield, Smartphone, Code2, Sparkles, Layers, ChevronUp, ChevronDown } from 'lucide-react';

interface RoleSwitcherProps {
  currentView: 'admin' | 'operator';
  onSwitchView: (view: 'admin' | 'operator') => void;
  onNavigateToScreen: (screenId: string) => void;
  onOpenApiDocs: () => void;
  activeScreenTitle: string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentView,
  onSwitchView,
  onNavigateToScreen,
  onOpenApiDocs,
  activeScreenTitle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const screens = [
    { id: 'screen-1', label: 'Screen 1: Lịch Sử Quà Tặng (Operator)', targetView: 'operator' as const, nav: 'my-gifts' },
    { id: 'screen-2', label: 'Screen 2: Event Dashboard (Admin)', targetView: 'admin' as const, nav: 'dashboard' },
    { id: 'screen-3', label: 'Screen 3: Event Detail & Registrations (Admin)', targetView: 'admin' as const, nav: 'event-detail' },
    { id: 'screen-4', label: 'Screen 4: Đăng ký Nhận Quà (Operator Form)', targetView: 'operator' as const, nav: 'registration' },
    { id: 'screen-5', label: 'Screen 5: Create Event Modal (Admin)', targetView: 'admin' as const, nav: 'create-event' },
  ];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      <div className="flex flex-col items-end gap-2">
        {isExpanded && (
          <div className="bg-white/95 backdrop-blur-md border border-[#c2c6d4]/40 shadow-2xl rounded-2xl p-4 w-72 mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
              <span className="text-xs font-bold text-[#003f87] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Quick Screen Navigator
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                5 Screens
              </span>
            </div>

            {/* Quick Screen Jump Buttons */}
            <div className="flex flex-col gap-1.5 mb-3">
              {screens.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSwitchView(s.targetView);
                    onNavigateToScreen(s.nav);
                    setIsExpanded(false);
                  }}
                  className="text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-[#eff4ff] text-[#0b1c30] transition-colors flex items-center justify-between group"
                >
                  <span className="truncate group-hover:text-[#003f87] font-medium">{s.label}</span>
                  <span className="text-[10px] text-gray-400 group-hover:text-[#003f87]">→</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              {/* Toggle Role */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSwitchView('admin')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    currentView === 'admin'
                      ? 'bg-[#003f87] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </button>
                <button
                  onClick={() => onSwitchView('operator')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    currentView === 'operator'
                      ? 'bg-[#003f87] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Operator
                </button>
              </div>

              {/* API Inspector Button */}
              <button
                onClick={() => {
                  onOpenApiDocs();
                  setIsExpanded(false);
                }}
                className="w-full py-1.5 px-3 bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Backend API Endpoints Spec</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Toggle Pill */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 bg-[#003f87] text-white hover:bg-[#002d62] active:scale-95 shadow-xl px-4 py-2 rounded-full text-xs font-bold transition-all border border-white/20"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span>{currentView === 'admin' ? 'Admin Portal' : 'Operator Portal'}</span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
