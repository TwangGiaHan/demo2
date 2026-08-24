/**
 * GiftFlow Pro - Corporate Gift Management System
 * Core TypeScript definitions and Domain Models
 */

export type EventStatus = 'Active' | 'Draft' | 'Completed' | 'Upcoming';

export type RegistrationStatus = 'Registered' | 'Received' | 'Pending' | 'Cancelled';

export type RecipientSelectionMethod = 'Segment Filter' | 'Upload List' | 'Manual';

export interface GiftOption {
  id: string;
  code: string; // e.g. 'A', 'B', 'C'
  title: string; // e.g. 'Gift A: Premium Hamper'
  name: string; // e.g. 'Premium Hamper'
  description: string;
  itemsInclude?: string;
  imageUrl?: string;
  stock?: number;
  claimedCount?: number;
  tag?: string;
}

export interface CorporateEvent {
  id: string;
  code: string; // e.g. 'EVT-2023-09A'
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  deadline: string;
  status: EventStatus;
  targetCount: number;
  registeredCount: number;
  remainingCount: number;
  recipientMethod: RecipientSelectionMethod;
  selectedGroups: string[];
  customGroups?: string;
  vietnameseBanner?: string;
  internationalBanner?: string;
  autoAnnouncementEmail: boolean;
  sendReminderEmails: boolean;
  gifts: GiftOption[];
  createdAt: string;
  updatedAt?: string;
}

export interface EmployeeRegistration {
  id: string;
  empId: string;
  name: string;
  department: string;
  email: string;
  giftChoiceId?: string;
  giftChoiceName?: string;
  status: RegistrationStatus;
  registeredAt?: string;
  receivedAt?: string;
  eventId: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  totalStock: number;
  allocated: number;
  available: number;
  unitPrice: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl?: string;
  lastRestocked?: string;
}

export interface RecipientGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  empId: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'employee';
  department: string;
  avatar: string;
  position: string;
  location: string;
}

export interface GiftHistoryRecord {
  id: string;
  eventName: string;
  giftName: string;
  date: string;
  status: 'Đã nhận' | 'Đang xử lý' | 'Đang giao';
  details?: string;
}

export interface ActiveRegistration {
  eventId: string;
  eventTitle: string;
  statusBadge: string;
  giftTitle: string;
  giftDescription: string;
  giftImageUrl: string;
  changeDeadline: string;
  selectedGiftId: string;
}

export interface DashboardMetrics {
  activeEvents: number;
  activeEventsChange: string;
  totalGiftsClaimed: number;
  completionRate: string;
  pendingApprovals: number;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EventFilterParams {
  search?: string;
  status?: EventStatus | 'All';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface RegistrationFilterParams {
  search?: string;
  department?: string;
  status?: RegistrationStatus | 'All';
  giftChoice?: string;
  page?: number;
  pageSize?: number;
}
