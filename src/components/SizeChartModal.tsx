import React from 'react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'VIE' | 'ENG';
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/40">
          <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined text-indigo-400">straighten</span>
            {language === 'VIE' ? 'Bảng Thông Số Kích Cỡ Đồng Phục' : 'Uniform Size Measurement Guide'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Men's Chart */}
          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              {language === 'VIE' ? 'BẢNG SIZE NAM (MEN)' : "MEN'S UNIFORM SIZE CHART"}
            </h4>
            <table className="w-full text-xs text-left border border-slate-700/50 rounded-xl overflow-hidden">
              <thead className="bg-slate-800/80 text-slate-300">
                <tr>
                  <th className="p-2 border-b border-slate-700/50">Size</th>
                  <th className="p-2 border-b border-slate-700/50">{language === 'VIE' ? 'Chiều cao (cm)' : 'Height (cm)'}</th>
                  <th className="p-2 border-b border-slate-700/50">{language === 'VIE' ? 'Cân nặng (kg)' : 'Weight (kg)'}</th>
                  <th className="p-2 border-b border-slate-700/50">{language === 'VIE' ? 'Vòng ngực (cm)' : 'Chest (cm)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-2 font-bold">S</td>
                  <td className="p-2">160 - 165</td>
                  <td className="p-2">50 - 58</td>
                  <td className="p-2">84 - 88</td>
                </tr>
                <tr className="bg-slate-800/30">
                  <td className="p-2 font-bold text-indigo-400">M (Standard)</td>
                  <td className="p-2">165 - 172</td>
                  <td className="p-2">59 - 68</td>
                  <td className="p-2">88 - 94</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">L</td>
                  <td className="p-2">172 - 178</td>
                  <td className="p-2">69 - 78</td>
                  <td className="p-2">94 - 100</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">XL</td>
                  <td className="p-2">178 - 185</td>
                  <td className="p-2">79 - 90</td>
                  <td className="p-2">100 - 108</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Women's Chart */}
          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              {language === 'VIE' ? 'BẢNG SIZE NỮ & BẦU (WOMEN & MATERNITY)' : "WOMEN & MATERNITY SIZE CHART"}
            </h4>
            <table className="w-full text-xs text-left border border-slate-700/50 rounded-xl overflow-hidden">
              <thead className="bg-slate-800/80 text-slate-300">
                <tr>
                  <th className="p-2 border-b border-slate-700/50">Size</th>
                  <th className="p-2 border-b border-slate-700/50">{language === 'VIE' ? 'Chiều cao (cm)' : 'Height (cm)'}</th>
                  <th className="p-2 border-b border-slate-700/50">{language === 'VIE' ? 'Cân nặng (kg)' : 'Weight (kg)'}</th>
                  <th className="p-2 border-b border-slate-700/50">{language === 'VIE' ? 'Ghi chú' : 'Notes'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-2 font-bold">S</td>
                  <td className="p-2">150 - 156</td>
                  <td className="p-2">42 - 48</td>
                  <td className="p-2 text-slate-400">Standard Fit</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">M</td>
                  <td className="p-2">156 - 162</td>
                  <td className="p-2">49 - 55</td>
                  <td className="p-2 text-slate-400">Standard Fit</td>
                </tr>
                <tr className="bg-amber-500/10">
                  <td className="p-2 font-bold text-amber-300">Mat M (Bầu M)</td>
                  <td className="p-2">155 - 165</td>
                  <td className="p-2">55 - 68</td>
                  <td className="p-2 text-amber-300 font-medium">Maternity Elastic Band</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/50 bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/25 border border-indigo-400/30 cursor-pointer"
          >
            {language === 'VIE' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
