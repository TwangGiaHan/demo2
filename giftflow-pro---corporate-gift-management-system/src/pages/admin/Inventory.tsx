import React, { useEffect, useState } from 'react';
import { Package, Search, Plus, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { InventoryItem } from '../../types';
import inventoryService from '../../services/inventoryService';

export const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    inventoryService.getInventory({ search }).then(setItems);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30]">Quản Lý Kho Quà & Vật Tư</h1>
          <p className="text-xs md:text-sm text-[#424752] mt-0.5">Theo dõi tồn kho quà tặng doanh nghiệp và kế hoạch mua sắm.</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#c2c6d4]/30 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#c2c6d4]/30 flex justify-between items-center bg-white">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo SKU hoặc tên quà..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f8f9ff] rounded-xl border border-[#c2c6d4]/50 text-xs focus:ring-2 focus:ring-[#003f87] outline-none"
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">{items.length} mặt hàng</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8f9ff] text-[#424752] font-bold uppercase tracking-wider border-b border-[#c2c6d4]/30">
                <th className="py-3 px-5">Mã SKU & Sản Phẩm</th>
                <th className="py-3 px-5">Danh Mục</th>
                <th className="py-3 px-5">Tổng Nhập</th>
                <th className="py-3 px-5">Đã Phân Bổ</th>
                <th className="py-3 px-5">Khả Dụng</th>
                <th className="py-3 px-5">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      {it.imageUrl && (
                        <img src={it.imageUrl} alt={it.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                      )}
                      <div>
                        <p className="font-bold text-[#0b1c30] text-sm">{it.name}</p>
                        <p className="font-mono text-gray-400 text-[11px]">{it.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-gray-600">{it.category}</td>
                  <td className="py-4 px-5 font-semibold text-gray-800">{it.totalStock.toLocaleString()}</td>
                  <td className="py-4 px-5 text-[#003f87] font-semibold">{it.allocated.toLocaleString()}</td>
                  <td className="py-4 px-5 font-bold text-emerald-700">{it.available.toLocaleString()}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                        it.status === 'In Stock'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {it.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
