import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Gift,
  Clock,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Download,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { CorporateEvent, DashboardMetrics, EventStatus } from '../../types';
import eventService from '../../services/eventService';

interface EventDashboardProps {
  onCreateEventClick: () => void;
  onViewEventDetail: (eventId: string) => void;
  onReviewPendingClick?: () => void;
}

export const EventDashboard: React.FC<EventDashboardProps> = ({
  onCreateEventClick,
  onViewEventDetail,
  onReviewPendingClick,
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeEvents: 12,
    activeEventsChange: '+2 from last month',
    totalGiftsClaimed: 4592,
    completionRate: '87% completion rate',
    pendingApprovals: 5,
  });

  const [events, setEvents] = useState<CorporateEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [m, evts] = await Promise.all([
        eventService.getMetrics(),
        eventService.getEvents({ search: searchQuery, status: statusFilter }),
      ]);
      setMetrics(m);
      setEvents(evts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter]);

  const handleExportCsv = async (e: React.MouseEvent, evt: CorporateEvent) => {
    e.stopPropagation();
    await eventService.exportEventCsv(evt.id, evt.title);
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#d7e2ff] text-[#004491] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#003f87] mr-1.5"></span>
            Active
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#d3e4fe] text-[#424752] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#727784] mr-1.5"></span>
            Draft
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#d9e3f1] text-[#555f6b] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#727784] mr-1.5"></span>
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-8 space-y-6">
      {/* Page Header (Screen 2) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30] tracking-tight">
            Event Dashboard
          </h1>
          <p className="text-sm text-[#424752] mt-0.5">
            Overview of active corporate gift campaigns.
          </p>
        </div>

        <button
          onClick={onCreateEventClick}
          className="bg-[#003f87] text-white text-sm font-semibold px-6 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#002d62] shadow-sm hover:shadow-md transition-all h-11 active:scale-95 duration-100"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Summary Cards Bento Grid (Screen 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Active Events */}
        <div className="bg-white border border-[#c2c6d4]/30 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#424752] uppercase tracking-wider">
              Active Events
            </span>
            <div className="w-8 h-8 rounded-full bg-[#003f87]/10 flex items-center justify-center text-[#003f87]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-4xl font-bold text-[#0b1c30]">{metrics.activeEvents}</span>
          </div>
          <span className="text-xs font-semibold text-[#003f87]">{metrics.activeEventsChange}</span>
        </div>

        {/* Card 2: Total Gifts Claimed */}
        <div className="bg-white border border-[#c2c6d4]/30 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-[#424752] uppercase tracking-wider">
              Total Gifts Claimed
            </span>
            <div className="w-8 h-8 rounded-full bg-[#d9e3f1] flex items-center justify-center text-[#555f6b]">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-4xl font-bold text-[#0b1c30]">
              {metrics.totalGiftsClaimed.toLocaleString()}
            </span>
          </div>
          <span className="text-xs text-[#424752]">{metrics.completionRate}</span>
        </div>

        {/* Card 3: Pending Approvals (Featured Navy Card) */}
        <div className="bg-[#003f87] text-white rounded-2xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3 relative z-10">
            <span className="text-4xl font-bold text-white">{metrics.pendingApprovals}</span>
          </div>

          <button
            onClick={onReviewPendingClick || (() => onViewEventDetail('evt-001'))}
            className="text-xs font-semibold text-[#acc7ff] hover:text-white transition-colors flex items-center gap-1 relative z-10 w-fit"
          >
            <span>Review Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Data Table Section (Screen 2) */}
      <div className="bg-white border border-[#c2c6d4]/30 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Table Top Controls */}
        <div className="p-4 md:p-5 border-b border-[#c2c6d4]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#0b1c30]">Recent Campaigns</h3>
            <span className="text-xs bg-[#eff4ff] text-[#003f87] font-semibold px-2.5 py-0.5 rounded-full">
              {events.length} Campaigns
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#727784]" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#f8f9ff] rounded-xl border border-[#c2c6d4]/50 focus:ring-2 focus:ring-[#003f87] focus:bg-white text-xs outline-none transition-all"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-9 px-3 py-1 bg-[#f8f9ff] rounded-xl border border-[#c2c6d4]/50 text-xs font-medium text-[#0b1c30] outline-none cursor-pointer hover:bg-white transition-all"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] text-xs font-bold text-[#424752] uppercase tracking-wider border-b border-[#c2c6d4]/30">
                <th className="px-5 py-3.5">Event Name</th>
                <th className="px-5 py-3.5">Start Date</th>
                <th className="px-5 py-3.5">Deadline</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#0b1c30] divide-y divide-[#c2c6d4]/20">
              {events.map((evt, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <tr
                    key={evt.id}
                    onClick={() => onViewEventDetail(evt.id)}
                    className={`hover:bg-[#eff4ff]/60 transition-colors group cursor-pointer ${
                      isEven ? 'bg-[#f8f9ff]/40' : 'bg-white'
                    }`}
                  >
                    <td className="px-5 py-4 font-semibold text-[#0b1c30]">
                      <div className="flex flex-col">
                        <span className="text-sm group-hover:text-[#003f87] transition-colors">
                          {evt.title}
                        </span>
                        <span className="text-[11px] text-[#727784] font-normal font-mono">
                          {evt.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#424752]">{formatDate(evt.startDate)}</td>
                    <td className="px-5 py-4 text-[#424752]">{formatDate(evt.deadline)}</td>
                    <td className="px-5 py-4">{getStatusBadge(evt.status)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleExportCsv(e, evt)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#d9e3f1] text-[#003f87] transition-colors"
                          title="Download CSV report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewEventDetail(evt.id);
                          }}
                          className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#d7e2ff] rounded-lg text-[#003f87] font-semibold text-xs transition-colors border border-[#003f87]/20"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <p className="text-sm">No campaigns found matching your query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer (Screen 2) */}
        <div className="p-3.5 border-t border-[#c2c6d4]/30 bg-white flex justify-between items-center px-5">
          <span className="text-xs text-gray-500">Showing {events.length} active campaigns</span>
          <button
            onClick={() => onViewEventDetail(events[0]?.id || 'evt-001')}
            className="text-[#003f87] font-semibold text-xs px-3 py-1.5 hover:bg-[#eff4ff] rounded-lg transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
