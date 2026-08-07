import { create } from 'zustand';
import * as commerceService from '../../services/commerceService';
import { useAuthStore } from '../auth/useAuthStore';

interface CartState {
  cart: any | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,
  fetchCart: async () => {
    if (!useAuthStore.getState().isAuthenticated) return;
    set({ loading: true });
    try {
      const cart = await commerceService.getCart();
      set({ cart });
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      set({ loading: false });
    }
  },
  addToCart: async (productId: number, quantity: number) => {
    set({ loading: true });
    try {
      const cart = await commerceService.addToCart(productId, quantity);
      set({ cart });
    } catch (error) {
      console.error('Failed to add to cart', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateCartItem: async (itemId: number, quantity: number) => {
    set({ loading: true });
    try {
      const cart = await commerceService.updateCartItem(itemId, quantity);
      set({ cart });
    } catch (error) {
      console.error('Failed to update cart item', error);
    } finally {
      set({ loading: false });
    }
  },
  removeCartItem: async (itemId: number) => {
    set({ loading: true });
    try {
      const cart = await commerceService.removeCartItem(itemId);
      set({ cart });
    } catch (error) {
      console.error('Failed to remove cart item', error);
    } finally {
      set({ loading: false });
    }
  },
  clearCart: async () => {
    set({ loading: true });
    try {
      const cart = await commerceService.clearCart();
      set({ cart });
    } catch (error) {
      console.error('Failed to clear cart', error);
    } finally {
      set({ loading: false });
    }
  }
}));
