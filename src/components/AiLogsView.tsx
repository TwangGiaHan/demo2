import React from 'react';
import { AiAutomationLog } from '../types';

interface AiLogsViewProps {
  logs: AiAutomationLog[];
  language: 'VIE' | 'ENG';
}

export const AiLogsView: React.FC<AiLogsViewProps> = ({ logs, language }) => {
  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400">smart_toy</span>
          {language === 'VIE' ? 'Nhật Ký Tự Động Hóa AI' : 'AI Automation Logs'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {language === 'VIE'
            ? 'Theo dõi quyết định phê duyệt chính sách, độ tin cậy và phân tích chọn cỡ đồng phục.'
            : 'Audit AI policy approvals, confidence scores, and size recommendation logs.'}
        </p>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'VIE' ? 'MÔ HÌNH DỰ ĐOÁN' : 'MODEL ALIAS'}
            </span>
            <span className="text-lg font-bold text-indigo-400 mt-1">Gemini 2.5 Policy Engine</span>
          </div>
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'VIE' ? 'ĐỘ CHÍNH XÁC TRUNG BÌNH' : 'AVERAGE CONFIDENCE'}
            </span>
            <span className="text-lg font-bold text-emerald-400 mt-1">98.5%</span>
          </div>
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'VIE' ? 'QUY TẮC TỰ ĐỘNG PHÊ DUYỆT' : 'AUTO-APPROVAL RULES'}
            </span>
            <span className="text-lg font-bold text-white mt-1">Active (Rule #A2 & #B4)</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-800/80 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400">{log.type}</span>
                  <span className="text-[10px] text-slate-500">• {log.timestamp}</span>
                  {log.confidenceScore && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      Confidence: {log.confidenceScore}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200 font-medium">{log.message}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  log.status === 'Success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : log.status === 'Warning'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
