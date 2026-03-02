import { create } from 'zustand';
import { Cart, CartItem } from '@/types/cart';
import { cartService } from '@/services/cart.service';

interface CartState {
  cart: Cart | null;
  fetchCart: (userId?: number, sessionId?: string) => Promise<void>;
  addItem: (item: any) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  fetchCart: async (userId, sessionId) => {
    if (!userId && !sessionId) return;
    const data = await cartService.getMyCart(userId, sessionId);
    set({ cart: data });
  },
  addItem: async (item) => {
    const res = await cartService.addToCart(item);
    if (res.status === 1) {
      // Re-fetch to get updated totals from SQL
      const data = await cartService.getMyCart(item.userId, item.sessionId);
      set({ cart: data });
    }
  }
}));