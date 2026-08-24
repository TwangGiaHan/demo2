/**
 * GiftFlow Pro - API Endpoint Registry & Contract Definitions
 * 
 * This file serves as the Single Source of Truth (SSOT) for all backend communication endpoints.
 * Backend engineers should implement the REST API according to the specifications documented below.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const ENDPOINTS = {
  // =========================================================================
  // 1. AUTHENTICATION & PROFILE MODULE
  // =========================================================================
  AUTH: {
    /**
     * POST /api/v1/auth/login
     * Request Body: { email: string, password?: string, ssoToken?: string }
     * Response: { token: string, refreshToken: string, user: UserProfile }
     */
    LOGIN: `${API_BASE_URL}/auth/login`,

    /**
     * GET /api/v1/auth/me
     * Headers: Authorization: Bearer <token>
     * Response: UserProfile
     */
    GET_CURRENT_USER: `${API_BASE_URL}/auth/me`,

    /**
     * POST /api/v1/auth/logout
     */
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },

  // =========================================================================
  // 2. CORPORATE EVENT MANAGEMENT MODULE (ADMIN)
  // =========================================================================
  EVENTS: {
    /**
     * GET /api/v1/events
     * Query Params: { search?: string, status?: 'Active'|'Draft'|'Completed', page?: number, pageSize?: number }
     * Response: PaginatedResult<CorporateEvent>
     * Notes: Used in Admin Dashboard & Events List table.
     */
    LIST: `${API_BASE_URL}/events`,

    /**
     * GET /api/v1/events/metrics
     * Response: DashboardMetrics { activeEvents, totalGiftsClaimed, pendingApprovals, completionRate }
     * Notes: Bento metric widgets on the main Admin Dashboard.
     */
    METRICS: `${API_BASE_URL}/events/metrics`,

    /**
     * GET /api/v1/events/:id
     * Path Param: id (e.g., 'evt-001')
     * Response: CorporateEvent
     * Notes: Details page for specific event, including gift options & target ratios.
     */
    DETAIL: (id: string) => `${API_BASE_URL}/events/${id}`,

    /**
     * POST /api/v1/events
     * Request Body: Omit<CorporateEvent, 'id' | 'createdAt' | 'registeredCount' | 'remainingCount'>
     * Response: CorporateEvent
     * Notes: Create new event modal with audience filtering & email settings.
     */
    CREATE: `${API_BASE_URL}/events`,

    /**
     * PUT /api/v1/events/:id
     * Request Body: Partial<CorporateEvent>
     * Response: CorporateEvent
     */
    UPDATE: (id: string) => `${API_BASE_URL}/events/${id}`,

    /**
     * DELETE /api/v1/events/:id
     */
    DELETE: (id: string) => `${API_BASE_URL}/events/${id}`,

    /**
     * POST /api/v1/events/:id/banners
     * Form-Data: { file: Binary, type: 'vietnamese' | 'international' }
     * Response: { bannerUrl: string }
     */
    UPLOAD_BANNER: (id: string) => `${API_BASE_URL}/events/${id}/banners`,

    /**
     * POST /api/v1/events/:id/export-csv
     * Response: Blob (CSV / XLSX download stream)
     */
    EXPORT_CSV: (id: string) => `${API_BASE_URL}/events/${id}/export`,
  },

  // =========================================================================
  // 3. EMPLOYEE REGISTRATIONS & DISTRIBUTION (ADMIN & OPERATOR)
  // =========================================================================
  REGISTRATIONS: {
    /**
     * GET /api/v1/events/:eventId/registrations
     * Query Params: { search?: string, department?: string, status?: string, page?: number, pageSize?: number }
     * Response: PaginatedResult<EmployeeRegistration>
     * Notes: Employee registrations list in Event Detail.
     */
    LIST_BY_EVENT: (eventId: string) => `${API_BASE_URL}/events/${eventId}/registrations`,

    /**
     * PATCH /api/v1/registrations/:id/status
     * Request Body: { status: 'Registered' | 'Received' | 'Pending' | 'Cancelled', note?: string }
     * Response: EmployeeRegistration
     * Notes: Update gift handout fulfillment status when operator dispenses gift.
     */
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/registrations/${id}/status`,

    /**
     * POST /api/v1/events/:eventId/registrations/batch-upload
     * Form-Data: { file: Binary (.xlsx/.csv) }
     * Response: { totalImported: number, errors: string[] }
     * Notes: Bulk upload distribution results from on-site distribution desk.
     */
    BATCH_UPLOAD: (eventId: string) => `${API_BASE_URL}/events/${eventId}/registrations/batch-upload`,
  },

  // =========================================================================
  // 4. OPERATOR / EMPLOYEE GIFT SELECTION & HISTORY
  // =========================================================================
  OPERATOR_GIFTS: {
    /**
     * GET /api/v1/operator/active-registration
     * Response: ActiveRegistration | null
     * Notes: Fetches the user's currently registered gift for ongoing corporate campaign.
     */
    GET_ACTIVE_REGISTRATION: `${API_BASE_URL}/operator/active-registration`,

    /**
     * GET /api/v1/operator/history
     * Response: GiftHistoryRecord[]
     * Notes: History list of all previous gifts received (e.g. Tet 2023, Trung Thu 2022, 8/3).
     */
    GET_HISTORY: `${API_BASE_URL}/operator/history`,

    /**
     * GET /api/v1/operator/available-events
     * Response: CorporateEvent[]
     * Notes: List of events open for registration (e.g., Tet Gift 2024 active vs Q1 Bonus locked).
     */
    GET_AVAILABLE_EVENTS: `${API_BASE_URL}/operator/available-events`,

    /**
     * POST /api/v1/operator/register
     * Request Body: { eventId: string, giftChoiceId: string, deliveryAddress?: string, note?: string }
     * Response: { success: boolean, registrationId: string, confirmationMessage: string }
     * Notes: Submits or updates the user's gift selection.
     */
    SUBMIT_REGISTRATION: `${API_BASE_URL}/operator/register`,
  },

  // =========================================================================
  // 5. INVENTORY & PROCUREMENT MODULE
  // =========================================================================
  INVENTORY: {
    /**
     * GET /api/v1/inventory
     * Query Params: { search?: string, category?: string, status?: string }
     * Response: InventoryItem[]
     */
    LIST: `${API_BASE_URL}/inventory`,

    /**
     * POST /api/v1/inventory
     * Request Body: Omit<InventoryItem, 'id'>
     */
    CREATE: `${API_BASE_URL}/inventory`,

    /**
     * PUT /api/v1/inventory/:id/stock
     * Request Body: { adjustQuantity: number, reason: string }
     */
    UPDATE_STOCK: (id: string) => `${API_BASE_URL}/inventory/${id}/stock`,
  },

  // =========================================================================
  // 6. AUDIENCE & RECIPIENTS MANAGEMENT
  // =========================================================================
  RECIPIENTS: {
    /**
     * GET /api/v1/recipients/groups
     * Response: RecipientGroup[]
     */
    GET_GROUPS: `${API_BASE_URL}/recipients/groups`,

    /**
     * GET /api/v1/recipients/employees
     * Query Params: { search?: string, group?: string, department?: string }
     */
    LIST_EMPLOYEES: `${API_BASE_URL}/recipients/employees`,
  },

  // =========================================================================
  // 7. REPORTS & ANALYTICS MODULE
  // =========================================================================
  REPORTS: {
    /**
     * GET /api/v1/reports/summary
     * Query Params: { year?: number, quarter?: string }
     */
    GET_SUMMARY: `${API_BASE_URL}/reports/summary`,

    /**
     * GET /api/v1/reports/export
     * Query Params: { reportType: 'fulfillment' | 'budget' | 'feedback' }
     */
    EXPORT: `${API_BASE_URL}/reports/export`,
  },
};
