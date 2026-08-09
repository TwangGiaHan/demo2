import React from 'react';
import { ViewTab } from '../types';

interface NavigationDrawerProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  language: 'VIE' | 'ENG';
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  language,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ViewTab,
      label: language === 'VIE' ? 'Bảng Điều Khiển' : 'Dashboard',
      icon: 'dashboard',
    },
    {
      id: 'requests' as ViewTab,
      label: language === 'VIE' ? 'Quản Lý Yêu Cầu' : 'Requests',
      icon: 'assignment',
    },
    {
      id: 'registration' as ViewTab,
      label: language === 'VIE' ? 'Đăng Ký Đồng Phục' : 'Registration',
      icon: 'edit_note',
    },
    {
      id: 'status' as ViewTab,
      label: language === 'VIE' ? 'Theo Dõi Đơn hàng' : 'Status Tracker',
      icon: 'local_shipping',
    },
    {
      id: 'inventory' as ViewTab,
      label: language === 'VIE' ? 'Kho Đồng Phục' : 'Inventory',
      icon: 'inventory_2',
    },
    {
      id: 'ailogs' as ViewTab,
      label: language === 'VIE' ? 'Nhật Ký AI' : 'AI Logs',
      icon: 'smart_toy',
    },
    {
      id: 'settings' as ViewTab,
      label: language === 'VIE' ? 'Cài Đặt Hệ Thống' : 'Settings',
      icon: 'settings',
    },
  ];

  const handleSelect = (id: ViewTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Navigation Drawer Container */}
      <nav
        className={`fixed left-0 top-0 z-40 h-screen w-[280px] bg-slate-900/95 border-r border-slate-800 flex flex-col transition-transform duration-300 md:translate-x-0 backdrop-blur-xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Profile Header Section */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-500/40 shrink-0 shadow-md">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC17zF3bYKmKqtyAXipeMiNocSAImeh0RzXAtc_9cpU-pxUf98wC6RyGagASGckapD8_Y_UUsfxdodVIaehxs-Doe7AwAN_187QA_-85wHB0ljfwlf8idunsc890dmz0AvQeWbtLsJqU-CTSjaIp_K7fWlZTmd2WITj6yP5o-638Jfn_CcdkJX4nWiqBCtF3U0GH6XCV0Q0KGRb5xrMw64tURR1YbLHDMVuU9ImBblJZ-DXXMNEbgL-"
              alt="System Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-sm text-slate-100 truncate">System Admin</h3>
            <p className="text-xs text-slate-400 truncate">Global Logistics</p>
            <p className="text-[11px] text-indigo-400 font-medium">v1.2.0 • AI Active</p>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/40'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'icon-filled text-white' : 'text-slate-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info badge */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span>Policy Engine v2.4</span>
          </div>
          <span className="font-mono text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">GA-HUB</span>
        </div>
      </nav>
    </>
  );
};
