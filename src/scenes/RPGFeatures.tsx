import { useGameStore } from "../state/gameStore";
import { useState } from "react";

interface Item {
  id: string;
  name: string;
  type: "weapon" | "armor" | "potion";
  power?: number;
  cost?: number;
}

interface EquipmentSlot {
  type: "head" | "chest" | "legs" | "weapon" | "shield";
  item: Item | null;
}

export default function RPGFeatures() {
  const {
    inventory,
    addItem,
    hp,
    attack,
    gainGold,
    gold,
    setHP,
    setAttack,
    removeItem,
  } = useGameStore();

  const shopItems: Item[] = [
    { id: "sword1", name: "Iron Sword", type: "weapon", power: 2, cost: 10 },
    { id: "armor1", name: "Leather Armor", type: "armor", power: 2, cost: 10 },
    { id: "potion1", name: "Health Potion", type: "potion", cost: 5 },
  ];

  const [equipmentSlots, setEquipmentSlots] = useState<EquipmentSlot[]>([
    { type: "head", item: null },
    { type: "chest", item: null },
    { type: "legs", item: null },
    { type: "weapon", item: null },
    { type: "shield", item: null },
  ]);

  const handleBuy = (item: Item) => {
    if (gold >= (item.cost || 0)) {
      addItem(item);
      gainGold(-(item.cost || 0));
    } else {
      alert("Not enough gold!");
    }
  };

  const handleUseItem = (item: Item) => {
    if (item.type === "potion") {
      setHP(hp + 5);
      removeItem(item.id);
    } else if (item.type === "weapon") {
      const newSlots = [...equipmentSlots];
      const weaponSlot = newSlots.find((slot) => slot.type === "weapon");
      if (weaponSlot) {
        weaponSlot.item = item;
        setEquipmentSlots(newSlots);
        setAttack(5 + (item.power || 0));
      }
    } else if (item.type === "armor") {
      const newSlots = [...equipmentSlots];
      const armorSlot = newSlots.find((slot) => slot.type === "chest");
      if (armorSlot) {
        armorSlot.item = item;
        setEquipmentSlots(newSlots);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
        {/* Left side - Equipment and Stats */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">⚔️ Equipment</h2>
            <div className="grid grid-cols-3 gap-2">
              {/* Equipment slots grid */}
              <div className="col-start-2">
                <div className="w-16 h-16 border-2 border-gray-600 rounded flex items-center justify-center">
                  {equipmentSlots.find((slot) => slot.type === "head")?.item
                    ?.name || "Head"}
                </div>
              </div>
              <div className="col-start-1">
                <div className="w-16 h-16 border-2 border-gray-600 rounded flex items-center justify-center">
                  {equipmentSlots.find((slot) => slot.type === "weapon")?.item
                    ?.name || "Weapon"}
                </div>
              </div>
              <div className="col-start-2">
                <div className="w-16 h-16 border-2 border-gray-600 rounded flex items-center justify-center">
                  {equipmentSlots.find((slot) => slot.type === "chest")?.item
                    ?.name || "Chest"}
                </div>
              </div>
              <div className="col-start-3">
                <div className="w-16 h-16 border-2 border-gray-600 rounded flex items-center justify-center">
                  {equipmentSlots.find((slot) => slot.type === "shield")?.item
                    ?.name || "Shield"}
                </div>
              </div>
              <div className="col-start-2">
                <div className="w-16 h-16 border-2 border-gray-600 rounded flex items-center justify-center">
                  {equipmentSlots.find((slot) => slot.type === "legs")?.item
                    ?.name || "Legs"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">📊 Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>HP: {hp}</p>
                <p>Attack: {attack}</p>
                <p>Gold: {gold}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Inventory and Shop */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">🎒 Inventory</h2>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 20 }).map((_, index) => {
                const item = inventory[index];
                return (
                  <div
                    key={index}
                    className="w-12 h-12 border-2 border-gray-600 rounded flex items-center justify-center text-xs p-1"
                    title={item?.name}
                  >
                    {item && (
                      <button
                        onClick={() => handleUseItem(item)}
                        className="w-full h-full flex items-center justify-center"
                      >
                        {item.name.slice(0, 3)}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-4">🛒 Shop</h2>
            <div className="space-y-2">
              {shopItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {item.name} - {item.cost} gold
                  </span>
                  <button
                    onClick={() => handleBuy(item)}
                    className="bg-green-600 px-2 py-1 rounded hover:bg-green-500"
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
