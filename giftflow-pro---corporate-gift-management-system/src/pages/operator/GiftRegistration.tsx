import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, ArrowRight, Gift, Sparkles } from 'lucide-react';
import giftService from '../../services/giftService';

interface GiftRegistrationProps {
  onBack: () => void;
  onSuccess: (giftName: string) => void;
}

export const GiftRegistration: React.FC<GiftRegistrationProps> = ({ onBack, onSuccess }) => {
  const [selectedEvent, setSelectedEvent] = useState('tet-2024');
  const [selectedGift, setSelectedGift] = useState('A');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const giftOptions = [
    {
      id: 'A',
      title: 'Gift A: Premium Hamper',
      description:
        'Giỏ quà cao cấp bao gồm rượu vang đỏ nhập khẩu, các loại hạt dinh dưỡng tổng hợp và chocolate đen nghệ thuật. Thích hợp biếu tặng đối tác chiến lược.',
    },
    {
      id: 'B',
      title: 'Gift B: Tech Set & Office',
      description:
        'Bộ quà tặng công nghệ thực dụng gồm sạc dự phòng không dây 10000mAh, tai nghe TWS chống ồn và sổ tay bìa da PU dập nổi logo công ty.',
    },
    {
      id: 'C',
      title: 'Gift C: Wellness Package',
      description:
        'Gói chăm sóc sức khỏe toàn diện với hộp yến sào tinh chế thượng hạng, đông trùng hạ thảo nguyên con và mật ong Manuka.',
    },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const chosenOption = giftOptions.find((g) => g.id === selectedGift);
    try {
      await giftService.submitGiftSelection({
        eventId: 'evt-2024-tet',
        eventTitle: 'Tet Gift 2024',
        giftChoiceId: `gift-${selectedGift}`,
        giftTitle: chosenOption?.title || 'Gift A: Premium Hamper',
        giftDescription: chosenOption?.description || '',
      });
      onSuccess(chosenOption?.title || 'Gift Choice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] antialiased flex flex-col md:max-w-xl md:mx-auto md:shadow-2xl md:border-x md:border-[#c2c6d4]/30 relative pb-32">
      {/* Transactional Header (Screen 4) */}
      <header className="h-16 flex items-center px-4 bg-white shadow-xs sticky top-0 z-40 border-b border-[#c2c6d4]/30">
        <button
          onClick={onBack}
          className="mr-3 p-1.5 -ml-1 text-[#424752] hover:text-[#003f87] active:bg-[#eff4ff] rounded-full transition-colors flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-[#0b1c30]">Đăng ký Nhận Quà</h1>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
        {/* Section: SỰ KIỆN KHẢ DỤNG */}
        <section>
          <h2 className="text-xs font-bold text-[#424752] uppercase tracking-wider mb-3">
            SỰ KIỆN KHẢ DỤNG
          </h2>
          <div className="flex flex-col gap-2.5">
            {/* Selected / Active Event Row */}
            <div
              onClick={() => setSelectedEvent('tet-2024')}
              className={`flex items-center justify-between p-4 bg-[#eff4ff] border-2 rounded-xl shadow-xs relative overflow-hidden cursor-pointer transition-all ${
                selectedEvent === 'tet-2024'
                  ? 'border-[#003f87] bg-[#eff4ff]'
                  : 'border-[#c2c6d4]/40 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 z-10">
                <div className="w-5 h-5 rounded-full border-2 border-[#003f87] flex items-center justify-center bg-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#003f87]"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#003f87]">Tet Gift 2024</h3>
                  <p className="text-xs text-[#424752] mt-0.5">Hạn chót đăng ký: 15/01/2024</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#003f87] z-10" />
            </div>

            {/* Locked / Future Event Row */}
            <div className="flex items-center justify-between p-4 bg-white border border-[#c2c6d4]/50 rounded-xl opacity-50 select-none">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#c2c6d4] flex items-center justify-center"></div>
                <div>
                  <h3 className="text-sm font-bold text-[#0b1c30]">Q1 Performance Bonus</h3>
                  <p className="text-xs text-[#424752] mt-0.5">Chưa mở cổng đăng ký</p>
                </div>
              </div>
              <Lock className="w-4 h-4 text-[#727784]" />
            </div>
          </div>
        </section>

        {/* Section: TÙY CHỌN QUÀ TẶNG */}
        <section>
          <div className="flex items-center justify-between mb-3 mt-2">
            <h2 className="text-xs font-bold text-[#424752] uppercase tracking-wider">
              TÙY CHỌN QUÀ TẶNG
            </h2>
            <span className="text-xs font-semibold bg-[#dce9ff] text-[#003f87] px-2.5 py-0.5 rounded-full border border-[#c2c6d4]/30">
              Chọn 1
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {giftOptions.map((gift) => {
              const isChecked = selectedGift === gift.id;
              return (
                <label
                  key={gift.id}
                  onClick={() => setSelectedGift(gift.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer group ${
                    isChecked
                      ? 'border-[#003f87] bg-[#eff4ff] shadow-xs'
                      : 'border-[#c2c6d4]/50 bg-white hover:border-[#003f87]/50'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'border-[#003f87] bg-[#003f87]'
                          : 'border-[#c2c6d4] bg-white group-hover:border-[#003f87]'
                      }`}
                    >
                      {isChecked && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-sm font-bold transition-colors ${
                        isChecked ? 'text-[#003f87]' : 'text-[#0b1c30] group-hover:text-[#003f87]'
                      }`}
                    >
                      {gift.title}
                    </h3>
                    <p className="text-xs text-[#424752] mt-1 leading-relaxed">
                      {gift.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      </main>

      {/* Fixed Bottom Action Area (Screen 4) */}
      <div className="fixed bottom-0 left-0 w-full md:max-w-xl md:left-auto p-4 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] border-t border-[#c2c6d4]/30 z-50">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full h-12 bg-[#003f87] text-white font-semibold text-sm rounded-full shadow-[0_4px_16px_rgba(0,63,135,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-[#002d62] disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Đang ghi nhận...' : 'Xác nhận Đăng ký'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GiftRegistration;
