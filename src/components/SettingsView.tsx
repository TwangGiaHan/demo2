import React, { useState } from 'react';

interface SettingsViewProps {
  language: 'VIE' | 'ENG';
  onToggleLanguage: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ language, onToggleLanguage }) => {
  const [autoApprove, setAutoApprove] = useState(true);
  const [sizeWarningThreshold, setSizeWarningThreshold] = useState('85');
  const [warehouseLocation, setWarehouseLocation] = useState('GA Warehouse - Terminal 1');

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {language === 'VIE' ? 'Cài Đặt Hệ Thống' : 'System Settings'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {language === 'VIE'
            ? 'Cấu hình ngôn ngữ, quy tắc phê duyệt tự động của AI và địa điểm kho.'
            : 'Configure language, AI policy parameters, and pickup warehouse routing.'}
        </p>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-lg backdrop-blur-md space-y-6">
        {/* Language Preferences */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
          <div>
            <h3 className="text-sm font-bold text-white">
              {language === 'VIE' ? 'Ngôn Ngữ Giao Diện' : 'Interface Language'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'VIE' ? 'Chuyển đổi giữa tiếng Việt và tiếng Anh' : 'Switch between Vietnamese and English'}
            </p>
          </div>
          <button
            onClick={onToggleLanguage}
            className="px-4 py-2 bg-slate-900/80 border border-slate-700/60 rounded-xl font-bold text-xs text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 transition-all cursor-pointer"
          >
            {language === 'VIE' ? 'Đang dùng: TIẾNG VIỆT (VIE)' : 'Current: ENGLISH (ENG)'}
          </button>
        </div>

        {/* AI Auto Approval Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
          <div>
            <h3 className="text-sm font-bold text-white">
              {language === 'VIE' ? 'Tự Động Phê Duyệt Bằng AI' : 'AI Auto-Approval Policy'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'VIE'
                ? 'Tự động duyệt yêu cầu khi kích cỡ trùng khớp định mức HRIS'
                : 'Automatically approve valid requests matching biometric size standards'}
            </p>
          </div>
          <button
            onClick={() => setAutoApprove(!autoApprove)}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              autoApprove ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                autoApprove ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        {/* Size Warning Threshold */}
        <div className="space-y-2 pb-4 border-b border-slate-700/50">
          <h3 className="text-sm font-bold text-white">
            {language === 'VIE' ? 'Ngưỡng Cảnh Báo Lệch Size AI (%)' : 'AI Size Anomaly Confidence Threshold (%)'}
          </h3>
          <input
            type="number"
            value={sizeWarningThreshold}
            onChange={(e) => setSizeWarningThreshold(e.target.value)}
            className="w-full max-w-xs h-10 px-3 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Warehouse Pickup Point */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white">
            {language === 'VIE' ? 'Địa Điểm Kho Nhận Hàng Mặc Định' : 'Default Pickup Warehouse Location'}
          </h3>
          <input
            type="text"
            value={warehouseLocation}
            onChange={(e) => setWarehouseLocation(e.target.value)}
            className="w-full max-w-md h-10 px-3 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <button
          onClick={() => alert(language === 'VIE' ? 'Cài đặt đã lưu thành công!' : 'Settings saved successfully!')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30 cursor-pointer"
        >
          {language === 'VIE' ? 'LƯU CÀI ĐẶT' : 'SAVE SETTINGS'}
        </button>
      </div>
    </div>
  );
};
