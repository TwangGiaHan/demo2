/**
 * GiftFlow Pro - Corporate Swag & Logistics Management Application
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { UserProfile, CorporateEvent } from './types';
import { CURRENT_USER, ADMIN_USER } from './data/mockData';

// Common Components
import TopAppBar from './components/common/TopAppBar';
import AdminSidebar from './components/common/AdminSidebar';
import OperatorBottomNav from './components/common/OperatorBottomNav';
import { Toast, ToastProps } from './components/common/Toast';
import RoleSwitcher from './components/common/RoleSwitcher';
import ApiDocDrawer from './components/admin/ApiDocDrawer';
import CreateEventModal from './components/admin/CreateEventModal';

// Operator Pages
import GiftHistory from './pages/operator/GiftHistory';
import GiftRegistration from './pages/operator/GiftRegistration';
import NotificationsPage from './pages/operator/Notifications';
import ProfilePage from './pages/operator/Profile';

// Admin Pages
import EventDashboard from './pages/admin/EventDashboard';
import EventDetail from './pages/admin/EventDetail';
import InventoryPage from './pages/admin/Inventory';
import RecipientsPage from './pages/admin/Recipients';
import ReportsPage from './pages/admin/Reports';

// Services
import eventService from './services/eventService';

export function App() {
  // Current logged in user context
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);

  // High-level Portal Role: 'admin' | 'operator'
  const [currentView, setCurrentView] = useState<'admin' | 'operator'>('operator');

  const handleSwitchView = (v: 'admin' | 'operator') => {
    setCurrentView(v);
    setCurrentUser(v === 'admin' ? ADMIN_USER : CURRENT_USER);
    setSelectedEventId(null);
    setIsOperatorRegistering(false);
  };

  // Navigation states
  const [adminTab, setAdminTab] = useState<'dashboard' | 'events' | 'inventory' | 'recipients' | 'reports'>('dashboard');
  const [operatorTab, setOperatorTab] = useState<'home' | 'my-gifts' | 'notifications' | 'profile'>('my-gifts');
  
  // Drill-down states
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isOperatorRegistering, setIsOperatorRegistering] = useState<boolean>(false);

  // Modals & Drawers
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isApiDocOpen, setIsApiDocOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Event creation handler
  const handleCreateEvent = async (eventData: Partial<CorporateEvent>) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      addToast(
        'Tạo sự kiện thành công!',
        `Sự kiện "${newEvent.title}" (${newEvent.code}) đã được kích hoạt.`,
        'success'
      );
      setAdminTab('dashboard');
    } catch (err: any) {
      addToast('Lỗi tạo sự kiện', err?.message || 'Vui lòng kiểm tra lại thông tin', 'error');
    }
  };

  // Switcher navigation handler
  const handleNavigateToScreen = (nav: string) => {
    if (nav === 'my-gifts') {
      setCurrentView('operator');
      setOperatorTab('my-gifts');
      setIsOperatorRegistering(false);
    } else if (nav === 'registration') {
      setCurrentView('operator');
      setOperatorTab('my-gifts');
      setIsOperatorRegistering(true);
    } else if (nav === 'dashboard') {
      setCurrentView('admin');
      setAdminTab('dashboard');
      setSelectedEventId(null);
    } else if (nav === 'event-detail') {
      setCurrentView('admin');
      setAdminTab('dashboard');
      setSelectedEventId('evt-001');
    } else if (nav === 'create-event') {
      setCurrentView('admin');
      setIsCreateEventModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#d7e2ff] selection:text-[#003f87]">
      {/* Toast Notification Layer */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast {...toast} onClose={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top App Bar */}
      <TopAppBar
        user={currentUser}
        onOpenApiDocs={() => setIsApiDocOpen(true)}
        unreadNotificationsCount={2}
      />

      {/* Layout Body */}
      <div className="flex-1 flex pt-16 pb-20 md:pb-8">
        {/* Admin Navigation Sidebar (Desktop only for Admin view) */}
        {currentView === 'admin' && (
          <AdminSidebar
            currentTab={adminTab}
            onSelectTab={(tab) => {
              setAdminTab(tab);
              setSelectedEventId(null);
            }}
            user={currentUser}
          />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all ${
            currentView === 'admin' ? 'md:ml-[280px]' : 'w-full'
          }`}
        >
          {/* ================= OPERATOR PORTAL ================= */}
          {currentView === 'operator' && (
            <>
              {isOperatorRegistering ? (
                /* Screen 4: Đăng ký Nhận Quà Form */
                <GiftRegistration
                  onBack={() => setIsOperatorRegistering(false)}
                  onSuccess={(giftName) => {
                    setIsOperatorRegistering(false);
                    addToast(
                      'Đăng ký quà thành công!',
                      `Bạn đã chọn: ${giftName}. Thông tin đã được gửi đến ban tổ chức.`,
                      'success'
                    );
                  }}
                />
              ) : (
                <>
                  {operatorTab === 'home' && (
                    <GiftHistory
                      onChangeGiftClick={() => setIsOperatorRegistering(true)}
                    />
                  )}
                  {operatorTab === 'my-gifts' && (
                    /* Screen 1: Lịch Sử Quà Tặng */
                    <GiftHistory
                      onChangeGiftClick={() => setIsOperatorRegistering(true)}
                    />
                  )}
                  {operatorTab === 'notifications' && <NotificationsPage />}
                  {operatorTab === 'profile' && <ProfilePage user={currentUser} />}
                </>
              )}
            </>
          )}

          {/* ================= ADMIN PORTAL ================= */}
          {currentView === 'admin' && (
            <>
              {selectedEventId ? (
                /* Screen 3: Event Detail & Registrations */
                <EventDetail
                  eventId={selectedEventId}
                  onBack={() => setSelectedEventId(null)}
                  onEditEvent={(evt) => {
                    addToast('Sửa sự kiện', `Mở trình chỉnh sửa cho sự kiện: ${evt.title}`, 'info');
                  }}
                  onShowToast={addToast}
                />
              ) : (
                <>
                  {adminTab === 'dashboard' && (
                    /* Screen 2: Event Dashboard */
                    <EventDashboard
                      onCreateEventClick={() => setIsCreateEventModalOpen(true)}
                      onViewEventDetail={(id) => setSelectedEventId(id)}
                    />
                  )}
                  {adminTab === 'events' && (
                    <EventDashboard
                      onCreateEventClick={() => setIsCreateEventModalOpen(true)}
                      onViewEventDetail={(id) => setSelectedEventId(id)}
                    />
                  )}
                  {adminTab === 'inventory' && <InventoryPage />}
                  {adminTab === 'recipients' && <RecipientsPage />}
                  {adminTab === 'reports' && <ReportsPage />}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Operator Bottom Navigation (Mobile only for Operator view) */}
      {currentView === 'operator' && !isOperatorRegistering && (
        <OperatorBottomNav
          currentTab={operatorTab}
          onSelectTab={setOperatorTab}
          unreadCount={2}
        />
      )}

      {/* Floating Screen & Role Switcher + API Docs button */}
      <RoleSwitcher
        currentView={currentView}
        onSwitchView={handleSwitchView}
        onNavigateToScreen={handleNavigateToScreen}
        onOpenApiDocs={() => setIsApiDocOpen(true)}
        activeScreenTitle={
          currentView === 'admin'
            ? selectedEventId
              ? 'Screen 3: Event Detail'
              : 'Screen 2: Event Dashboard'
            : isOperatorRegistering
            ? 'Screen 4: Đăng ký Nhận Quà'
            : 'Screen 1: Lịch Sử Quà Tặng'
        }
      />

      {/* Screen 5: Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSubmit={handleCreateEvent}
      />

      {/* Backend API Endpoints Spec Drawer */}
      <ApiDocDrawer
        isOpen={isApiDocOpen}
        onClose={() => setIsApiDocOpen(false)}
      />
    </div>
  );
}

export default App;
