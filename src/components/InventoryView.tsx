import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface InventoryViewProps {
  inventory: InventoryItem[];
  language: 'VIE' | 'ENG';
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, language }) => {
  const [filterType, setFilterType] = useState('all');

  const filtered = inventory.filter(
    (item) => filterType === 'all' || item.uniformType.toLowerCase().includes(filterType.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {language === 'VIE' ? 'Quản Lý Kho Đồng Phục' : 'Uniform Inventory Management'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'VIE'
              ? 'Theo dõi số lượng tồn kho, định mức phân bổ và cảnh báo sắp hết.'
              : 'Monitor stock levels, allocation reserves, and critical thresholds.'}
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-3 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="all">{language === 'VIE' ? 'Tất cả loại' : 'All Types'}</option>
            <option value="ghile">Ghile</option>
            <option value="polo">Polo Shirt</option>
            <option value="coverall">Coverall</option>
            <option value="jacket">Jacket</option>
          </select>
          <button
            onClick={() => alert(language === 'VIE' ? 'Đã gửi đề xuất nhập kho!' : 'Restock request initiated!')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            {language === 'VIE' ? 'Nhập Tồn Kho' : 'Restock Item'}
          </button>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-700/60">
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase">ID</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase">
                {language === 'VIE' ? 'LOẠI' : 'UNIFORM TYPE'}
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase">
                {language === 'VIE' ? 'KÍCH CỠ' : 'SIZE'}
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase text-right">
                {language === 'VIE' ? 'TỒN KHO' : 'IN STOCK'}
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase text-right">
                {language === 'VIE' ? 'ĐÃ PHÂN BỔ' : 'ALLOCATED'}
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase">
                {language === 'VIE' ? 'TRẠNG THÁI' : 'STATUS'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-slate-400">{item.id}</td>
                <td className="px-4 py-3 font-bold text-white">{item.uniformType}</td>
                <td className="px-4 py-3 font-semibold text-slate-200">{item.size}</td>
                <td className="px-4 py-3 text-right font-bold text-indigo-400">{item.inStock}</td>
                <td className="px-4 py-3 text-right font-medium text-slate-400">{item.allocated}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.status === 'In Stock'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
