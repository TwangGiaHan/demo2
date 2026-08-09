import React, { useState } from 'react';
import { UniformRequest } from '../types';

interface RequestStatusViewProps {
  requests: UniformRequest[];
  selectedRequestId?: string;
  onConfirmReceived: (reqId: string) => void;
  language: 'VIE' | 'ENG';
}

export const RequestStatusView: React.FC<RequestStatusViewProps> = ({
  requests,
  selectedRequestId,
  onConfirmReceived,
  language,
}) => {
  // Find current request or default to REQ-8492A / first available
  const activeReq =
    requests.find(
      (r) =>
        r.id === selectedRequestId ||
        r.orderNumber === selectedRequestId ||
        r.orderNumber === '#REQ-8492A'
    ) ||
    requests[0] || {
      id: 'RQ-2023-0892',
      orderNumber: '#REQ-8492A',
      employeeName: 'Nguyen Van A',
      status: 'Ready',
      createdAt: 'Oct 24, 09:41 AM',
      pickupLocation: 'GA Warehouse',
      pickupTime: 'Thursday, 08:00 - 16:00',
      returnRequired: true,
      returnReason: 'Replace',
      collectedByWarehouse: false,
      confirmedReceived: false,
    };

  const [currentOrder, setCurrentOrder] = useState<UniformRequest>(activeReq);
  const [isWarehouseCollected, setIsWarehouseCollected] = useState(
    currentOrder.collectedByWarehouse || false
  );

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = requests.find((r) => r.id === e.target.value);
    if (found) {
      setCurrentOrder(found);
      setIsWarehouseCollected(found.collectedByWarehouse || false);
    }
  };

  const handleConfirm = () => {
    onConfirmReceived(currentOrder.id);
    setCurrentOrder((prev) => ({
      ...prev,
      status: 'Delivered',
      confirmedReceived: true,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Top Header & Order Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {language === 'VIE' ? 'Trạng Thái Yêu Cầu' : 'Request Status'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'VIE'
              ? 'Theo dõi đơn hàng đồng phục và xem hướng dẫn nhận hàng.'
              : 'Track your uniform request and view delivery instructions.'}
          </p>
        </div>

        {/* Order Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 px-3 py-1.5 rounded-xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400">
            {language === 'VIE' ? 'Chọn Đơn Hàng:' : 'Select Order:'}
          </span>
          <select
            value={currentOrder.id}
            onChange={handleOrderChange}
            className="bg-transparent text-xs font-bold text-indigo-400 outline-none cursor-pointer"
          >
            {requests.map((r) => (
              <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                {r.orderNumber || r.id} - {r.employeeName} ({r.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Status Stepper Card (8 Cols) */}
        <div className="md:col-span-8 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-6 shadow-lg backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Order {currentOrder.orderNumber || currentOrder.id}
            </h2>
            <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {currentOrder.status}
            </span>
          </div>

          <div className="relative pl-2">
            {/* Vertical Line */}
            <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-slate-700/60"></div>
            <div
              className={`absolute left-[22px] top-6 w-0.5 bg-indigo-500 transition-all duration-500 ${
                currentOrder.status === 'Delivered'
                  ? 'h-full'
                  : currentOrder.status === 'Ready'
                  ? 'h-2/3'
                  : 'h-1/3'
              }`}
            ></div>

            {/* Step 1: Submitted */}
            <div className="flex gap-4 items-start relative mb-8">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center z-10 shrink-0 shadow-md shadow-indigo-500/25 border border-indigo-400/30">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <div className="pt-0.5">
                <p className="text-xs font-bold text-white">
                  {language === 'VIE' ? 'Đã Gửi Yêu Cầu' : 'Submitted'}
                </p>
                <p className="text-xs text-slate-400">
                  {currentOrder.timeline?.submittedAt || currentOrder.createdAt}
                </p>
              </div>
            </div>

            {/* Step 2: Approved */}
            <div className="flex gap-4 items-start relative mb-8">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                  currentOrder.status !== 'Validating'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/30'
                    : 'border-2 border-indigo-500 bg-slate-900 text-indigo-400'
                }`}
              >
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <div className="pt-0.5">
                <p className="text-xs font-bold text-white">
                  {language === 'VIE' ? 'Đã Phê Duyệt' : 'Approved'}
                </p>
                <p className="text-xs text-slate-400">
                  {currentOrder.timeline?.approvedAt || 'Oct 24, 11:30 AM'}
                </p>
                <p className="text-xs text-indigo-400 font-medium mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  {currentOrder.aiNote || 'Auto-approved by AI Policy Engine'}
                </p>
              </div>
            </div>

            {/* Step 3: Ready for Pickup */}
            <div className="flex gap-4 items-start relative mb-8">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                  currentOrder.status === 'Ready' || currentOrder.status === 'Delivered'
                    ? 'border-2 border-indigo-500 bg-slate-900 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]'
                    : 'border-2 border-slate-700 bg-slate-900 text-slate-500'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentOrder.status === 'Ready' || currentOrder.status === 'Delivered'
                      ? 'bg-indigo-400'
                      : 'bg-transparent'
                  }`}
                ></div>
              </div>
              <div className="pt-0.5">
                <p className="text-xs font-bold text-white">
                  {language === 'VIE' ? 'Sẵn Sàng Nhận Hàng' : 'Ready for Pickup'}
                </p>
                <p className="text-xs text-slate-400">
                  {currentOrder.status === 'Ready' || currentOrder.status === 'Delivered'
                    ? language === 'VIE'
                      ? 'Đang chờ nhân viên đến nhận'
                      : 'Awaiting collection'
                    : 'Pending warehouse sorting'}
                </p>
              </div>
            </div>

            {/* Step 4: Delivered */}
            <div className="flex gap-4 items-start relative">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 shrink-0 ${
                  currentOrder.status === 'Delivered'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'border-slate-700 bg-slate-900 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-sm">inventory</span>
              </div>
              <div className="pt-0.5">
                <p
                  className={`text-xs font-bold ${
                    currentOrder.status === 'Delivered' ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {language === 'VIE' ? 'Đã Nhận Đồng Phục' : 'Delivered'}
                </p>
                <p className="text-xs text-slate-500">
                  {currentOrder.status === 'Delivered'
                    ? language === 'VIE'
                      ? 'Xác nhận hoàn tất'
                      : 'Confirmed received'
                    : language === 'VIE'
                    ? 'Chờ xác nhận từ nhân viên'
                    : 'Pending confirmation'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel Details (4 Cols) */}
        <div className="md:col-span-4 flex flex-col gap-5">
          {/* Pickup Instructions Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-3 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {language === 'VIE' ? 'HƯỚNG DẪN NHẬN HÀNG' : 'PICKUP INSTRUCTIONS'}
              </h3>
            </div>
            <p className="text-sm text-slate-200">
              {language === 'VIE' ? 'Nhận hàng vào' : 'Pick up on'}{' '}
              <strong className="font-bold text-white">Thursday</strong> {language === 'VIE' ? 'tại' : 'at'}{' '}
              <strong className="font-bold text-white">
                {currentOrder.pickupLocation || 'GA Warehouse'}
              </strong>
              .
            </p>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400">
                {language === 'VIE'
                  ? 'Xuất trình thẻ nhân viên tại Cổng 4 từ 08:00 - 16:00.'
                  : 'Present your employee badge at Door 4 between 08:00 - 16:00.'}
              </p>
            </div>
          </div>

          {/* Return Instructions Card */}
          {currentOrder.returnRequired && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col gap-3 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="material-symbols-outlined text-[20px]">loop</span>
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {language === 'VIE' ? 'YÊU CẦU TRẢ ĐỒNG PHỤC CŨ' : 'RETURN REQUIRED'}
                </h3>
              </div>
              <p className="text-xs font-semibold text-amber-300">
                {language === 'VIE' ? 'Lý do:' : 'Reason:'}{' '}
                {currentOrder.returnReason || 'Replace'}
              </p>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                {language === 'VIE'
                  ? 'Vui lòng bỏ đồng phục cũ vào Hộp Tiếp Nhận cạnh bàn bảo vệ chính trong vòng 5 ngày làm việc.'
                  : 'Please deposit your old uniform in the designated Post Box located next to the main security desk within 5 business days of receiving your new items.'}
              </p>
            </div>
          )}

          {/* Simulation Toggle for Warehouse Staff */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {language === 'VIE' ? 'Giả lập Quản Kho đã phát:' : 'Warehouse Issued Toggle:'}
            </span>
            <button
              onClick={() => setIsWarehouseCollected(!isWarehouseCollected)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                isWarehouseCollected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 border border-slate-700 text-slate-300'
              }`}
            >
              {isWarehouseCollected ? 'Collected' : 'Mark Collected'}
            </button>
          </div>

          {/* Action Button */}
          <div className="space-y-2">
            <button
              disabled={!isWarehouseCollected || currentOrder.status === 'Delivered'}
              onClick={handleConfirm}
              className={`w-full py-3.5 px-4 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md ${
                isWarehouseCollected && currentOrder.status !== 'Delivered'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer active:scale-95 shadow-indigo-500/25 border border-indigo-400/30'
                  : 'bg-slate-800 text-slate-500 opacity-70 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              {currentOrder.status === 'Delivered'
                ? language === 'VIE'
                  ? 'ĐÃ XÁC NHẬN HOÀN TẤT'
                  : 'DELIVERY CONFIRMED'
                : language === 'VIE'
                ? 'XÁC NHẬN ĐÃ NHẬN HÀNG'
                : 'CONFIRM RECEIVED'}
            </button>
            <p className="text-[11px] text-center text-slate-500">
              {language === 'VIE'
                ? 'Nút sẽ kích hoạt khi quản kho đánh dấu đã bàn giao đồng phục.'
                : 'Button will activate once items are marked collected by warehouse staff.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
