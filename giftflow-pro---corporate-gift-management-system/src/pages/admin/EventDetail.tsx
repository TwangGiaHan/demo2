import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Edit,
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  Search,
  Download,
  Upload,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Package,
} from 'lucide-react';
import { CorporateEvent, EmployeeRegistration, RegistrationStatus } from '../../types';
import eventService from '../../services/eventService';
import UploadResultModal from '../../components/admin/UploadResultModal';

interface EventDetailProps {
  eventId: string;
  onBack: () => void;
  onEditEvent: (event: CorporateEvent) => void;
  onShowToast: (title: string, msg?: string, type?: 'success' | 'error' | 'info') => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  eventId,
  onBack,
  onEditEvent,
  onShowToast,
}) => {
  const [event, setEvent] = useState<CorporateEvent | null>(null);
  const [registrations, setRegistrations] = useState<EmployeeRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEventData = async () => {
    setIsLoading(true);
    try {
      const [evtData, regData] = await Promise.all([
        eventService.getEventById(eventId),
        eventService.getEventRegistrations(eventId, searchQuery),
      ]);
      setEvent(evtData);
      setRegistrations(regData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [eventId, searchQuery]);

  const handleStatusChange = async (regId: string, newStatus: RegistrationStatus) => {
    try {
      await eventService.updateRegistrationStatus(regId, newStatus as any);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: newStatus } : r))
      );
      setActiveMenuId(null);
      onShowToast(
        'Đã cập nhật trạng thái',
        `Nhân viên ${regId} được chuyển sang trạng thái: ${newStatus}`,
        'success'
      );
    } catch {
      onShowToast('Lỗi cập nhật', 'Không thể thay đổi trạng thái lúc này', 'error');
    }
  };

  const handleDownloadCsv = async () => {
    if (!event) return;
    await eventService.exportEventCsv(event.id, event.title);
    onShowToast('Tải danh sách thành công', 'File CSV đã được lưu vào máy tính', 'success');
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'Received':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] text-xs font-semibold">
            Received
          </span>
        );
      case 'Registered':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#d7e2ff] text-[#003f87] text-xs font-semibold">
            Registered
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#555f6b] text-xs font-semibold border border-[#c2c6d4]/40">
            Pending
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

  if (!event) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Loading event information...</p>
      </div>
    );
  }

  const completionPercent = ((event.registeredCount / (event.targetCount || 1)) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-8 space-y-6">
      {/* Breadcrumb & Header (Screen 3) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-[#424752] hover:text-[#003f87] transition-colors mb-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30] tracking-tight">
            {event.title}
          </h1>
          <p className="text-xs md:text-sm text-[#424752] mt-1 font-mono">
            Event ID: {event.code} | Date: Oct 15 - Oct 18, 2023
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditEvent(event)}
            className="bg-white border border-[#c2c6d4]/60 hover:bg-[#eff4ff] text-[#003f87] font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Event</span>
          </button>
        </div>
      </div>

      {/* Event Summary Bento Grid (Screen 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Total Target */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#c2c6d4]/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#424752] uppercase tracking-wider mb-1">
                Total Target
              </p>
              <h3 className="text-4xl font-bold text-[#0b1c30]">
                {event.targetCount.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-[#eff4ff] rounded-full text-[#003f87]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[#003f87] text-xs font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>+50 from last event</span>
          </div>
        </div>

        {/* Card 2: Total Registered */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#c2c6d4]/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#424752] uppercase tracking-wider mb-1">
                Total Registered
              </p>
              <h3 className="text-4xl font-bold text-[#0b1c30]">
                {event.registeredCount.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-[#003f87]/10 rounded-full text-[#003f87]">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="w-full bg-[#d3e4fe] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#003f87] h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="text-xs text-[#424752] text-right font-medium">
              {completionPercent}% Completion
            </p>
          </div>
        </div>

        {/* Card 3: Remaining */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#c2c6d4]/30 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#424752] uppercase tracking-wider mb-1">
                Remaining
              </p>
              <h3 className="text-4xl font-bold text-[#0b1c30]">
                {event.remainingCount.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-[#ffdad6] rounded-full text-[#ba1a1a]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-[#424752] font-medium">Deadline in 14 days</p>
        </div>
      </div>

      {/* Registration Table Section (Screen 3) */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#c2c6d4]/30 overflow-hidden">
        {/* Table Header Actions */}
        <div className="p-4 md:p-6 border-b border-[#c2c6d4]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
          <h3 className="text-lg font-bold text-[#0b1c30]">Employee Registrations</h3>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#727784]" />
              <input
                type="text"
                placeholder="Search ID, Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-9 pr-4 py-2 bg-[#f8f9ff] rounded-xl border border-[#c2c6d4]/50 text-xs focus:ring-2 focus:ring-[#003f87] focus:bg-white outline-none"
              />
            </div>

            <button
              onClick={handleDownloadCsv}
              className="bg-[#eff4ff] text-[#003f87] border border-[#c2c6d4]/40 hover:bg-[#dce9ff] py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download List</span>
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#003f87] text-white hover:bg-[#002d62] py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Results</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] text-[#424752] text-xs font-bold uppercase tracking-wider border-b border-[#c2c6d4]/30">
                <th className="py-3.5 px-6 w-28">Emp ID</th>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Gift Choice</th>
                <th className="py-3.5 px-6 w-32">Status</th>
                <th className="py-3.5 px-6 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#0b1c30] divide-y divide-[#c2c6d4]/20">
              {registrations.map((row, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#eff4ff]/70 transition-colors ${
                      isEven ? 'bg-[#f8f9ff]/40' : 'bg-white'
                    }`}
                  >
                    <td className="py-4 px-6 font-mono font-medium text-[#424752]">
                      {row.empId}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#0b1c30]">{row.name}</td>
                    <td className="py-4 px-6 text-[#424752]">{row.department}</td>
                    <td className="py-4 px-6">
                      {row.giftChoiceName ? (
                        <span className="font-medium text-[#0b1c30]">{row.giftChoiceName}</span>
                      ) : (
                        <span className="text-[#727784] italic">Not Selected</span>
                      )}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(row.status)}</td>
                    <td className="py-4 px-6 text-right relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === row.id ? null : row.id)
                        }
                        className="text-[#727784] hover:text-[#003f87] p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === row.id && (
                        <div className="absolute right-6 top-10 w-44 bg-white border border-[#c2c6d4]/40 rounded-xl shadow-xl z-20 p-1.5 text-left text-xs">
                          <button
                            onClick={() => handleStatusChange(row.id, 'Received')}
                            className="w-full px-3 py-1.5 hover:bg-[#e6f4ea] text-[#137333] rounded-lg font-medium flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark as Received
                          </button>
                          <button
                            onClick={() => handleStatusChange(row.id, 'Registered')}
                            className="w-full px-3 py-1.5 hover:bg-[#eff4ff] text-[#003f87] rounded-lg font-medium flex items-center gap-1.5"
                          >
                            <Package className="w-3.5 h-3.5" />
                            Mark as Registered
                          </button>
                          <button
                            onClick={() => handleStatusChange(row.id, 'Pending')}
                            className="w-full px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded-lg font-medium flex items-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Mark as Pending
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination (Screen 3) */}
        <div className="p-4 flex items-center justify-between border-t border-[#c2c6d4]/30 bg-white px-6">
          <span className="text-xs text-[#424752]">
            Showing 1 to {registrations.length} of {event.registeredCount} entries
          </span>
          <div className="flex gap-2">
            <button
              disabled
              className="p-1.5 rounded-lg bg-[#f8f9ff] border border-[#c2c6d4]/40 text-[#727784] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg bg-[#f8f9ff] border border-[#c2c6d4]/40 text-[#0b1c30] hover:bg-[#eff4ff] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Results Modal */}
      <UploadResultModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        eventTitle={event.title}
        onUploadSuccess={(count) => {
          onShowToast(
            'Nhập kết quả thành công',
            `Đã cập nhật trạng thái nhận quà cho ${count} nhân sự.`,
            'success'
          );
          loadEventData();
        }}
      />
    </div>
  );
};

export default EventDetail;
