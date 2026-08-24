import React from 'react';
import { Bell, CheckCircle2, Gift, Clock, AlertCircle } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: '1',
      title: 'Đăng ký quà tặng Tet Gift 2024 sắp hết hạn',
      desc: 'Cổng chọn quà Tết sẽ đóng vào 23:59 ngày 15/01/2024. Vui lòng kiểm tra lại lựa chọn quà của bạn.',
      time: '2 giờ trước',
      type: 'reminder',
      isUnread: true,
    },
    {
      id: '2',
      title: 'Đã tiếp nhận yêu cầu đổi Set Quà Thịnh Vượng',
      desc: 'Bộ phận Logistics đã xác nhận đơn đăng ký quà Kỷ niệm 15 năm của bạn.',
      time: '1 ngày trước',
      type: 'success',
      isUnread: true,
    },
    {
      id: '3',
      title: 'Thông báo nhận quà Quốc Tế Phụ Nữ 8/3',
      desc: 'Phần quà Set Spa đã được bàn giao thành công tại sảnh chính.',
      time: '15/03/2023',
      type: 'info',
      isUnread: false,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#0b1c30]">Thông Báo</h1>
        <p className="text-sm text-[#424752]">Cập nhật trạng thái và tin tức sự kiện quà tặng của bạn.</p>
      </header>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition-all ${
              n.isUnread
                ? 'bg-white border-[#003f87]/30 shadow-xs'
                : 'bg-white/60 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#eff4ff] text-[#003f87] mt-0.5">
                {n.type === 'reminder' ? <Clock className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0b1c30]">{n.title}</h3>
                  <span className="text-[11px] text-gray-400">{n.time}</span>
                </div>
                <p className="text-xs text-[#424752] mt-1 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
