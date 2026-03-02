import api from './api';
import { Cart } from '@/types/cart';

export const cartService = {
  // Add item: Flag 1 in your SQL
  addToCart: async (data: { userId?: number; sessionId: string; productId: number; variantId: number; qty: number }) => {
    const response = await api.post('/Cart/AddToCart', data);
    return response.data;
  },

  // Update or Remove (Qty 0): Flag 2 in your SQL
  updateItem: async (data: { userId?: number; sessionId: string; productId: number; variantId: number; qty: number }) => {
    const response = await api.post('/Cart/UpdateItem', data);
    return response.data;
  },

  // Get Cart: Flag 3 in your SQL
  getMyCart: async (userId?: number, sessionId?: string) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId.toString());
    if (sessionId) params.append('sessionId', sessionId);
    
    const response = await api.get(`/Cart/GetMyCart?${params.toString()}`);
    return response.data as Cart;
  },
  async mergeCart(userId: number, sessionId: string) {
    const response = await api.post(`/Cart/MergeCart?userId=${userId}&sessionId=${sessionId}`);
    return response.data;
  }
};