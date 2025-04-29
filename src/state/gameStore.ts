import { create } from "zustand";

interface Item {
  id: string;
  name: string;
  type: "weapon" | "armor" | "potion";
  power?: number;
}

interface GameState {
  hp: number;
  attack: number;
  gold: number;
  xp: number;
  inventory: Item[];
  addItem: (item: Item) => void;
  gainGold: (amount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  hp: 10,
  attack: 5,
  gold: 0,
  xp: 0,
  inventory: [],
  addItem: (item) =>
    set((state) => ({ inventory: [...state.inventory, item] })),
  gainGold: (amount) => set((state) => ({ gold: state.gold + amount })),
}));
