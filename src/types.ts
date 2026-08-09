export type RequestStatus = 'Validating' | 'Approved' | 'Ready' | 'Delivered' | 'Action Required' | 'Cancelled';

export type UniformType = 'Ghile' | 'Polo Shirt' | 'T-Shirt (Male)' | 'T-Shirt (Female)' | 'Coverall' | 'Jacket' | 'Cargo Pants' | 'Pregnant';

export type CategoryType = 'Operations - Field' | 'Warehouse' | 'Maintenance' | 'Security' | 'Office' | 'Cold Storage' | 'All Categories';

export type DepartmentType = 'Operations' | 'Maintenance' | 'Security' | 'Logistics' | 'Warehouse Ops' | 'Management';

export type ReasonType = 'New Hire Allocation' | 'Annual Replacement' | 'Damaged Uniform' | 'Maternity' | 'Seasonal' | 'Replace';

export interface UniformRequest {
  id: string; // e.g. RQ-2023-0891
  orderNumber?: string; // e.g. #REQ-8492A
  genId: string; // e.g. G-48291
  employeeName: string;
  department: DepartmentType;
  costCenter?: string;
  uniformType: UniformType;
  category: CategoryType;
  printName?: string;
  size: string; // e.g. M, L, XL, Mat M
  reason: ReasonType;
  quantity: number;
  status: RequestStatus;
  createdAt: string; // e.g. Oct 24, 09:41 AM
  updatedAt?: string;
  aiSuggested?: boolean;
  aiNote?: string;
  warning?: string;
  damagedImageUrl?: string;
  pickupLocation?: string;
  pickupTime?: string;
  returnRequired?: boolean;
  returnReason?: string;
  collectedByWarehouse?: boolean;
  confirmedReceived?: boolean;
  timeline?: {
    submittedAt?: string;
    approvedAt?: string;
    approvedByAi?: boolean;
    readyAt?: string;
    deliveredAt?: string;
  };
}

export interface Employee {
  genId: string;
  name: string;
  department: DepartmentType;
  costCenter: string;
  location: string;
  avatarUrl?: string;
  recommendedSize?: string;
  previousRequestDate?: string;
}

export interface InventoryItem {
  id: string;
  uniformType: UniformType;
  category: string;
  size: string;
  inStock: number;
  allocated: number;
  minThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface AiAutomationLog {
  id: string;
  timestamp: string;
  type: 'Data Sync' | 'Size Validation' | 'Inventory Check' | 'Policy Approval';
  status: 'Success' | 'Running...' | 'Warning' | 'Failed';
  message: string;
  confidenceScore?: number;
  reqId?: string;
}

export interface AppStats {
  totalRequests: number;
  pendingApproval: number;
  approved: number;
  stockAlerts: number;
  weeklyGrowth: string;
  avgWaitTime: string;
  aiConfidenceScore: number;
  deptVolume: {
    dept: string;
    percentage: number;
  }[];
}

export type ViewTab = 'dashboard' | 'requests' | 'registration' | 'status' | 'inventory' | 'ailogs' | 'settings';
