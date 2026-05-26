/**
 * Zustand cart store
 *
 * Zustand is a lightweight state management library.
 * The cart persists to localStorage so it survives page refreshes.
 *
 * State:
 *   - items: array of cart items with quantity
 *   - isOpen: whether the cart drawer is visible
 *
 * Actions:
 *   - addItem: add dish or increment quantity if already in cart
 *   - removeItem: remove one unit; delete if quantity reaches 0
 *   - clearCart: empty the cart (called after successful payment)
 *   - setOpen: toggle the cart drawer
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dish } from '@/types/menu';
import { poundsToPence } from '@/utils/formatPrice';

export interface CartItem {
  id: string;
  name: string;
  price: number; // stored in pence in the cart
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (dish: Dish) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (dish: Dish) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === dish._id);
          if (existing) {
            // Already in cart — just increment quantity
            return {
              items: state.items.map((item) =>
                item.id === dish._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          // New item — add to cart
          return {
            items: [
              ...state.items,
              {
                id: dish._id,
                name: dish.name,
                price: poundsToPence(dish.price),
                quantity: 1,
                image: dish.image,
              },
            ],
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setOpen: (open: boolean) => set({ isOpen: open }),

      // Derived values as functions (not stored state)
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'mfg-cart', // localStorage key
    }
  )
);