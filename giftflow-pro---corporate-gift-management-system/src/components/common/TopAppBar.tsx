import React from 'react';
import { Bell, Code2 } from 'lucide-react';
import { UserProfile } from '../../types';

interface TopAppBarProps {
  user: UserProfile;
  title?: string;
  onOpenApiDocs?: () => void;
  onToggleRole?: () => void;
  unreadNotificationsCount?: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  user,
  onOpenApiDocs,
  unreadNotificationsCount = 2,
}) => {
  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="flex justify-between items-center px-4 h-16 w-full fixed top-0 left-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#c2c6d4]/30 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <img
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#003f87]/20"
            alt={user.name}
            src={user.avatar}
          />
          <span className="text-xl font-bold tracking-tight text-[#003f87]">
            GiftFlow Pro
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onOpenApiDocs && (
            <button
              onClick={onOpenApiDocs}
              title="API Contract Inspector"
              className="text-[#003f87] p-2 hover:bg-[#eff4ff] transition-colors rounded-full flex items-center justify-center"
            >
              <Code2 className="w-5 h-5" />
            </button>
          )}
          <button
            className="text-[#003f87] relative active:scale-95 duration-100 p-2 hover:bg-[#eff4ff] transition-colors rounded-full flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            )}
          </button>
        </div>
      </header>

      {/* Desktop Top App Bar */}
      <header className="hidden md:flex justify-between items-center px-8 h-16 w-full fixed top-0 left-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#c2c6d4]/30 shadow-sm">
        <div className="flex items-center gap-3 w-[260px]">
          <span className="text-xl font-bold tracking-tight text-[#003f87]">
            GiftFlow Pro
          </span>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
          {onOpenApiDocs && (
            <button
              onClick={onOpenApiDocs}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#003f87]/30 text-[#003f87] hover:bg-[#eff4ff] transition-colors shadow-xs"
            >
              <Code2 className="w-4 h-4 text-[#003f87]" />
              <span>Backend API Endpoints Spec</span>
            </button>
          )}

          <button
            className="text-[#003f87] relative hover:bg-[#eff4ff] transition-colors p-2 rounded-full flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            )}
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-[#c2c6d4]/40">
            <img
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#003f87]/20"
              alt={user.name}
              src={user.avatar}
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-[#0b1c30] leading-tight">{user.name}</p>
              <p className="text-[11px] text-[#424752] leading-tight capitalize">{user.role} Portal</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopAppBar;
