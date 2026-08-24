import React, { useEffect, useState } from 'react';
import { Users, UserPlus, CheckCircle2, Search, Building2 } from 'lucide-react';
import { RecipientGroup } from '../../types';
import { recipientService } from '../../services/recipientService';

export const RecipientsPage: React.FC = () => {
  const [groups, setGroups] = useState<RecipientGroup[]>([]);

  useEffect(() => {
    recipientService.getGroups().then(setGroups);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30]">Đối Tượng Nhận Quà (Recipients)</h1>
          <p className="text-xs md:text-sm text-[#424752] mt-0.5">Phân nhóm nhân sự, phòng ban và chi nhánh công ty.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <div key={g.id} className="bg-white border border-[#c2c6d4]/30 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-[#eff4ff] text-[#003f87]">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold bg-[#d7e2ff] text-[#003f87] px-2.5 py-1 rounded-full">
                {g.memberCount} thành viên
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#0b1c30]">{g.name}</h3>
              <p className="text-xs text-[#424752] mt-1">{g.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipientsPage;
