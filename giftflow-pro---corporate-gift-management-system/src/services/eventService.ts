/**
 * GiftFlow Pro - Corporate Events Service
 * Handles CRUD operations, metrics querying, CSV exports, and campaign filtering.
 */

import request from './request';
import { ENDPOINTS } from './endpoint';
import { CorporateEvent, DashboardMetrics, EventFilterParams, EmployeeRegistration } from '../types';

export const eventService = {
  /**
   * Retrieves summary statistics for the Admin Dashboard
   */
  async getMetrics(): Promise<DashboardMetrics> {
    const res = await request.get<DashboardMetrics>(ENDPOINTS.EVENTS.METRICS);
    return res.data;
  },

  /**
   * Fetches paginated/filtered list of corporate gift events
   */
  async getEvents(params?: EventFilterParams): Promise<CorporateEvent[]> {
    const res = await request.get<CorporateEvent[]>(ENDPOINTS.EVENTS.LIST, { params });
    return res.data;
  },

  /**
   * Fetches single event by ID or code
   */
  async getEventById(id: string): Promise<CorporateEvent> {
    const res = await request.get<CorporateEvent>(ENDPOINTS.EVENTS.DETAIL(id));
    return res.data;
  },

  /**
   * Creates a new corporate gift event
   */
  async createEvent(payload: Partial<CorporateEvent>): Promise<CorporateEvent> {
    const res = await request.post<CorporateEvent>(ENDPOINTS.EVENTS.CREATE, payload);
    return res.data;
  },

  /**
   * Updates an existing corporate event
   */
  async updateEvent(id: string, payload: Partial<CorporateEvent>): Promise<CorporateEvent> {
    const res = await request.put<CorporateEvent>(ENDPOINTS.EVENTS.UPDATE(id), payload);
    return res.data;
  },

  /**
   * Deletes an event
   */
  async deleteEvent(id: string): Promise<boolean> {
    const res = await request.delete<{ success: boolean }>(ENDPOINTS.EVENTS.DELETE(id));
    return res.success;
  },

  /**
   * Fetches registrations for a specific event
   */
  async getEventRegistrations(eventId: string, search?: string): Promise<EmployeeRegistration[]> {
    const res = await request.get<EmployeeRegistration[]>(ENDPOINTS.REGISTRATIONS.LIST_BY_EVENT(eventId), {
      params: { search },
    });
    return res.data;
  },

  /**
   * Updates registration distribution status (e.g. mark as 'Received' or 'Registered')
   */
  async updateRegistrationStatus(registrationId: string, status: 'Registered' | 'Received' | 'Pending'): Promise<EmployeeRegistration> {
    const res = await request.patch<EmployeeRegistration>(ENDPOINTS.REGISTRATIONS.UPDATE_STATUS(registrationId), { status });
    return res.data;
  },

  /**
   * Exports employee registration list as CSV
   */
  async exportEventCsv(eventId: string, eventTitle: string): Promise<void> {
    // Generate browser download for CSV
    const regs = await this.getEventRegistrations(eventId);
    const headers = 'Employee ID,Full Name,Department,Gift Choice,Status,Registered Date\n';
    const rows = regs
      .map((r) => `"${r.empId}","${r.name}","${r.department}","${r.giftChoiceName || 'Not Selected'}","${r.status}","${r.registeredAt || ''}"`)
      .join('\n');
    const blob = new Blob([`\uFEFF${headers}${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle.replace(/[^a-z0-9]/gi, '_')}_Registrations.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};

export default eventService;
