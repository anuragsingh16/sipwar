import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  weight?: string;
  grind?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; total: number; itemCount: number };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const id = `${item.productId}-${item.weight}-${item.grind}`;
        const existingItem = state.items.find(i => i.id === id);
        if (existingItem) {
          return {
            items: state.items.map(i => i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i)
          };
        }
        return { items: [...state.items, { ...item, id }] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      getTotals: () => {
        const items = get().items;
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        return { subtotal, total: subtotal, itemCount: items.reduce((acc, item) => acc + item.quantity, 0) };
      }
    }),
    {
      name: 'sipwar-cart',
    }
  )
);
