import { create } from "zustand";

export type ItemType =
  | "weapon"
  | "armor"
  | "potion"
  | "ring"
  | "amulet"
  | "shield"
  | "head"
  | "legs";

export interface ItemStats {
  attack?: number;
  defense?: number;
  hp?: number;
  magicPower?: number;
  critChance?: number;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  stats: ItemStats;
  cost: number;
  description: string;
  icon: string; // emoji or icon class
}

interface GameState {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  magicPower: number;
  critChance: number;
  gold: number;
  xp: number;
  inventory: Item[];
  equippedItems: Record<ItemType, Item | null>;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  equipItem: (item: Item) => void;
  unequipItem: (type: ItemType) => void;
  gainGold: (amount: number) => void;
  setHP: (newHP: number) => void;
  updateStats: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  hp: 100,
  maxHp: 100,
  attack: 5,
  defense: 0,
  magicPower: 0,
  critChance: 0,
  gold: 0,
  xp: 0,
  inventory: [],
  equippedItems: {
    weapon: null,
    armor: null,
    shield: null,
    ring: null,
    amulet: null,
    potion: null,
    head: null,
    legs: null,
  },
  addItem: (item) =>
    set((state) => ({ inventory: [...state.inventory, item] })),
  removeItem: (id) =>
    set((state) => ({
      inventory: state.inventory.filter((i) => i.id !== id),
    })),
  equipItem: (item) =>
    set((state) => {
      const newEquippedItems = { ...state.equippedItems };
      newEquippedItems[item.type] = item;
      return { equippedItems: newEquippedItems };
    }),
  unequipItem: (type) =>
    set((state) => {
      const newEquippedItems = { ...state.equippedItems };
      newEquippedItems[type] = null;
      return { equippedItems: newEquippedItems };
    }),
  gainGold: (amount) => set((state) => ({ gold: state.gold + amount })),
  setHP: (newHP) => set((state) => ({ hp: Math.min(newHP, state.maxHp) })),
  updateStats: () => {
    const state = get();
    const baseStats = {
      attack: 5,
      defense: 0,
      magicPower: 0,
      critChance: 0,
      maxHp: 100,
    };

    // Calculate total stats from equipped items
    const totalStats = Object.values(state.equippedItems).reduce(
      (acc, item) => {
        if (!item) return acc;
        return {
          attack: (acc.attack || 0) + (item.stats.attack || 0),
          defense: (acc.defense || 0) + (item.stats.defense || 0),
          magicPower: (acc.magicPower || 0) + (item.stats.magicPower || 0),
          critChance: (acc.critChance || 0) + (item.stats.critChance || 0),
          maxHp: (acc.maxHp || 0) + (item.stats.hp || 0),
        };
      },
      baseStats
    );

    set(totalStats);
  },
}));
