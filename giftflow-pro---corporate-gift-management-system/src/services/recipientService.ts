/**
 * GiftFlow Pro - Recipients & Reports Services
 */

import request from './request';
import { ENDPOINTS } from './endpoint';
import { RecipientGroup } from '../types';

export const recipientService = {
  async getGroups(): Promise<RecipientGroup[]> {
    return [
      { id: 'grp-1', name: 'All Employees', description: 'Toàn bộ nhân sự chính thức và thử việc', memberCount: 1450, isDefault: true },
      { id: 'grp-2', name: 'Vietnam Staff', description: 'Chi nhánh Hà Nội, TP.HCM & Đà Nẵng', memberCount: 980 },
      { id: 'grp-3', name: 'Korea Staff', description: 'Trụ sở Seoul HQ & Busan R&D', memberCount: 320 },
      { id: 'grp-4', name: 'Operator', description: 'Đội ngũ vận hành kho và giao vận bưu kiện', memberCount: 120 },
      { id: 'grp-5', name: 'Dispatcher', description: 'Điều phối viên giao vận hiện trường', memberCount: 85 },
    ];
  },
};

export const reportService = {
  async getFulfillmentReport() {
    return {
      totalCampaigns: 15,
      giftsDelivered: 4592,
      satisfactionRate: '98.4%',
      budgetSpentVND: 3450000000,
    };
  },
};
