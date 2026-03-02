// src/services/order.service.ts
import api from './api';
import { OrderRequest, OrderTrackResponse, OrderHistoryItem } from '@/types/order';

const ENDPOINT = '/Order';

export const orderService = {
  async placeOrder(data: OrderRequest) {
    const response = await api.post(`${ENDPOINT}/PlaceOrder`, data);
    return response.data;
  },

  async getTrackOrder(orderNo: string): Promise<{ status: number; data: OrderTrackResponse }> {
    const response = await api.get(`${ENDPOINT}/GetTrackOrder/${orderNo}`);
    return response.data;
  },

  async getMyOrders(userId: number | null, sessionId: string): Promise<{ status: number; data: OrderHistoryItem[] }> {
    const response = await api.get(`${ENDPOINT}/GetMyOrders`, {
      params: { userId: userId || 0, sessionId }
    });
    return response.data;
  }
};