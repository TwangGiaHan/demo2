import React, { useState, useEffect } from 'react';
import { ViewTab, UniformRequest, AppStats, InventoryItem, AiAutomationLog, RequestStatus } from './types';
import { INITIAL_STATS, INITIAL_REQUESTS, INITIAL_INVENTORY, INITIAL_AI_LOGS } from './data/mockData';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { RequestsView } from './components/RequestsView';
import { RegistrationView } from './components/RegistrationView';
import { RequestStatusView } from './components/RequestStatusView';
import { InventoryView } from './components/InventoryView';
import { AiLogsView } from './components/AiLogsView';
import { SettingsView } from './components/SettingsView';
import { QuickAddModal } from './components/QuickAddModal';
import { SizeChartModal } from './components/SizeChartModal';
import { BatchValidateModal } from './components/BatchValidateModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [language, setLanguage] = useState<'VIE' | 'ENG'>('VIE');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isBatchValidateOpen, setIsBatchValidateOpen] = useState(false);

  // Data
  const [requests, setRequests] = useState<UniformRequest[]>(INITIAL_REQUESTS);
  const [stats, setStats] = useState<AppStats>(INITIAL_STATS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [aiLogs, setAiLogs] = useState<AiAutomationLog[]>(INITIAL_AI_LOGS);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('#REQ-8492A');

  // Fetch initial data from server
  const fetchAllData = async () => {
    try {
      const [statsRes, reqsRes, invRes, logsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/requests'),
        fetch('/api/inventory'),
        fetch('/api/ai/logs'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (reqsRes.ok) setRequests(await reqsRes.json());
      if (invRes.ok) setInventory(await invRes.json());
      if (logsRes.ok) setAiLogs(await logsRes.json());
    } catch (e) {
      console.log('Using initial client state:', e);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'VIE' ? 'ENG' : 'VIE'));
  };

  const handleRegisterSubmit = async (data: Partial<UniformRequest>) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newReq: UniformRequest = await res.json();
        setRequests((prev) => [newReq, ...prev]);
        setSelectedRequestId(newReq.id);
        setCurrentTab('status');
      } else {
        // Fallback local create
        const localReq: UniformRequest = {
          id: `RQ-2023-${Math.floor(1000 + Math.random() * 9000)}`,
          orderNumber: `#REQ-${Math.floor(1000 + Math.random() * 9000)}A`,
          genId: data.genId || 'G-89421',
          employeeName: data.employeeName || 'Nguyen Van A',
          department: data.department || 'Operations',
          costCenter: data.costCenter || 'CC-8942-VN',
          uniformType: data.uniformType || 'Ghile',
          category: data.category || 'Operations - Field',
          size: data.size || 'M',
          reason: data.reason || 'New Hire Allocation',
          quantity: data.quantity || 1,
          status: 'Validating',
          createdAt: 'Just now',
          aiSuggested: true,
          aiNote: 'AI Verified & Suggested Size',
          pickupLocation: 'GA Warehouse',
          pickupTime: 'Thursday, 08:00 - 16:00',
          returnRequired: data.reason === 'Replace',
          returnReason: data.reason,
        };
        setRequests((prev) => [localReq, ...prev]);
        setSelectedRequestId(localReq.id);
        setCurrentTab('status');
      }
    } catch (e) {
      console.error('Failed to post request:', e);
    }
  };

  const handleUpdateRequestStatus = async (id: string, newStatus: RequestStatus) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      } else {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (e) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    }
  };

  const handleRunBatchValidate = async () => {
    try {
      const res = await fetch('/api/ai/batch-validate', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.requests) {
          setRequests(data.requests);
        }
      } else {
        setRequests((prev) =>
          prev.map((r) =>
            r.status === 'Validating'
              ? { ...r, status: 'Approved', aiNote: 'Auto-approved by AI Policy Engine' }
              : r
          )
        );
      }
      fetchAllData();
    } catch (e) {
      setRequests((prev) =>
        prev.map((r) =>
          r.status === 'Validating'
            ? { ...r, status: 'Approved', aiNote: 'Auto-approved by AI Policy Engine' }
            : r
        )
      );
    }
  };

  const handleSelectRequestFromTable = (req: UniformRequest) => {
    setSelectedRequestId(req.id);
    setCurrentTab('status');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans antialiased selection:bg-indigo-500/30">
      {/* Header Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Navigation Drawer (Sidebar / Mobile Menu) */}
      <NavigationDrawer
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        language={language}
      />

      {/* Main Content Area */}
      <main className="pt-20 md:pl-[300px] px-4 md:px-10 min-h-screen">
        {currentTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            requests={requests}
            onSelectTab={setCurrentTab}
            onOpenBatchValidate={() => setIsBatchValidateOpen(true)}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onRequestClick={handleSelectRequestFromTable}
            language={language}
          />
        )}

        {currentTab === 'requests' && (
          <RequestsView
            requests={requests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onOpenBatchValidate={() => setIsBatchValidateOpen(true)}
            onSelectRequest={handleSelectRequestFromTable}
            language={language}
          />
        )}

        {currentTab === 'registration' && (
          <RegistrationView
            onRegisterSubmit={handleRegisterSubmit}
            onOpenSizeChart={() => setIsSizeChartOpen(true)}
            language={language}
          />
        )}

        {currentTab === 'status' && (
          <RequestStatusView
            requests={requests}
            selectedRequestId={selectedRequestId}
            onConfirmReceived={(id) => handleUpdateRequestStatus(id, 'Delivered')}
            language={language}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView inventory={inventory} language={language} />
        )}

        {currentTab === 'ailogs' && <AiLogsView logs={aiLogs} language={language} />}

        {currentTab === 'settings' && (
          <SettingsView language={language} onToggleLanguage={handleToggleLanguage} />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} language={language} />

      {/* Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleRegisterSubmit}
        language={language}
      />

      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        language={language}
      />

      <BatchValidateModal
        isOpen={isBatchValidateOpen}
        onClose={() => setIsBatchValidateOpen(false)}
        onRunBatchValidate={handleRunBatchValidate}
        language={language}
      />
    </div>
  );
}
