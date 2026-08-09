import React, { useState } from 'react';
import { UniformRequest, AppStats, ViewTab } from '../types';

interface DashboardViewProps {
  stats: AppStats;
  requests: UniformRequest[];
  onSelectTab: (tab: ViewTab) => void;
  onOpenBatchValidate: () => void;
  onOpenQuickAdd: () => void;
  onRequestClick: (req: UniformRequest) => void;
  language: 'VIE' | 'ENG';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  requests,
  onSelectTab,
  onOpenBatchValidate,
  onOpenQuickAdd,
  onRequestClick,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.genId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDept =
      deptFilter === 'all' || r.department.toLowerCase() === deptFilter.toLowerCase();
    const matchesType =
      typeFilter === 'all' || r.uniformType.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesDept && matchesType;
  });

  const getStatusBadge = (status: string) => {
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
      {/* Page Title & Top Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {language === 'VIE' ? 'Cổng Quản Lý Đồng Phục' : 'Uniform Management Portal'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'VIE'
              ? 'Theo dõi, phê duyệt và điều phối yêu cầu đồng phục tự động bằng AI.'
              : 'Track, approve, and orchestrate uniform requests across all departments with AI.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuickAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25 border border-indigo-400/30 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {language === 'VIE' ? 'Tạo Yêu Cầu' : 'Quick Add Request'}
          </button>
        </div>
      </div>

      {/* Stats Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Requests */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-2 shadow-lg backdrop-blur-md hover:border-slate-600 transition-all">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'VIE' ? 'TỔNG YÊU CẦU' : 'TOTAL REQUESTS'}
            </span>
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <span className="material-symbols-outlined text-lg">analytics</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalRequests.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-indigo-400 font-medium">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>{stats.weeklyGrowth} {language === 'VIE' ? 'tuần này' : 'this week'}</span>
          </div>
        </div>

        {/* Card 2: Pending Approval */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-2 shadow-lg backdrop-blur-md hover:border-slate-600 transition-all">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'VIE' ? 'CHỜ PHÊ DUYỆT' : 'PENDING APPROVAL'}
            </span>
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <span className="material-symbols-outlined text-lg">pending_actions</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.pendingApproval}</div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>{language === 'VIE' ? 'Thời gian chờ TB:' : 'Avg wait:'} {stats.avgWaitTime}</span>
          </div>
        </div>

        {/* Card 3: Approved */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-2 shadow-lg backdrop-blur-md hover:border-slate-600 transition-all">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'VIE' ? 'ĐÃ PHÊ DUYỆT' : 'APPROVED'}
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.approved}</div>
          <div className="w-full bg-slate-900/80 rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full w-[68%] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
          </div>
        </div>

        {/* Card 4: Stock Alerts */}
        <div 
          onClick={() => onSelectTab('inventory')}
          className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex flex-col gap-2 shadow-lg backdrop-blur-md hover:border-rose-500/50 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start text-rose-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {language === 'VIE' ? 'CẢNH BÁO KHO' : 'STOCK ALERTS'}
            </span>
            <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-500/30 text-rose-300 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-rose-200">{stats.stockAlerts}</div>
          <div className="text-xs text-rose-300 font-medium flex items-center justify-between">
            <span>{language === 'VIE' ? 'Mặt hàng sắp hết trong kho' : 'Critical low inventory items'}</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Table & Batch Controls (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Batch Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBatchValidate}
              className="px-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:bg-slate-700 transition-colors text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-indigo-400">fact_check</span>
              {language === 'VIE' ? 'Kiểm Duyệt Hàng Loạt (AI)' : 'Batch Validate'}
            </button>
            <button
              onClick={onOpenBatchValidate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 border border-indigo-400/30"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              {language === 'VIE' ? 'Duyệt Hàng Loạt' : 'Batch Approval'}
            </button>
            <button
              onClick={() => alert(language === 'VIE' ? 'Đã xuất dữ liệu ra file CSV' : 'Exported dataset to CSV')}
              className="px-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:bg-slate-700 transition-colors text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400">download</span>
              {language === 'VIE' ? 'Xuất File' : 'Export'}
            </button>
          </div>

          {/* Filters Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'VIE' ? 'Mã Đơn, Tên...' : 'GEN ID, Name...'}
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                  {language === 'VIE' ? 'BO PHẬN' : 'DEPARTMENT'}
                </label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
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
                  {language === 'VIE' ? 'LOẠI ĐỒNG PHỤC' : 'TYPE'}
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
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
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-700/60">
                    <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase whitespace-nowrap">
                      {language === 'VIE' ? 'MÃ YÊU CẦU' : 'REQ NO'}
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
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => onRequestClick(req)}
                      className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3 font-semibold text-indigo-400 whitespace-nowrap group-hover:text-indigo-300">
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
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                        {language === 'VIE' ? 'Không tìm thấy yêu cầu nào.' : 'No matching requests found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
              <span>
                {language === 'VIE'
                  ? `Hiển thị 1 đến ${filteredRequests.length} trên 248 mục`
                  : `Showing 1 to ${filteredRequests.length} of 248 entries`}
              </span>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-3 py-1 border border-slate-700/60 rounded-lg bg-slate-800/50 text-slate-500 disabled:opacity-40"
                >
                  {language === 'VIE' ? 'Trước' : 'Previous'}
                </button>
                <button 
                  onClick={() => onSelectTab('requests')}
                  className="px-3 py-1 border border-slate-700/60 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  {language === 'VIE' ? 'Xem Tất Cả' : 'Next / View All'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Bento Column */}
        <div className="space-y-6 flex flex-col">
          {/* AI Automation Widget */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-lg p-5 relative overflow-hidden flex-1 backdrop-blur-md">
            <div className="absolute top-2 right-2 p-2 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[80px] text-indigo-400">memory</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-400 text-[20px]">smart_toy</span>
                    {language === 'VIE' ? 'Tự Động Hóa AI' : 'AI Automation'}
                  </h3>
                  <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs border-b border-slate-700/40 pb-2">
                    <span className="text-slate-400">Data Sync</span>
                    <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                      Success (2m ago)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-slate-700/40 pb-2">
                    <span className="text-slate-400">Size Validation</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                      Running...
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Inventory Check</span>
                    <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                      Success (1hr ago)
                    </span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => onSelectTab('ailogs')}
                className="bg-slate-900/80 border border-slate-700/50 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-indigo-400 text-[20px]">insights</span>
                <div className="text-xs text-slate-300">
                  {language === 'VIE' ? 'Độ chính xác mô hình:' : 'Overall confidence score:'}{' '}
                  <strong className="text-white font-bold">98.5%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Department Volume Widget */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl shadow-lg p-5 flex-1 backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-4">
              {language === 'VIE' ? 'Tỷ Lệ Theo Bộ Phận' : 'Volume by Dept'}
            </h3>
            <div className="space-y-3.5">
              {stats.deptVolume.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-slate-200">{item.dept}</span>
                    <span className="text-slate-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900/80 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        idx === 0
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                          : idx === 1
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : idx === 2
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
