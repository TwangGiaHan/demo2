/**
 * GiftFlow Pro - HTTP Request Engine & Mock Data Interceptor
 * 
 * Provides typed REST client methods, token authorization headers, error handling,
 * and a robust reactive mock store fallback to enable full prototype interactivity.
 */

import { ApiResponse } from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_INVENTORY,
  INITIAL_GIFT_HISTORY,
  INITIAL_OPERATOR_ACTIVE_GIFT,
  INITIAL_METRICS,
  CURRENT_USER,
} from '../data/mockData';

// Local storage keys for persistent mock testing
const STORAGE_KEYS = {
  EVENTS: 'giftflow_events_v1',
  REGISTRATIONS: 'giftflow_registrations_v1',
  INVENTORY: 'giftflow_inventory_v1',
  GIFT_HISTORY: 'giftflow_gift_history_v1',
  ACTIVE_GIFT: 'giftflow_active_gift_v1',
  METRICS: 'giftflow_metrics_v1',
  AUTH_TOKEN: 'giftflow_auth_token',
};

// Initialize localStorage with initial dataset if empty
export const initializeMockStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GIFT_HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.GIFT_HISTORY, JSON.stringify(INITIAL_GIFT_HISTORY));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_GIFT)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_GIFT, JSON.stringify(INITIAL_OPERATOR_ACTIVE_GIFT));
  }
  if (!localStorage.getItem(STORAGE_KEYS.METRICS)) {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(INITIAL_METRICS));
  }
};

// Call initialization
initializeMockStore();

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  useMock?: boolean;
}

class RequestClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  private getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || 'mock-jwt-token-giftflow-admin';
  }

  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return '';
    const cleanParams: Record<string, string> = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = String(params[key]);
      }
    });
    const query = new URLSearchParams(cleanParams).toString();
    return query ? `?${query}` : '';
  }

  /**
   * Generic request executor with automatic mock handler fallback
   */
  public async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers = {
      ...this.defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // If using real backend server proxy (when available)
    const isLiveBackend = import.meta.env.VITE_USE_LIVE_API === 'true';

    if (isLiveBackend) {
      try {
        const fullUrl = `${url}${this.buildQueryString(options.params)}`;
        const response = await fetch(fullUrl, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        return {
          success: true,
          code: response.status,
          message: 'Success',
          data: json,
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        console.warn('Real backend call failed, falling back to prototype reactive store', err);
      }
    }

    // Default: High-fidelity simulated reactive mock response
    await new Promise((res) => setTimeout(res, 120)); // Subtle 120ms network simulation

    return this.handleMockRequest<T>(method, url, data, options.params);
  }

  public get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  public post<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, options);
  }

  public put<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, options);
  }

  public patch<T>(url: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, options);
  }

  public delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  /**
   * Internal reactive mock database handler
   */
  private handleMockRequest<T>(
    method: string,
    url: string,
    data?: any,
    params?: Record<string, any>
  ): ApiResponse<T> {
    const timestamp = new Date().toISOString();

    // 1. Events list & metrics
    if (url.includes('/events/metrics')) {
      const metrics = JSON.parse(localStorage.getItem(STORAGE_KEYS.METRICS) || JSON.stringify(INITIAL_METRICS));
      const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || JSON.stringify(INITIAL_EVENTS));
      metrics.activeEvents = events.filter((e: any) => e.status === 'Active').length;
      return { success: true, code: 200, message: 'OK', data: metrics as unknown as T, timestamp };
    }

    if (url.endsWith('/events') && method === 'GET') {
      let events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || JSON.stringify(INITIAL_EVENTS));
      if (params?.search) {
        const q = params.search.toLowerCase();
        events = events.filter((e: any) => e.title.toLowerCase().includes(q) || e.code.toLowerCase().includes(q));
      }
      if (params?.status && params.status !== 'All') {
        events = events.filter((e: any) => e.status === params.status);
      }
      return { success: true, code: 200, message: 'OK', data: events as unknown as T, timestamp };
    }

    if (url.endsWith('/events') && method === 'POST') {
      const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || JSON.stringify(INITIAL_EVENTS));
      const newEvent = {
        id: `evt-${Date.now()}`,
        code: `EVT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        targetCount: 1000,
        registeredCount: 0,
        remainingCount: 1000,
        status: 'Active',
        gifts: [
          {
            id: `g-${Date.now()}-1`,
            code: 'A',
            title: 'Gift A: Executive Collection',
            name: 'Executive Collection',
            description: 'Set quà tặng doanh nhân cao cấp.',
            stock: 500,
            claimedCount: 0,
          },
        ],
        createdAt: new Date().toISOString(),
        ...data,
      };
      events.unshift(newEvent);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      return { success: true, code: 201, message: 'Event created successfully', data: newEvent as unknown as T, timestamp };
    }

    // 2. Event detail & registrations
    const eventDetailMatch = url.match(/\/events\/([^/]+)$/);
    if (eventDetailMatch && method === 'GET') {
      const eventId = eventDetailMatch[1];
      const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || JSON.stringify(INITIAL_EVENTS));
      const found = events.find((e: any) => e.id === eventId || e.code === eventId) || events[0];
      return { success: true, code: 200, message: 'OK', data: found as unknown as T, timestamp };
    }

    const eventRegsMatch = url.match(/\/events\/([^/]+)\/registrations$/);
    if (eventRegsMatch && method === 'GET') {
      const eventId = eventRegsMatch[1];
      let regs = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || JSON.stringify(INITIAL_REGISTRATIONS));
      if (params?.search) {
        const q = params.search.toLowerCase();
        regs = regs.filter((r: any) => r.empId.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q));
      }
      return { success: true, code: 200, message: 'OK', data: regs as unknown as T, timestamp };
    }

    // 3. Update registration status
    const updateRegStatusMatch = url.match(/\/registrations\/([^/]+)\/status$/);
    if (updateRegStatusMatch && method === 'PATCH') {
      const regId = updateRegStatusMatch[1];
      const regs = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || JSON.stringify(INITIAL_REGISTRATIONS));
      const target = regs.find((r: any) => r.id === regId || r.empId === regId);
      if (target) {
        target.status = data.status;
        if (data.status === 'Received') {
          target.receivedAt = new Date().toLocaleString();
        }
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(regs));
      }
      return { success: true, code: 200, message: 'Status updated', data: target as unknown as T, timestamp };
    }

    // 4. Operator endpoints
    if (url.includes('/operator/active-registration')) {
      const active = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_GIFT) || JSON.stringify(INITIAL_OPERATOR_ACTIVE_GIFT));
      return { success: true, code: 200, message: 'OK', data: active as unknown as T, timestamp };
    }

    if (url.includes('/operator/history')) {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.GIFT_HISTORY) || JSON.stringify(INITIAL_GIFT_HISTORY));
      return { success: true, code: 200, message: 'OK', data: history as unknown as T, timestamp };
    }

    if (url.includes('/operator/available-events')) {
      const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || JSON.stringify(INITIAL_EVENTS));
      return { success: true, code: 200, message: 'OK', data: events as unknown as T, timestamp };
    }

    if (url.includes('/operator/register') && method === 'POST') {
      const active = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_GIFT) || JSON.stringify(INITIAL_OPERATOR_ACTIVE_GIFT));
      active.selectedGiftId = data.giftChoiceId;
      if (data.giftTitle) active.giftTitle = data.giftTitle;
      if (data.giftDescription) active.giftDescription = data.giftDescription;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GIFT, JSON.stringify(active));

      // Append to history if new
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.GIFT_HISTORY) || JSON.stringify(INITIAL_GIFT_HISTORY));
      history.unshift({
        id: `hist-${Date.now()}`,
        eventName: data.eventTitle || 'Tet Gift 2024',
        giftName: data.giftTitle || 'Gift A: Premium Hamper',
        date: new Date().toLocaleDateString('vi-VN'),
        status: 'Đã nhận',
        details: 'Đã đăng ký thành công qua cổng GiftFlow Pro.',
      });
      localStorage.setItem(STORAGE_KEYS.GIFT_HISTORY, JSON.stringify(history));

      return {
        success: true,
        code: 200,
        message: 'Đăng ký quà tặng thành công!',
        data: { success: true, registrationId: `REG-${Date.now()}` } as unknown as T,
        timestamp,
      };
    }

    // 5. Inventory list
    if (url.includes('/inventory')) {
      const inventory = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY) || JSON.stringify(INITIAL_INVENTORY));
      return { success: true, code: 200, message: 'OK', data: inventory as unknown as T, timestamp };
    }

    // Fallback default
    return {
      success: true,
      code: 200,
      message: 'OK',
      data: data as unknown as T,
      timestamp,
    };
  }
}

export const request = new RequestClient();
export default request;
