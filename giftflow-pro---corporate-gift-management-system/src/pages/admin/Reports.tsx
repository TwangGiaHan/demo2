import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Award, DollarSign } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30]">Báo Cáo & Thống Kê Giao Vận</h1>
        <p className="text-xs md:text-sm text-[#424752] mt-0.5">Tổng hợp tỷ lệ hoàn tất chiến dịch quà tặng, độ hài lòng nhân sự.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c2c6d4]/30 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase">Tổng Chiến Dịch</p>
          <p className="text-3xl font-bold text-[#0b1c30] mt-2">15</p>
          <span className="text-xs text-emerald-600 font-semibold">+3 sự kiện năm nay</span>
        </div>

        <div className="bg-white border border-[#c2c6d4]/30 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase">Quà Đã Trao Tay</p>
          <p className="text-3xl font-bold text-[#003f87] mt-2">4,592</p>
          <span className="text-xs text-[#003f87] font-semibold">87% hoàn thành</span>
        </div>

        <div className="bg-white border border-[#c2c6d4]/30 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase">Tỷ Lệ Hài Lòng</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">98.4%</p>
          <span className="text-xs text-gray-500">Khảo sát nội bộ</span>
        </div>

        <div className="bg-white border border-[#c2c6d4]/30 rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase">Ngân Sách Đã Chi</p>
          <p className="text-2xl font-bold text-[#0b1c30] mt-2">3.45 Tỷ VNĐ</p>
          <span className="text-xs text-gray-500">Trong định mức phê duyệt</span>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
