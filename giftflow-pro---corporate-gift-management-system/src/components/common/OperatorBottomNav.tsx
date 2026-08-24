import React from 'react';
import { Home, Gift, Bell, User } from 'lucide-react';

interface OperatorBottomNavProps {
  currentTab: 'home' | 'my-gifts' | 'notifications' | 'profile';
  onSelectTab: (tab: 'home' | 'my-gifts' | 'notifications' | 'profile') => void;
  unreadCount?: number;
}

export const OperatorBottomNav: React.FC<OperatorBottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 2,
}) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'my-gifts' as const, label: 'My Gifts', icon: Gift },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-1.5 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-[#c2c6d4]/30 rounded-t-2xl md:hidden pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 px-4 py-1 relative ${
              isActive
                ? 'bg-[#d9e3f1] text-[#003f87] font-semibold rounded-full shadow-xs'
                : 'text-[#424752] hover:text-[#003f87] active:scale-95'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {tab.badge && tab.badge > 0 && !isActive && (
                <span className="absolute -top-1 -right-2 bg-[#ba1a1a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default OperatorBottomNav;
