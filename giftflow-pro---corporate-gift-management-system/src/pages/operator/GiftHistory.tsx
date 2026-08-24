import React, { useEffect, useState } from 'react';
import { Calendar, CalendarDays, CheckCircle2, ChevronRight, Gift, Sparkles, RefreshCw } from 'lucide-react';
import { ActiveRegistration, GiftHistoryRecord } from '../../types';
import giftService from '../../services/giftService';

interface GiftHistoryProps {
  onChangeGiftClick: () => void;
  onSelectEvent?: (eventId: string) => void;
}

export const GiftHistory: React.FC<GiftHistoryProps> = ({ onChangeGiftClick }) => {
  const [activeGift, setActiveGift] = useState<ActiveRegistration | null>(null);
  const [history, setHistory] = useState<GiftHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [activeData, historyData] = await Promise.all([
        giftService.getActiveRegistration(),
        giftService.getGiftHistory(),
      ]);
      setActiveGift(activeData);
      setHistory(historyData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-10 py-6 md:py-10">
      {/* Page Header */}
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30] tracking-tight mb-1">
          Lịch Sử Quà Tặng
        </h1>
        <p className="text-sm md:text-base text-[#424752]">
          Quản lý các phần quà đã đăng ký và lịch sử nhận quà của bạn.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Registered Gift (Active Item Card - Screen 1) */}
        <section className="lg:col-span-12 bg-white rounded-2xl border border-[#c2c6d4]/40 p-5 md:p-8 soft-shadow relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] to-white opacity-60 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
              <div>
                <span className="inline-block bg-[#d7e2ff] text-[#001a40] font-semibold text-xs px-3.5 py-1 rounded-full mb-2">
                  {activeGift?.statusBadge || 'Đang Đăng Ký'}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-[#0b1c30]">
                  {activeGift?.eventTitle || 'Kỷ Niệm Thành Lập Công Ty 15 Năm'}
                </h2>
              </div>

              <button
                onClick={onChangeGiftClick}
                className="bg-[#003f87] hover:bg-[#0056b3] text-white font-semibold text-sm py-2.5 px-6 rounded-xl transition-all flex items-center justify-center min-h-[44px] md:min-h-0 w-full md:w-auto shadow-sm active:scale-95 duration-100"
              >
                Thay đổi
              </button>
            </div>

            {/* Inner Gift Card Showcase */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center bg-white border border-[#c2c6d4]/40 rounded-xl p-4 md:p-6 shadow-xs">
              <div className="w-full md:w-44 h-40 rounded-xl bg-[#d3e4fe] flex-shrink-0 overflow-hidden relative shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  alt={activeGift?.giftTitle || 'Corporate Gift Box'}
                  src={
                    activeGift?.giftImageUrl ||
                    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'
                  }
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg md:text-xl font-bold text-[#0b1c30]">
                    {activeGift?.giftTitle || 'Set Quà Cao Cấp "Thịnh Vượng"'}
                  </h3>
                </div>
                <p className="text-sm text-[#424752] mb-4 leading-relaxed">
                  {activeGift?.giftDescription ||
                    'Bao gồm: Sổ tay da cao cấp, bút ký mạ vàng, và bình giữ nhiệt thông minh.'}
                </p>

                <div className="flex items-center gap-2 text-[#424752] bg-[#eff4ff] py-1.5 px-3 rounded-lg w-fit text-xs font-medium border border-[#c2c6d4]/30">
                  <Calendar className="w-4 h-4 text-[#727784]" />
                  <span>Hạn chót thay đổi: {activeGift?.changeDeadline || '15/10/2023'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History List Section (Screen 1) */}
        <section className="lg:col-span-12 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl font-bold text-[#0b1c30]">Lịch Sử Nhận Quà</h3>
            <button
              onClick={loadData}
              className="text-xs text-[#003f87] hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Làm mới
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#c2c6d4]/40 rounded-xl p-4 md:p-5 flex flex-col md:flex-row justify-between md:items-center gap-3 soft-shadow hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-[#003f87] uppercase tracking-wider">
                    {item.eventName}
                  </h4>
                  <p className="text-base font-semibold text-[#0b1c30]">{item.giftName}</p>
                  {item.details && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 md:w-1/3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-[#424752]">
                    <CalendarDays className="w-4 h-4 text-[#727784]" />
                    <span>{item.date}</span>
                  </div>

                  <span className="bg-[#d1fae5] text-[#065f46] text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GiftHistory;
