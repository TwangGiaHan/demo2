import { UniformRequest, Employee, InventoryItem, AiAutomationLog, AppStats } from '../types';

export const INITIAL_REQUESTS: UniformRequest[] = [
  {
    id: 'RQ-2023-0892',
    orderNumber: '#REQ-8492A',
    genId: 'G-89421',
    employeeName: 'Nguyen Van A',
    department: 'Logistics',
    costCenter: 'CC-8942-VN',
    uniformType: 'Ghile',
    category: 'Operations - Field',
    size: 'M',
    reason: 'Replace',
    quantity: 2,
    status: 'Ready',
    createdAt: 'Oct 24, 09:41 AM',
    updatedAt: 'Oct 24, 11:30 AM',
    aiSuggested: true,
    aiNote: 'Auto-approved by AI Policy Engine',
    pickupLocation: 'GA Warehouse',
    pickupTime: 'Thursday, 08:00 - 16:00',
    returnRequired: true,
    returnReason: 'Replace',
    collectedByWarehouse: false,
    confirmedReceived: false,
    timeline: {
      submittedAt: 'Oct 24, 09:41 AM',
      approvedAt: 'Oct 24, 11:30 AM',
      approvedByAi: true,
      readyAt: 'Oct 24, 02:15 PM',
      deliveredAt: undefined
    }
  },
  {
    id: 'RQ-2023-0891',
    genId: 'G-48291',
    employeeName: 'Sarah Jenkins',
    department: 'Operations',
    costCenter: 'CC-4829-US',
    uniformType: 'Polo Shirt',
    category: 'Operations - Field',
    size: 'M',
    reason: 'New Hire Allocation',
    quantity: 3,
    status: 'Validating',
    createdAt: 'Oct 24, 2023',
    aiSuggested: true,
    aiNote: 'AI Suggested Size based on employee biometric profile'
  },
  {
    id: 'RQ-2023-0890',
    genId: 'G-33920',
    employeeName: 'David Chen',
    department: 'Maintenance',
    costCenter: 'CC-3392-CN',
    uniformType: 'Coverall',
    category: 'Maintenance',
    size: 'XL',
    reason: 'Annual Replacement',
    quantity: 2,
    status: 'Delivered',
    createdAt: 'Oct 23, 2023',
    confirmedReceived: true
  },
  {
    id: 'RQ-2023-0889',
    genId: 'G-51002',
    employeeName: 'Michael Ross',
    department: 'Security',
    costCenter: 'CC-5100-US',
    uniformType: 'Jacket',
    category: 'Security',
    size: 'L',
    reason: 'Seasonal',
    quantity: 1,
    status: 'Action Required',
    createdAt: 'Oct 23, 2023',
    warning: 'Size Mismatch Warning: Height & Weight suggest Size M, requested Size L.'
  },
  {
    id: 'RQ-2023-0888',
    genId: 'G-22819',
    employeeName: 'Elena Rodriguez',
    department: 'Operations',
    costCenter: 'CC-2281-MX',
    uniformType: 'Cargo Pants',
    category: 'Operations - Field',
    size: 'S',
    reason: 'Annual Replacement',
    quantity: 2,
    status: 'Approved',
    createdAt: 'Oct 22, 2023',
    aiSuggested: false
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    genId: 'G-89421',
    name: 'Nguyen Van A',
    department: 'Logistics',
    costCenter: 'CC-8942-VN',
    location: 'Logistics Hub - North',
    recommendedSize: 'M',
    previousRequestDate: '2022-11-15'
  },
  {
    genId: 'G-48291',
    name: 'Sarah Jenkins',
    department: 'Operations',
    costCenter: 'CC-4829-US',
    location: 'GA Warehouse - Terminal 1',
    recommendedSize: 'M'
  },
  {
    genId: 'G-33920',
    name: 'David Chen',
    department: 'Maintenance',
    costCenter: 'CC-3392-CN',
    location: 'Maintenance Hangar 3',
    recommendedSize: 'XL',
    previousRequestDate: '2022-10-20'
  },
  {
    genId: 'G-51002',
    name: 'Michael Ross',
    department: 'Security',
    costCenter: 'CC-5100-US',
    location: 'Main Security Gate',
    recommendedSize: 'M'
  },
  {
    genId: 'G-22819',
    name: 'Elena Rodriguez',
    department: 'Operations',
    costCenter: 'CC-2281-MX',
    location: 'Central Sorting Hub',
    recommendedSize: 'S'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-01', uniformType: 'Ghile', category: 'Operations - Field', size: 'M', inStock: 142, allocated: 38, minThreshold: 30, status: 'In Stock' },
  { id: 'INV-02', uniformType: 'Ghile', category: 'Operations - Field', size: 'L', inStock: 85, allocated: 20, minThreshold: 25, status: 'In Stock' },
  { id: 'INV-03', uniformType: 'Polo Shirt', category: 'Operations - Field', size: 'M', inStock: 12, allocated: 45, minThreshold: 50, status: 'Low Stock' },
  { id: 'INV-04', uniformType: 'Coverall', category: 'Maintenance', size: 'XL', inStock: 64, allocated: 15, minThreshold: 20, status: 'In Stock' },
  { id: 'INV-05', uniformType: 'Jacket', category: 'Security', size: 'L', inStock: 5, allocated: 18, minThreshold: 15, status: 'Low Stock' },
  { id: 'INV-06', uniformType: 'Cargo Pants', category: 'Operations - Field', size: 'S', inStock: 98, allocated: 12, minThreshold: 20, status: 'In Stock' },
  { id: 'INV-07', uniformType: 'Pregnant', category: 'All Categories', size: 'Mat M', inStock: 3, allocated: 8, minThreshold: 10, status: 'Low Stock' },
];

export const INITIAL_AI_LOGS: AiAutomationLog[] = [
  { id: 'LOG-101', timestamp: '2 mins ago', type: 'Data Sync', status: 'Success', message: 'Employee master data synchronized from HRIS endpoint.' },
  { id: 'LOG-102', timestamp: 'Running...', type: 'Size Validation', status: 'Running...', message: 'Validating size recommendations against historical return data.', confidenceScore: 98.5 },
  { id: 'LOG-103', timestamp: '1 hr ago', type: 'Inventory Check', status: 'Success', message: 'Inventory levels updated. 7 low-stock alerts highlighted.', confidenceScore: 99.2 },
  { id: 'LOG-104', timestamp: '3 hrs ago', type: 'Policy Approval', status: 'Success', message: 'Auto-approved order #REQ-8492A for Nguyen Van A (Policy Rule #A2).', confidenceScore: 99.8, reqId: 'RQ-2023-0892' },
  { id: 'LOG-105', timestamp: '5 hrs ago', type: 'Size Validation', status: 'Warning', message: 'Flagged RQ-2023-0889 for Michael Ross due to 1-size variance from bio data.', confidenceScore: 84.1, reqId: 'RQ-2023-0889' },
];

export const INITIAL_STATS: AppStats = {
  totalRequests: 1248,
  pendingApproval: 42,
  approved: 856,
  stockAlerts: 7,
  weeklyGrowth: '+12%',
  avgWaitTime: '4hrs',
  aiConfidenceScore: 98.5,
  deptVolume: [
    { dept: 'Warehouse Ops', percentage: 45 },
    { dept: 'Field Techs', percentage: 30 },
    { dept: 'Logistics', percentage: 15 },
    { dept: 'Management', percentage: 10 }
  ]
};
