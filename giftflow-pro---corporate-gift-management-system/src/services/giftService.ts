/**
 * GiftFlow Pro - Operator & Employee Gift Service
 * Handles user's active registration retrieval, history tracking, available event catalogs, and gift claiming.
 */

import request from './request';
import { ENDPOINTS } from './endpoint';
import { ActiveRegistration, GiftHistoryRecord, CorporateEvent } from '../types';

export const giftService = {
  /**
   * Retrieves user's currently registered active gift
   */
  async getActiveRegistration(): Promise<ActiveRegistration> {
    const res = await request.get<ActiveRegistration>(ENDPOINTS.OPERATOR_GIFTS.GET_ACTIVE_REGISTRATION);
    return res.data;
  },

  /**
   * Retrieves full chronological gift history for the logged in operator/employee
   */
  async getGiftHistory(): Promise<GiftHistoryRecord[]> {
    const res = await request.get<GiftHistoryRecord[]>(ENDPOINTS.OPERATOR_GIFTS.GET_HISTORY);
    return res.data;
  },

  /**
   * Retrieves events available for the user to register
   */
  async getAvailableEvents(): Promise<CorporateEvent[]> {
    const res = await request.get<CorporateEvent[]>(ENDPOINTS.OPERATOR_GIFTS.GET_AVAILABLE_EVENTS);
    return res.data;
  },

  /**
   * Submits or modifies gift registration
   */
  async submitGiftSelection(payload: {
    eventId: string;
    giftChoiceId: string;
    eventTitle?: string;
    giftTitle?: string;
    giftDescription?: string;
  }): Promise<{ success: boolean; registrationId: string }> {
    const res = await request.post<{ success: boolean; registrationId: string }>(
      ENDPOINTS.OPERATOR_GIFTS.SUBMIT_REGISTRATION,
      payload
    );
    return res.data;
  },
};

export default giftService;
