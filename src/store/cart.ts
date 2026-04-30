import { create } from "zustand";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type CartLine = MenuItem & { qty: number };

type CartState = {
  items: CartLine[];
  open: boolean;
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  open: false,
  add: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === item.id);
      if (existing)
        return {
          items: s.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      return { items: [...s.items, { ...item, qty: 1 }] };
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  inc: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    })),
  dec: (id) =>
    set((s) => ({
      items: s.items
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    })),
  clear: () => set({ items: [] }),
  setOpen: (v) => set({ open: v }),
  total: () => get().items.reduce((a, i) => a + i.price * i.qty, 0),
  count: () => get().items.reduce((a, i) => a + i.qty, 0),
}));
