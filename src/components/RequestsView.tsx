import React, { useState } from 'react';
import { UniformRequest, RequestStatus } from '../types';

interface RequestsViewProps {
  requests: UniformRequest[];
  onUpdateRequestStatus: (id: string, newStatus: RequestStatus) => void;
  onOpenBatchValidate: () => void;
  onSelectRequest: (req: UniformRequest) => void;
  language: 'VIE' | 'ENG';
}

export const RequestsView: React.FC<RequestsViewProps> = ({
  requests,
  onUpdateRequestStatus,
  onOpenBatchValidate,
  onSelectRequest,
  language,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const filtered = requests.filter((r) => {
    const matchesSearch =
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.genId.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || r.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesDept =
      selectedDept === 'all' || r.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesType =
      selectedType === 'all' || r.uniformType.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesStatus && matchesDept && matchesType;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'Validating':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'Approved':
        return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
      case 'Ready':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'Action Required':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {language === 'VIE' ? 'Quản Lý Yêu Cầu Đồng Phục' : 'Request Management'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'VIE'
              ? 'Quản lý và theo dõi các yêu cầu đồng phục trên toàn bộ các phòng ban.'
              : 'Manage and track uniform requests across all departments.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenBatchValidate}
            className="px-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:bg-slate-700 transition-colors text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-indigo-400">fact_check</span>
            {language === 'VIE' ? 'Kiểm Duyệt Hàng Loạt' : 'Batch Validate'}
          </button>

          <button
            onClick={onOpenBatchValidate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 border border-indigo-400/30"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            {language === 'VIE' ? 'Phê Duyệt Hàng Loạt' : 'Batch Approval'}
          </button>

          <button
            onClick={() => alert(language === 'VIE' ? 'Đã xuất file báo cáo!' : 'Export complete!')}
            className="px-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:bg-slate-700 transition-colors text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-400">download</span>
            {language === 'VIE' ? 'Xuất Báo Cáo' : 'Export'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-lg backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === 'VIE' ? 'TÌM KIẾM' : 'SEARCH'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'VIE' ? 'Mã Đơn, GEN ID, Tên...' : 'GEN ID, Name...'}
                className="w-full h-10 pl-9 pr-3 bg-slate-900/80 rounded-xl border border-slate-700/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === 'VIE' ? 'TRẠNG THÁI' : 'STATUS'}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 px-3 bg-slate-900/80 rounded-xl border border-slate-700/60 focus:border-indigo-500 text-xs text-slate-200 outline-none transition-all"
            >
              <option value="all">{language === 'VIE' ? 'Tất cả trạng thái' : 'All Statuses'}</option>
              <option value="validating">Validating</option>
              <option value="approved">Approved</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="action required">Action Required</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === 'VIE' ? 'BỘ PHẬN' : 'DEPARTMENT'}
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full h-10 px-3 bg-slate-900/80 rounded-xl border border-slate-700/60 focus:border-indigo-500 text-xs text-slate-200 outline-none transition-all"
            >
              <option value="all">{language === 'VIE' ? 'Tất cả bộ phận' : 'All Departments'}</option>
              <option value="operations">Operations</option>
              <option value="maintenance">Maintenance</option>
              <option value="security">Security</option>
              <option value="logistics">Logistics</option>
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === 'VIE' ? 'LOẠI' : 'TYPE'}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-10 px-3 bg-slate-900/80 rounded-xl border border-slate-700/60 focus:border-indigo-500 text-xs text-slate-200 outline-none transition-all"
            >
              <option value="all">{language === 'VIE' ? 'Tất cả loại' : 'All Types'}</option>
              <option value="ghile">Ghile</option>
              <option value="polo">Polo Shirt</option>
              <option value="coverall">Coverall</option>
              <option value="jacket">Jacket</option>
              <option value="cargo">Cargo Pants</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === 'VIE' ? 'KHOẢNG THỜI GIAN' : 'DATE RANGE'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                calendar_month
              </span>
              <input
                type="text"
                readOnly
                value={language === 'VIE' ? '30 Ngày Gần Đây' : 'Last 30 Days'}
                className="w-full h-10 pl-9 pr-3 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs text-slate-200 cursor-pointer outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-700/60">
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  REQ NO
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  GEN ID
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  {language === 'VIE' ? 'HỌ TÊN' : 'NAME'}
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  {language === 'VIE' ? 'BỘ PHẬN' : 'DEPT'}
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  {language === 'VIE' ? 'LOẠI' : 'TYPE'}
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  {language === 'VIE' ? 'KÍCH CỠ' : 'SIZE'}
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  {language === 'VIE' ? 'LÝ DO' : 'REASON'}
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap text-right">
                  {language === 'VIE' ? 'SL' : 'QTY'}
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  {language === 'VIE' ? 'TRẠNG THÁI' : 'STATUS'}
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                  {language === 'VIE' ? 'NGÀY TẠO' : 'CREATED'}
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filtered.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-700/30 transition-colors relative group"
                >
                  <td 
                    onClick={() => onSelectRequest(req)} 
                    className="px-4 py-3 font-semibold text-indigo-400 whitespace-nowrap cursor-pointer hover:text-indigo-300 hover:underline"
                  >
                    {req.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400 font-mono">{req.genId}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-100">{req.employeeName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">{req.department}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-200">{req.uniformType}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-semibold text-slate-200">
                      {req.size}
                      {req.aiSuggested && (
                        <span
                          className="material-symbols-outlined text-indigo-400 text-[14px]"
                          title="AI Suggested Size"
                        >
                          auto_awesome
                        </span>
                      )}
                      {req.warning && (
                        <span
                          className="material-symbols-outlined text-rose-400 text-[14px]"
                          title={req.warning}
                        >
                          warning
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">{req.reason}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-slate-200">{req.quantity}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                    {req.createdAt}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionMenu(activeActionMenu === req.id ? null : req.id);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                      title="Update Request Options"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>

                    {/* Action Dropdown Menu */}
                    {activeActionMenu === req.id && (
                      <div className="absolute right-4 top-10 z-30 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 text-left text-xs">
                        <div className="px-3 py-1.5 font-bold text-slate-400 uppercase text-[10px] border-b border-slate-800 tracking-wider">
                          {language === 'VIE' ? 'Đổi Trạng Thái' : 'Change Status'}
                        </div>
                        <button
                          onClick={() => {
                            onUpdateRequestStatus(req.id, 'Approved');
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-slate-800 text-indigo-400 font-medium flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Approve Request
                        </button>
                        <button
                          onClick={() => {
                            onUpdateRequestStatus(req.id, 'Ready');
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-slate-800 text-blue-400 font-medium flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                          Mark Ready for Pickup
                        </button>
                        <button
                          onClick={() => {
                            onUpdateRequestStatus(req.id, 'Delivered');
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-slate-800 text-emerald-400 font-medium flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">task_alt</span>
                          Mark Delivered
                        </button>
                        <button
                          onClick={() => {
                            onUpdateRequestStatus(req.id, 'Action Required');
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-slate-800 text-rose-400 font-medium flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">warning</span>
                          Flag Action Required
                        </button>
                        <div className="border-t border-slate-800 my-1"></div>
                        <button
                          onClick={() => {
                            onSelectRequest(req);
                            setActiveActionMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-300 flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          View Order Tracker
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-500">
                    {language === 'VIE' ? 'Không tìm thấy kết quả nào' : 'No records match your criteria'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>
            {language === 'VIE'
              ? `Hiển thị 1 đến ${filtered.length} trong số 248 mục`
              : `Showing 1 to ${filtered.length} of 248 entries`}
          </span>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 border border-slate-700/60 rounded-lg bg-slate-800/50 text-slate-500 disabled:opacity-40"
            >
              {language === 'VIE' ? 'Trước' : 'Previous'}
            </button>
            <button className="px-3 py-1 border border-slate-700/60 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700">
              {language === 'VIE' ? 'Sau' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
