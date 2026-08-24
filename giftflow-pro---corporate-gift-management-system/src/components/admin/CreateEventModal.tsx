import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  X,
  UploadCloud,
  BellRing,
  PlusCircle,
  Users,
  FileSpreadsheet,
  UserCheck,
  Check,
} from 'lucide-react';
import { CorporateEvent, RecipientSelectionMethod } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Partial<CorporateEvent>) => Promise<void>;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectionMethod, setSelectionMethod] = useState<RecipientSelectionMethod>('Segment Filter');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['All Employees']);
  const [customGroups, setCustomGroups] = useState('');
  const [autoEmail, setAutoEmail] = useState(true);
  const [sendReminders, setSendReminders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vietnameseBanner, setVietnameseBanner] = useState<string | null>(null);
  const [intlBanner, setIntlBanner] = useState<string | null>(null);

  const availableGroups = [
    'All Employees',
    'Vietnam Staff',
    'Korea Staff',
    'Operator',
    'Dispatcher',
  ];

  const handleGroupToggle = (group: string) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter((g) => g !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const handleBannerUpload = (type: 'vi' | 'intl', file: File | null) => {
    if (!file) return;
    if (type === 'vi') {
      setVietnameseBanner(file.name);
    } else {
      setIntlBanner(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        startDate,
        endDate,
        deadline: endDate,
        recipientMethod: selectionMethod,
        selectedGroups,
        customGroups: customGroups.trim(),
        autoAnnouncementEmail: autoEmail,
        sendReminderEmails: sendReminders,
        vietnameseBanner: vietnameseBanner || undefined,
        internationalBanner: intlBanner || undefined,
        targetCount: selectedGroups.includes('All Employees') ? 1400 : selectedGroups.length * 250,
      });

      // Reset form
      setTitle('');
      setStartDate('');
      setEndDate('');
      setSelectedGroups(['All Employees']);
      setCustomGroups('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-[#0b1c30]/40 backdrop-blur-sm"
          id="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,63,135,0.15)] border border-white/60 overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#c2c6d4]/30 bg-[#f8f9ff]/70">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#003f87]/10 flex items-center justify-center text-[#003f87]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0b1c30]" id="modal-title">
                    Create New Event
                  </h2>
                  <p className="text-xs text-[#424752]">
                    Configure logistics and notifications for the upcoming gift event.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="h-8 w-8 rounded-full flex items-center justify-center text-[#424752] hover:bg-[#d3e4fe] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <form id="create-event-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Section: General Details */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-[#003f87] uppercase tracking-wider">
                    General Details
                  </h3>

                  {/* Event Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="event-title">
                      Event Title <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="event-title"
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Q3 Sales Kickoff Appreciation"
                      className="w-full rounded-xl border border-[#c2c6d4]/60 bg-[#f8f9ff] px-4 py-2.5 text-sm text-[#0b1c30] placeholder:text-[#727784] focus:outline-none focus:ring-2 focus:ring-[#003f87] focus:bg-white transition-all shadow-xs"
                    />
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="start-date">
                        Start Date <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="start-date"
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-xl border border-[#c2c6d4]/60 bg-[#f8f9ff] px-4 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#003f87] focus:bg-white transition-all shadow-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#0b1c30]" htmlFor="end-date">
                        End Date <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="end-date"
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-xl border border-[#c2c6d4]/60 bg-[#f8f9ff] px-4 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#003f87] focus:bg-white transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Recipient Selection Method */}
                  <div className="space-y-3 pt-1">
                    <label className="text-xs font-semibold text-[#0b1c30]">
                      Recipient Selection Method
                    </label>

                    {/* Tabs */}
                    <div className="flex bg-[#eff4ff] p-1 rounded-xl border border-[#c2c6d4]/40">
                      {(['Segment Filter', 'Upload List', 'Manual'] as RecipientSelectionMethod[]).map(
                        (method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectionMethod(method)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                              selectionMethod === method
                                ? 'bg-white text-[#003f87] shadow-sm'
                                : 'text-[#424752] hover:text-[#0b1c30]'
                            }`}
                          >
                            {method}
                          </button>
                        )
                      )}
                    </div>

                    {/* Method Content */}
                    {selectionMethod === 'Segment Filter' && (
                      <div className="p-4 bg-white border border-[#c2c6d4]/30 rounded-xl space-y-3 shadow-xs">
                        <span className="text-[11px] font-bold text-[#424752] uppercase tracking-wider">
                          Select Groups
                        </span>
                        <div className="grid grid-cols-2 gap-2.5">
                          {availableGroups.map((grp) => {
                            const isChecked = selectedGroups.includes(grp);
                            return (
                              <label
                                key={grp}
                                className="flex items-center gap-2 cursor-pointer text-xs text-[#0b1c30] hover:text-[#003f87]"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleGroupToggle(grp)}
                                  className="w-4 h-4 rounded text-[#003f87] border-[#c2c6d4] focus:ring-[#003f87]"
                                />
                                <span>{grp}</span>
                              </label>
                            );
                          })}
                        </div>

                        <div className="space-y-1 pt-2">
                          <label className="text-[11px] font-semibold text-[#424752]" htmlFor="custom-groups">
                            Custom Groups / Teams
                          </label>
                          <input
                            id="custom-groups"
                            type="text"
                            value={customGroups}
                            onChange={(e) => setCustomGroups(e.target.value)}
                            placeholder="Search or enter team names..."
                            className="w-full rounded-lg border border-[#c2c6d4]/50 bg-[#f8f9ff] px-3 py-2 text-xs text-[#0b1c30] focus:ring-1 focus:ring-[#003f87] focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectionMethod === 'Upload List' && (
                      <div className="p-6 border-2 border-dashed border-[#c2c6d4] rounded-xl flex flex-col items-center justify-center bg-[#eff4ff]/30 text-center space-y-2">
                        <FileSpreadsheet className="w-8 h-8 text-[#003f87]" />
                        <p className="text-xs text-[#424752]">
                          Drag and drop Excel/CSV or{' '}
                          <label className="text-[#003f87] font-semibold cursor-pointer underline">
                            browse
                            <input type="file" accept=".xlsx,.csv" className="hidden" />
                          </label>
                        </p>
                        <span className="text-[11px] text-[#727784]">Supports .xlsx, .csv up to 10MB</span>
                      </div>
                    )}

                    {selectionMethod === 'Manual' && (
                      <div className="p-4 bg-white border border-[#c2c6d4]/30 rounded-xl space-y-2">
                        <label className="text-xs font-semibold text-[#424752]">
                          Add Individual Employees by ID or Name
                        </label>
                        <input
                          type="text"
                          placeholder="Type employee name or EMP ID..."
                          className="w-full rounded-lg border border-[#c2c6d4]/50 bg-[#f8f9ff] px-3 py-2 text-xs text-[#0b1c30] focus:ring-1 focus:ring-[#003f87]"
                        />
                      </div>
                    )}
                  </div>
                </section>

                <hr className="border-t border-[#c2c6d4]/30" />

                {/* Section: Notification Settings */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-[#003f87]" />
                    <h3 className="text-xs font-bold text-[#003f87] uppercase tracking-wider">
                      Notification Settings
                    </h3>
                  </div>

                  <div className="bg-white border border-[#c2c6d4]/30 rounded-xl p-4 space-y-4 shadow-xs">
                    {/* Announcement Banners Upload */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-[#0b1c30]">
                        Announcement Banners
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Box 1 */}
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#c2c6d4]/70 rounded-xl bg-[#eff4ff]/40 hover:bg-[#dce9ff]/40 transition-colors cursor-pointer text-center space-y-1">
                          <UploadCloud className="w-6 h-6 text-[#003f87]" />
                          <p className="text-xs font-medium text-[#0b1c30]">
                            {vietnameseBanner || 'Upload Vietnamese Banner'}
                          </p>
                          <span className="text-[11px] text-[#003f87]">Max 2MB, JPG/PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleBannerUpload('vi', e.target.files?.[0] || null)}
                          />
                        </label>

                        {/* Box 2 */}
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#c2c6d4]/70 rounded-xl bg-[#eff4ff]/40 hover:bg-[#dce9ff]/40 transition-colors cursor-pointer text-center space-y-1">
                          <UploadCloud className="w-6 h-6 text-[#003f87]" />
                          <p className="text-xs font-medium text-[#0b1c30]">
                            {intlBanner || 'Upload International Banner'}
                          </p>
                          <span className="text-[11px] text-[#003f87]">Max 2MB, JPG/PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleBannerUpload('intl', e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                    </div>

                    <hr className="border-t border-[#c2c6d4]/20" />

                    {/* Toggle 1 */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#0b1c30]">
                          Automated Announcement Email
                        </p>
                        <p className="text-[11px] text-[#424752]">
                          Notify eligible recipients when the event starts.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutoEmail(!autoEmail)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          autoEmail ? 'bg-[#003f87]' : 'bg-[#c2c6d4]'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            autoEmail ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <hr className="border-t border-[#c2c6d4]/20" />

                    {/* Toggle 2 */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#0b1c30]">
                          Send Reminder Emails
                        </p>
                        <p className="text-[11px] text-[#424752]">
                          Automated follow-ups 48 hours before close for unselected gifts.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSendReminders(!sendReminders)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          sendReminders ? 'bg-[#003f87]' : 'bg-[#c2c6d4]'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            sendReminders ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </section>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-[#c2c6d4]/30 bg-[#f8f9ff] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full text-xs font-semibold text-[#424752] hover:bg-[#dce9ff] transition-colors"
              >
                Cancel
              </button>
              <button
                form="create-event-form"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-full text-xs font-semibold bg-[#003f87] text-white hover:bg-[#002d62] active:scale-95 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Creating...' : 'Create Event'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateEventModal;
