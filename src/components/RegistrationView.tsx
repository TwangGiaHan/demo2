import React, { useState, useEffect } from 'react';
import { UniformType, CategoryType, ReasonType, UniformRequest } from '../types';

interface RegistrationViewProps {
  onRegisterSubmit: (data: Partial<UniformRequest>) => void;
  onOpenSizeChart: () => void;
  language: 'VIE' | 'ENG';
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  onRegisterSubmit,
  onOpenSizeChart,
  language,
}) => {
  // Form State
  const [genId, setGenId] = useState('G-89421');
  const [employeeName, setEmployeeName] = useState('Nguyen Van A');
  const [department, setDepartment] = useState('Logistics');
  const [costCenter, setCostCenter] = useState('CC-8942-VN');
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const [uniformType, setUniformType] = useState<UniformType>('Ghile');
  const [category, setCategory] = useState<CategoryType>('Operations - Field');
  const [printName, setPrintName] = useState('');
  const [size, setSize] = useState('M');
  const [reason, setReason] = useState<ReasonType>('New Hire Allocation');
  const [damagedImage, setDamagedImage] = useState<File | null>(null);
  const [damagedImagePreview, setDamagedImagePreview] = useState<string | null>(null);

  // Dependent Options
  const categoriesData: Record<string, CategoryType[]> = {
    Ghile: ['Operations - Field', 'Warehouse'],
    'Polo Shirt': ['Operations - Field', 'Warehouse', 'Office'],
    'T-Shirt (Male)': ['Operations - Field', 'Warehouse', 'Office'],
    'T-Shirt (Female)': ['Operations - Field', 'Warehouse', 'Office'],
    Jacket: ['Operations - Field', 'Cold Storage', 'Security'],
    Coverall: ['Maintenance', 'Warehouse'],
    'Cargo Pants': ['Operations - Field', 'Warehouse'],
    Pregnant: ['All Categories'],
  };

  const sizesData: Record<string, string[]> = {
    Pregnant: ['Mat S', 'Mat M', 'Mat L'],
    default: ['S', 'M', 'L', 'XL'],
  };

  const activeSizes = uniformType === 'Pregnant' ? sizesData['Pregnant'] : sizesData['default'];

  // Update dependent category and size when uniformType changes
  useEffect(() => {
    const availableCats = categoriesData[uniformType] || categoriesData['Ghile'];
    if (!availableCats.includes(category)) {
      setCategory(availableCats[0]);
    }
    const currentActiveSizes = uniformType === 'Pregnant' ? sizesData['Pregnant'] : sizesData['default'];
    if (!currentActiveSizes.includes(size)) {
      setSize(currentActiveSizes[1] || currentActiveSizes[0]);
    }
  }, [uniformType]);

  // Employee Lookup Handler
  const handleLookup = async () => {
    if (!genId.trim()) return;
    setIsLookupLoading(true);
    try {
      const res = await fetch(`/api/employees/lookup/${genId}`);
      if (res.ok) {
        const emp = await res.json();
        setEmployeeName(emp.name);
        setDepartment(emp.department || 'Logistics');
        setCostCenter(emp.costCenter || 'CC-8942-VN');
        if (emp.recommendedSize) {
          setSize(emp.recommendedSize);
        }
      }
    } catch (e) {
      console.error('Lookup failed:', e);
    } finally {
      setIsLookupLoading(false);
    }
  };

  // Image Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDamagedImage(file);
      setDamagedImagePreview(URL.createObjectURL(file));
    }
  };

  // Allocation calculation
  let quantity = 1;
  if (reason === 'New Hire Allocation') {
    quantity = uniformType === 'Ghile' ? 2 : uniformType.includes('T-Shirt') ? 3 : 2;
  } else if (reason === 'Maternity') {
    quantity = 2;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason === 'Damaged Uniform' && !damagedImage) {
      alert(
        language === 'VIE'
          ? 'Vui lòng tải lên ảnh đồng phục bị hỏng!'
          : 'Please upload an image of the damaged uniform!'
      );
      return;
    }

    onRegisterSubmit({
      genId,
      employeeName,
      department: department as any,
      costCenter,
      uniformType,
      category,
      printName,
      size,
      reason,
      quantity,
      aiSuggested: true,
      damagedImageUrl: damagedImagePreview || undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Reference Materials Carousel Section */}
      <section>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {language === 'VIE' ? 'TÀI LIỆU THAM KHẢO' : 'REFERENCE MATERIALS'}
        </h4>
        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2">
          {/* Card 1: Ghile Specs */}
          <div className="min-w-[240px] bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg flex flex-col hover:border-slate-600 transition-all backdrop-blur-md">
            <div
              className="h-32 bg-cover bg-center border-b border-slate-700/50"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCAwaCTpNpsFtQQd1f5TYlm2zrCSsg3efKSldps69wm6-xgKAS7xfRppUFYMETl9aSFqnWrs2FqQncGvJIq8-DvBh6Cy3A2KYyn7HHCeO9nvJu06aBfkRoljhe5XpyowDbAtfBRTc9Cap-dDa4fPZgVA2JQtZzRu-QIqW2HsY0X3Jgr8MEL1wtKt5H2CPmYVKpLlucVa1G6wInV5SZYvlRPhvHYCmtr8dMCjVpNhKS-EuzLHdtO2pZj')`,
              }}
            ></div>
            <div className="p-3">
              <h5 className="font-semibold text-xs text-white">Ghile Specs</h5>
              <p className="text-xs text-slate-400">Material: Poly-Blend High Vis</p>
            </div>
          </div>

          {/* Card 2: Size Chart */}
          <div
            onClick={onOpenSizeChart}
            className="min-w-[240px] bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg flex flex-col hover:border-slate-600 transition-all cursor-pointer group backdrop-blur-md"
          >
            <div className="h-32 bg-slate-900/80 flex items-center justify-center border-b border-slate-700/50 group-hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-4xl text-indigo-400">straighten</span>
            </div>
            <div className="p-3">
              <h5 className="font-semibold text-xs text-white">
                {language === 'VIE' ? 'Bảng Kích Cỡ Đồng Phục' : 'Size Chart (Men & Women)'}
              </h5>
              <p className="text-xs text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                {language === 'VIE' ? 'Xem Thông Số' : 'View Measurements'}
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Page Title */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {language === 'VIE' ? 'Đăng Ký Cấp Phát Đồng Phục' : 'Uniform Registration'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {language === 'VIE'
            ? 'Hoàn thành biểu mẫu bên dưới để gửi yêu cầu cấp phát đồng phục mới.'
            : 'Complete the form below to request a new uniform allocation.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Employee Details */}
        <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400">badge</span>
            {language === 'VIE' ? 'Thông Tin Nhân Viên' : 'Employee Details'}
          </h3>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 mb-1">GEN ID</label>
              <input
                type="text"
                value={genId}
                onChange={(e) => setGenId(e.target.value)}
                placeholder={language === 'VIE' ? 'Nhập mã nhân viên...' : 'Enter Employee ID'}
                className="w-full h-11 bg-slate-900/80 px-3.5 border border-slate-700/60 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-xs font-mono font-bold text-slate-200 placeholder-slate-500 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleLookup}
              disabled={isLookupLoading}
              className="h-11 bg-indigo-600 text-white px-5 rounded-xl font-semibold text-xs hover:bg-indigo-500 transition-all active:scale-95 shadow-md shadow-indigo-500/25 border border-indigo-400/30 flex items-center gap-1.5"
            >
              {isLookupLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">search</span>
              )}
              {language === 'VIE' ? 'Tra Cứu' : 'Lookup'}
            </button>
          </div>

          {/* Read-Only Employee Metadata Result */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-700/50">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                {language === 'VIE' ? 'HỌ VÀ TÊN' : 'NAME'}
              </span>
              <span className="text-sm font-bold text-white">{employeeName}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                {language === 'VIE' ? 'BỘ PHẬN' : 'DEPARTMENT'}
              </span>
              <span className="text-sm font-medium text-slate-200">
                {department} - Logistics Hub
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                COST CENTER
              </span>
              <span className="text-sm font-mono text-slate-200">{costCenter}</span>
            </div>
          </div>
        </section>

        {/* Section 2: Uniform Requirements */}
        <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400">checkroom</span>
              {language === 'VIE' ? 'Nhu Cầu Đồng Phục' : 'Uniform Requirements'}
            </h3>

            {/* AI Suggested Indicator */}
            <div className="flex items-center text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] mr-1 text-indigo-400">
                auto_awesome
              </span>
              {language === 'VIE' ? 'Gợi Ý Bởi AI' : 'AI Suggested'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Uniform Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Loại Đồng Phục' : 'Uniform Type'}
              </label>
              <select
                value={uniformType}
                onChange={(e) => setUniformType(e.target.value as UniformType)}
                className="w-full h-11 bg-slate-900/80 px-3.5 border border-slate-700/60 rounded-xl focus:border-indigo-500 outline-none text-xs text-slate-200 transition-all"
              >
                <option value="Ghile">Ghile</option>
                <option value="Polo Shirt">Polo Shirt</option>
                <option value="T-Shirt (Male)">T-Shirt (Male)</option>
                <option value="T-Shirt (Female)">T-Shirt (Female)</option>
                <option value="Jacket">Jacket</option>
                <option value="Coverall">Coverall</option>
                <option value="Cargo Pants">Cargo Pants</option>
                <option value="Pregnant">Pregnant / Maternity</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Danh Mục Sử Dụng' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full h-11 bg-slate-900/80 px-3.5 border border-slate-700/60 rounded-xl focus:border-indigo-500 outline-none text-xs text-slate-200 transition-all"
              >
                {(categoriesData[uniformType] || categoriesData['Ghile']).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Print Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'In Tên Lên Áo (Không bắt buộc)' : 'Print Name (Optional)'}
              </label>
              <input
                type="text"
                value={printName}
                onChange={(e) => setPrintName(e.target.value)}
                placeholder="e.g. NGUYEN V.A."
                className="w-full h-11 bg-slate-900/80 px-3.5 border border-slate-700/60 rounded-xl focus:border-indigo-500 outline-none text-xs text-slate-200 uppercase placeholder-slate-500 transition-all"
              />
            </div>

            {/* Size Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'VIE' ? 'Chọn Kích Cỡ' : 'Size Selection'}
              </label>
              <div className="flex gap-2">
                {activeSizes.map((s) => {
                  const isSelected = size === s;
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSize(s)}
                      className={`flex-1 h-11 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-2 border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-md shadow-indigo-500/20'
                          : 'border border-slate-700/60 bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Reason & File Upload & Action */}
        <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {language === 'VIE' ? 'Lý Do Đăng Ký Cấp Phát' : 'Reason for Request'}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReasonType)}
              className="w-full h-11 bg-slate-900/80 px-3.5 border border-slate-700/60 rounded-xl focus:border-indigo-500 outline-none text-xs text-slate-200 transition-all"
            >
              <option value="New Hire Allocation">New Hire Allocation</option>
              <option value="Annual Replacement">Annual Replacement</option>
              <option value="Damaged Uniform">Damaged Uniform</option>
              <option value="Maternity">Maternity</option>
              <option value="Seasonal">Seasonal</option>
            </select>
          </div>

          {/* Mandatory Image Upload if Damaged */}
          {reason === 'Damaged Uniform' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">
                {language === 'VIE'
                  ? 'Tải Ảnh Đồng Phục Bị Hỏng (Bắt buộc)'
                  : 'Upload Image of Damaged Uniform'}{' '}
                <span className="text-rose-400">*</span>
              </label>
              <div
                onClick={() => document.getElementById('damaged_file_input')?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-900/50 transition-colors cursor-pointer relative overflow-hidden"
              >
                {damagedImagePreview ? (
                  <img
                    src={damagedImagePreview}
                    alt="Damaged uniform preview"
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-3xl mb-1 text-indigo-400">
                      cloud_upload
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {language === 'VIE'
                        ? 'Chạm để tải ảnh hoặc kéo thả vào đây'
                        : 'Tap to upload or drag & drop'}
                    </span>
                    <span className="text-[10px] text-slate-500">PNG, JPG up to 10MB</span>
                  </>
                )}
              </div>
              <input
                id="damaged_file_input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Order Summary Widget */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'VIE' ? 'ĐỊNH MỨC CẤP PHÁT' : 'STANDARD ALLOCATION'}
              </span>
              <span className="text-lg font-bold text-white">
                {quantity} x {uniformType} ({size})
              </span>
            </div>

            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center text-xs font-bold">
              <span className="material-symbols-outlined text-[16px] mr-1">inventory</span>
              {language === 'VIE' ? 'Sẵn Có Trong Kho' : 'In Stock'}
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-indigo-600 text-white rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            {language === 'VIE' ? 'GỬI ĐĂNG KÝ CẤP PHÁT' : 'SUBMIT REGISTRATION'}
          </button>
        </section>
      </form>
    </div>
  );
};
