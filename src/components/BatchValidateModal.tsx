import React, { useState } from 'react';

interface BatchValidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunBatchValidate: () => Promise<void>;
  language: 'VIE' | 'ENG';
}

export const BatchValidateModal: React.FC<BatchValidateModalProps> = ({
  isOpen,
  onClose,
  onRunBatchValidate,
  language,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStart = async () => {
    setIsRunning(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 400);

    try {
      await onRunBatchValidate();
      setProgress(100);
      setResultMessage(
        language === 'VIE'
          ? 'Kiểm duyệt hoàn tất! Tất cả đơn hợp lệ đã được phê duyệt tự động.'
          : 'Batch validation complete! All valid requests auto-approved by AI Policy Engine.'
      );
    } catch (e) {
      setResultMessage('Batch validation encountered an issue.');
    } finally {
      clearInterval(interval);
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/40">
          <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined text-indigo-400">auto_awesome</span>
            {language === 'VIE' ? 'Kiểm Duyệt Hàng Loạt Bằng AI' : 'AI Batch Validation Engine'}
          </h3>
          <button
            onClick={onClose}
            disabled={isRunning}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <span className={`material-symbols-outlined text-3xl ${isRunning ? 'animate-spin' : ''}`}>
              memory
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              {language === 'VIE' ? 'Phê Duyệt Tự Động Theo Chính Sách' : 'Policy Engine Automated Check'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'VIE'
                ? 'AI sẽ quét tất cả đơn đang ở trạng thái Validating, kiểm tra tồn kho và định mức cấp phát.'
                : 'Scans pending requests for biometric size anomalies and inventory allocations.'}
            </p>
          </div>

          {isRunning && (
            <div className="space-y-2 pt-2">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-[11px] font-mono text-indigo-400">Analyzing requests... {progress}%</p>
            </div>
          )}

          {resultMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl font-medium">
              {resultMessage}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700/50 bg-slate-800/40 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isRunning}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-all disabled:opacity-50 cursor-pointer"
          >
            {language === 'VIE' ? 'Đóng' : 'Close'}
          </button>
          {!resultMessage ? (
            <button
              onClick={handleStart}
              disabled={isRunning}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/25 border border-indigo-400/30 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              {language === 'VIE' ? 'Bắt Đầu Kiểm Duyệt' : 'Start Validation'}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/25 border border-indigo-400/30 cursor-pointer"
            >
              {language === 'VIE' ? 'Hoàn Tất' : 'Done'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
