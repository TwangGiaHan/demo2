import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface UploadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (importedCount: number) => void;
  eventTitle: string;
}

export const UploadResultModal: React.FC<UploadResultModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  eventTitle,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate file parsing
    setIsUploading(false);
    onUploadSuccess(4);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#0b1c30]/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-[#f8f9ff]">
              <div>
                <h3 className="text-base font-bold text-[#0b1c30]">Upload Distribution Results</h3>
                <p className="text-xs text-gray-500 mt-0.5">{eventTitle}</p>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <label className="border-2 border-dashed border-[#c2c6d4] hover:border-[#003f87] bg-[#eff4ff]/40 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-2">
                <FileSpreadsheet className="w-10 h-10 text-[#003f87]" />
                <p className="text-sm font-semibold text-[#0b1c30]">
                  {file ? file.name : 'Select or drag CSV / Excel file'}
                </p>
                <p className="text-xs text-gray-500">Columns: Employee ID, Status (Received), Timestamp</p>
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>

              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <span>Template format:</span>
                <button
                  type="button"
                  onClick={() => alert('Đang tải file mẫu Template_Gift_Distribution.xlsx')}
                  className="text-[#003f87] font-semibold hover:underline"
                >
                  Download Excel Template
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!file || isUploading}
                onClick={handleUpload}
                className="px-5 py-2 text-xs font-semibold bg-[#003f87] text-white hover:bg-[#002d62] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Processing...' : 'Upload & Update'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadResultModal;
