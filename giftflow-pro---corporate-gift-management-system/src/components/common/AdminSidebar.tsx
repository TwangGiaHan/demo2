import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Users,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminSidebarProps {
  currentTab: 'dashboard' | 'events' | 'inventory' | 'recipients' | 'reports';
  onSelectTab: (tab: 'dashboard' | 'events' | 'inventory' | 'recipients' | 'reports') => void;
  user: UserProfile;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
}) => {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events' as const, label: 'Events', icon: CalendarCheck },
    { id: 'inventory' as const, label: 'Inventory', icon: Package },
    { id: 'recipients' as const, label: 'Recipients', icon: Users },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
  ];

  return (
    <nav className="hidden md:flex flex-col h-screen py-6 px-4 gap-2 border-r border-[#c2c6d4]/40 bg-[#eff4ff]/60 w-[280px] fixed left-0 top-0 mt-16 z-40">
      {/* Admin Profile Badge */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3 mb-1">
          <img
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#003f87]/20 shadow-xs"
            alt={user.name}
            src={user.avatar}
          />
          <div>
            <h2 className="text-sm font-bold text-[#003f87]">Admin Portal</h2>
            <p className="text-xs text-[#424752]">{user.department || 'Corporate Logistics'}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-1 mt-2">
          <span className="text-[11px] font-medium text-[#727784]">v1.0.4 Enterprise</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Live Mock Sync
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-1 font-semibold text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg transition-all text-left ${
                isActive
                  ? 'text-[#003f87] font-bold border-r-4 border-[#003f87] bg-[#d9e3f1] shadow-xs'
                  : 'text-[#424752] hover:bg-[#dce9ff]/60 hover:text-[#0b1c30]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#003f87]' : 'text-[#555f6b]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Info Card */}
      <div className="mt-auto p-3.5 rounded-xl bg-white/80 border border-[#c2c6d4]/40 text-xs text-[#424752] shadow-xs">
        <div className="flex items-center gap-1.5 font-semibold text-[#003f87] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fulfillment Status</span>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Đợt quà Q3 Tech Conference đang mở phát quà trực tiếp tại quầy tầng 1.
        </p>
      </div>
    </nav>
  );
};

export default AdminSidebar;
