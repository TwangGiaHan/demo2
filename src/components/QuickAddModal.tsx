import React, { useState } from 'react';
import { UniformRequest, UniformType, DepartmentType, ReasonType } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (req: Partial<UniformRequest>) => void;
  language: 'VIE' | 'ENG';
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language,
}) => {
  const [genId, setGenId] = useState('G-89421');
  const [employeeName, setEmployeeName] = useState('Nguyen Van A');
  const [department, setDepartment] = useState<DepartmentType>('Operations');
  const [uniformType, setUniformType] = useState<UniformType>('Ghile');
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(2);
  const [reason, setReason] = useState<ReasonType>('New Hire Allocation');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      genId,
      employeeName,
      department,
      uniformType,
      size,
      quantity,
      reason,
      aiSuggested: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/40">
          <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined text-indigo-400">add_circle</span>
            {language === 'VIE' ? 'Tạo Yêu Cầu Cấp Phát Nhanh' : 'Quick Add Uniform Request'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">GEN ID</label>
              <input
                type="text"
                value={genId}
                onChange={(e) => setGenId(e.target.value)}
                required
                className="w-full h-10 px-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white font-mono font-bold outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Họ và tên' : 'Employee Name'}
              </label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
                className="w-full h-10 px-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Bộ phận' : 'Department'}
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentType)}
                className="w-full h-10 px-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Operations">Operations</option>
                <option value="Logistics">Logistics</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Security">Security</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Loại đồng phục' : 'Uniform Type'}
              </label>
              <select
                value={uniformType}
                onChange={(e) => setUniformType(e.target.value as UniformType)}
                className="w-full h-10 px-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Ghile">Ghile</option>
                <option value="Polo Shirt">Polo Shirt</option>
                <option value="Coverall">Coverall</option>
                <option value="Jacket">Jacket</option>
                <option value="Cargo Pants">Cargo Pants</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Kích cỡ' : 'Size'}
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full h-10 px-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 outline-none focus:border-indigo-500 transition-all"
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Số lượng' : 'Quantity'}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-10 px-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Lý do' : 'Reason'}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReasonType)}
                className="w-full h-10 px-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all"
              >
                <option value="New Hire Allocation">New Hire Allocation</option>
                <option value="Annual Replacement">Annual Replacement</option>
                <option value="Damaged Uniform">Damaged Uniform</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-all cursor-pointer"
            >
              {language === 'VIE' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/25 border border-indigo-400/30 cursor-pointer"
            >
              {language === 'VIE' ? 'Tạo Yêu Cầu' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
