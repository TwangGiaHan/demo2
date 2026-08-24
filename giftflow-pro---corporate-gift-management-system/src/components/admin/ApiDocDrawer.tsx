import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code2, Copy, Check, Server, ShieldCheck, Database, FileText } from 'lucide-react';
import { ENDPOINTS, API_BASE_URL } from '../../services/endpoint';

interface ApiDocDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocDrawer: React.FC<ApiDocDrawerProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<'events' | 'registrations' | 'operator' | 'inventory'>('events');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const modules = [
    {
      id: 'events' as const,
      name: 'Event Management (Admin)',
      endpoints: [
        {
          name: 'List Events & Campaigns',
          method: 'GET',
          path: ENDPOINTS.EVENTS.LIST,
          desc: 'Lấy danh sách các chiến dịch quà tặng, hỗ trợ lọc theo search query, trạng thái (Active, Draft, Completed) và phân trang.',
          params: 'search?: string, status?: "Active" | "Draft" | "Completed", page?: number, pageSize?: number',
          response: `{\n  "success": true,\n  "code": 200,\n  "data": [\n    {\n      "id": "evt-001",\n      "code": "EVT-2023-09A",\n      "title": "Q3 Global Tech Conference Swag",\n      "startDate": "2023-10-15",\n      "endDate": "2023-10-18",\n      "status": "Active",\n      "targetCount": 1250,\n      "registeredCount": 985\n    }\n  ]\n}`,
        },
        {
          name: 'Dashboard Metrics',
          method: 'GET',
          path: ENDPOINTS.EVENTS.METRICS,
          desc: 'Thống kê tổng quan số lượng sự kiện đang chạy, tổng quà đã nhận, tỷ lệ hoàn tất và yêu cầu chờ duyệt.',
          response: `{\n  "activeEvents": 12,\n  "activeEventsChange": "+2 from last month",\n  "totalGiftsClaimed": 4592,\n  "completionRate": "87% completion rate",\n  "pendingApprovals": 5\n}`,
        },
        {
          name: 'Create New Event',
          method: 'POST',
          path: ENDPOINTS.EVENTS.CREATE,
          desc: 'Tạo chiến dịch quà tặng mới với đối tượng áp dụng (segment filter/upload file), banner và cấu hình gửi email tự động.',
          body: `{\n  "title": "Q3 Sales Kickoff Appreciation",\n  "startDate": "2023-10-15",\n  "endDate": "2023-10-18",\n  "recipientMethod": "Segment Filter",\n  "selectedGroups": ["All Employees", "Vietnam Staff"],\n  "autoAnnouncementEmail": true,\n  "sendReminderEmails": true\n}`,
          response: `{\n  "id": "evt-1698293",\n  "code": "EVT-2023-902",\n  "status": "Active",\n  "createdAt": "2023-10-15T08:00:00Z"\n}`,
        },
      ],
    },
    {
      id: 'registrations' as const,
      name: 'Registrations & Fulfillment (Admin)',
      endpoints: [
        {
          name: 'List Event Registrations',
          method: 'GET',
          path: '/api/v1/events/:eventId/registrations',
          desc: 'Truy xuất danh sách nhân viên đăng ký theo mã sự kiện, tìm kiếm theo Tên / Mã NV / Phòng ban.',
          params: 'eventId: string, search?: string',
          response: `[\n  {\n    "empId": "EMP-1042",\n    "name": "Sarah Jenkins",\n    "department": "Engineering",\n    "giftChoiceName": "Premium Backpack",\n    "status": "Received"\n  }\n]`,
        },
        {
          name: 'Update Handout / Delivery Status',
          method: 'PATCH',
          path: '/api/v1/registrations/:id/status',
          desc: 'Cập nhật trạng thái trao quà cho nhân viên (Registered -> Received). Tự động ghi nhận thời gian nhận quà.',
          body: `{\n  "status": "Received",\n  "note": "Trao trực tiếp tại bàn lễ tân lầu 1"\n}`,
          response: `{\n  "id": "reg-001",\n  "status": "Received",\n  "receivedAt": "2023-10-16 14:15"\n}`,
        },
        {
          name: 'Batch Upload CSV/Excel Distribution',
          method: 'POST',
          path: '/api/v1/events/:eventId/registrations/batch-upload',
          desc: 'Tải lên file kết quả phát quà hàng loạt từ quầy phát quà hoặc đơn vị chuyển phát nhanh.',
          body: 'FormData: { file: .xlsx / .csv }',
          response: `{\n  "totalImported": 450,\n  "successCount": 448,\n  "errors": []\n}`,
        },
      ],
    },
    {
      id: 'operator' as const,
      name: 'Operator / Employee Portal',
      endpoints: [
        {
          name: 'Get Active Registration',
          method: 'GET',
          path: ENDPOINTS.OPERATOR_GIFTS.GET_ACTIVE_REGISTRATION,
          desc: 'Lấy thông tin phần quà người dùng hiện đang đăng ký trong sự kiện đang mở.',
          response: `{\n  "eventId": "evt-15yrs",\n  "eventTitle": "Kỷ Niệm Thành Lập Công Ty 15 Năm",\n  "statusBadge": "Đang Đăng Ký",\n  "giftTitle": "Set Quà Cao Cấp Thịnh Vượng",\n  "changeDeadline": "15/10/2023"\n}`,
        },
        {
          name: 'Get Gift History',
          method: 'GET',
          path: ENDPOINTS.OPERATOR_GIFTS.GET_HISTORY,
          desc: 'Xem lịch sử toàn bộ các đợt nhận quà trong quá khứ của nhân viên (Tết, Trung Thu, 8/3, v.v.).',
          response: `[\n  {\n    "id": "hist-001",\n    "eventName": "Tết Nguyên Đán 2023",\n    "giftName": "Giỏ Quà Tết An Khang",\n    "date": "15/01/2023",\n    "status": "Đã nhận"\n  }\n]`,
        },
        {
          name: 'Submit Gift Registration',
          method: 'POST',
          path: ENDPOINTS.OPERATOR_GIFTS.SUBMIT_REGISTRATION,
          desc: 'Nhân viên chọn 1 trong các tùy chọn quà (Gift A, Gift B, Gift C) và xác nhận đăng ký nhận quà.',
          body: `{\n  "eventId": "evt-005",\n  "giftChoiceId": "g-tet-a",\n  "giftTitle": "Gift A: Premium Hamper",\n  "deliveryAddress": "Tầng 12 Bitexco"\n}`,
          response: `{\n  "success": true,\n  "registrationId": "REG-2024-8841",\n  "message": "Đăng ký quà tặng thành công!"\n}`,
        },
      ],
    },
    {
      id: 'inventory' as const,
      name: 'Inventory & Stock Management',
      endpoints: [
        {
          name: 'Get Inventory Stock',
          method: 'GET',
          path: ENDPOINTS.INVENTORY.LIST,
          desc: 'Danh mục vật tư quà tặng, số lượng tổng tồn kho, số lượng đã phân bổ và số lượng còn lại.',
          response: `[\n  {\n    "code": "SKU-BP-01",\n    "name": "Balo Premium Backpack",\n    "totalStock": 800,\n    "allocated": 500,\n    "available": 300,\n    "status": "In Stock"\n  }\n]`,
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-gray-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 bg-[#eff4ff] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#003f87] text-white rounded-lg">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#003f87]">Backend API Endpoints Spec</h2>
                  <p className="text-xs text-[#424752]">API Contracts, REST Payloads & Integration Notes</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-bar / Modules Tab */}
            <div className="flex border-b border-gray-200 px-4 pt-2 gap-2 bg-gray-50/80 overflow-x-auto">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                    activeModule === m.id
                      ? 'border-[#003f87] text-[#003f87]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <p className="font-semibold mb-0.5">Integration Guidelines for Backend Service:</p>
                Toàn bộ service code tại <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/src/services/request.ts</code> và <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/src/services/endpoint.ts</code> đã được mô đun hóa chuẩn RESTful. Bạn có thể bật <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_USE_LIVE_API=true</code> trong file <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> để chuyển trực tiếp sang backend server production.
              </div>

              {modules
                .find((m) => m.id === activeModule)
                ?.endpoints.map((ep, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 bg-[#f8f9ff]/50 space-y-3 hover:border-[#003f87]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md font-mono ${
                            ep.method === 'GET'
                              ? 'bg-blue-100 text-blue-800'
                              : ep.method === 'POST'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ep.method === 'PATCH'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="text-xs font-mono font-semibold text-gray-800 break-all">
                          {ep.path}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(ep.path, `${activeModule}-${idx}`)}
                        className="text-gray-400 hover:text-[#003f87] transition-colors p-1"
                        title="Copy endpoint"
                      >
                        {copiedKey === `${activeModule}-${idx}` ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-700 font-medium">{ep.desc}</p>

                    {ep.params && (
                      <div className="text-[11px] bg-white border border-gray-200 p-2.5 rounded-lg">
                        <span className="font-semibold text-gray-700">Query / Path Params: </span>
                        <code className="text-[#003f87] font-mono">{ep.params}</code>
                      </div>
                    )}

                    {ep.body && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-gray-600">Request Body Schema:</span>
                        <pre className="text-[11px] font-mono bg-gray-900 text-gray-100 p-2.5 rounded-lg overflow-x-auto">
                          {ep.body}
                        </pre>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-gray-600">Sample Response (JSON):</span>
                      <pre className="text-[11px] font-mono bg-gray-900 text-emerald-400 p-2.5 rounded-lg overflow-x-auto">
                        {ep.response}
                      </pre>
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <span>Base URL: <code className="font-mono text-gray-800">{API_BASE_URL}</code></span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#003f87] text-white font-medium rounded-lg hover:bg-[#002d62] transition-colors"
              >
                Close Spec
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApiDocDrawer;
