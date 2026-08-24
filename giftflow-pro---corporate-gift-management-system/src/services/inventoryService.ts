/**
 * GiftFlow Pro - Inventory & Procurement Service
 */

import request from './request';
import { ENDPOINTS } from './endpoint';
import { InventoryItem } from '../types';

export const inventoryService = {
  async getInventory(params?: { search?: string; category?: string }): Promise<InventoryItem[]> {
    const res = await request.get<InventoryItem[]>(ENDPOINTS.INVENTORY.LIST, { params });
    return res.data;
  },

  async addInventoryItem(payload: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const res = await request.post<InventoryItem>(ENDPOINTS.INVENTORY.CREATE, payload);
    return res.data;
  },

  async updateStock(id: string, adjustQuantity: number, reason: string): Promise<InventoryItem> {
    const res = await request.put<InventoryItem>(ENDPOINTS.INVENTORY.UPDATE_STOCK(id), { adjustQuantity, reason });
    return res.data;
  },
};

export default inventoryService;
