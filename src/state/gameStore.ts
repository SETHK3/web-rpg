import { create } from "zustand";

interface Item {
  id: string;
  name: string;
  type: "weapon" | "armor" | "potion";
  power?: number;
  cost?: number;
}

interface GameState {
  hp: number;
  attack: number;
  gold: number;
  xp: number;
  inventory: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  gainGold: (amount: number) => void;
  setHP: (newHP: number) => void;
  setAttack: (newAttack: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  hp: 10,
  attack: 5,
  gold: 0,
  xp: 0,
  inventory: [],
  addItem: (item) =>
    set((state) => ({ inventory: [...state.inventory, item] })),
  removeItem: (id) =>
    set((state) => ({
      inventory: state.inventory.filter((i) => i.id !== id),
    })),
  gainGold: (amount) => set((state) => ({ gold: state.gold + amount })),
  setHP: (newHP) => set(() => ({ hp: newHP })),
  setAttack: (newAttack) => set(() => ({ attack: newAttack })),
}));
