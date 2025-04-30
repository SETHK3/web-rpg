import { useGameStore } from "../state/gameStore";
import { useState } from "react";

interface Item {
  id: string;
  name: string;
  type: "weapon" | "armor" | "potion";
  power?: number;
  cost?: number;
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

  const [equippedWeapon, setEquippedWeapon] = useState<Item | null>(null);
  const [equippedArmor, setEquippedArmor] = useState<Item | null>(null);

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
      setEquippedWeapon(item);
      setAttack(5 + (item.power || 0));
    } else if (item.type === "armor") {
      setEquippedArmor(item);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold">🛒 Shop</h2>
        <div className="space-y-2">
          {shopItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} - {item.cost} gold
              </span>
              <button
                onClick={() => handleBuy(item)}
                className="bg-green-500 px-2 py-1 rounded text-white"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold">🎒 Inventory</h2>
        {inventory.length === 0 ? (
          <p>Your inventory is empty.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {inventory.map((item, index) => (
              <li key={index}>
                {item.name} ({item.type}
                {item.power ? `, +${item.power}` : ""})
                <button
                  onClick={() => handleUseItem(item)}
                  className="ml-2 bg-blue-500 px-2 py-1 text-white rounded"
                >
                  Use
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold">🧙 Equipped</h2>
        <p>Weapon: {equippedWeapon ? equippedWeapon.name : "None"}</p>
        <p>Armor: {equippedArmor ? equippedArmor.name : "None"}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold">📊 Stats</h2>
        <p>Gold: {gold}</p>
        <p>HP: {hp}</p>
        <p>Attack: {attack}</p>
      </div>
    </div>
  );
}
