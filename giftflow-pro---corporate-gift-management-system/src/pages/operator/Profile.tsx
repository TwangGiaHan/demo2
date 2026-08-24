import React from 'react';
import { UserProfile } from '../../types';
import { Mail, Building, MapPin, BadgeCheck, Shield, Phone, Sparkles } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
}

export const ProfilePage: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 md:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#0b1c30]">Hồ Sơ Cá Nhân</h1>
        <p className="text-sm text-[#424752]">Thông tin nhân sự và địa chỉ nhận quà nội bộ.</p>
      </header>

      <div className="bg-white border border-[#c2c6d4]/40 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-[#003f87]/15 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#0b1c30]">{user.name}</h2>
              <span className="bg-[#d7e2ff] text-[#001a40] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {user.empId}
              </span>
            </div>
            <p className="text-xs text-gray-500">{user.position} • {user.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-[#003f87] font-semibold">
              <Mail className="w-4 h-4" />
              <span>Email Công Ty</span>
            </div>
            <p className="text-gray-700 font-mono">{user.email}</p>
          </div>

          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-[#003f87] font-semibold">
              <Building className="w-4 h-4" />
              <span>Phòng Ban</span>
            </div>
            <p className="text-gray-700">{user.department}</p>
          </div>

          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-[#003f87] font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Địa Điểm Làm Việc</span>
            </div>
            <p className="text-gray-700">{user.location}</p>
          </div>

          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-gray-100 space-y-1">
            <div className="flex items-center gap-1.5 text-[#003f87] font-semibold">
              <BadgeCheck className="w-4 h-4" />
              <span>Quyền Hạn Hệ Thống</span>
            </div>
            <p className="text-gray-700 capitalize">Operator / Employee Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
