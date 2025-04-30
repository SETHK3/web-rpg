import { useGameStore, Item, ItemType } from "../state/gameStore";
import { useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const RARITY_COLORS = {
  common: "text-gray-200",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

interface DraggableItemProps {
  item: Item;
  onUse: (item: Item) => void;
}

function DraggableItem({ item, onUse }: DraggableItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      className={`w-full h-full flex items-center justify-center cursor-move ${
        isDragging ? "opacity-50" : ""
      } ${RARITY_COLORS[item.rarity]}`}
      title={`${item.name}\n${item.description}\n\n${Object.entries(item.stats)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")}`}
    >
      <div className="text-center">
        <div>{item.icon}</div>
        <div className="text-xs mt-1">{item.name.slice(0, 3)}</div>
      </div>
    </div>
  );
}

interface EquipmentSlotProps {
  type: ItemType;
  item: Item | null;
  onDrop: (item: Item) => void;
}

function EquipmentSlot({ type, item, onDrop }: EquipmentSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { unequipItem } = useGameStore();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (droppedItem: Item) => onDrop(droppedItem),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drop(ref);

  return (
    <div
      ref={ref}
      className={`w-16 h-16 border-2 ${
        isOver ? "border-yellow-400" : "border-gray-600"
      } rounded flex items-center justify-center ${
        item ? RARITY_COLORS[item.rarity] : ""
      }`}
      title={
        item
          ? `${item.name}\n${item.description}\n\n${Object.entries(item.stats)
              .filter(([_, value]) => value)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")}\n\nRight-click to unequip`
          : type
      }
      onContextMenu={(e) => {
        e.preventDefault();
        if (item) {
          unequipItem(type);
        }
      }}
    >
      {item ? (
        <div className="text-center">
          <div>{item.icon}</div>
          <div className="text-xs mt-1">{item.name.slice(0, 3)}</div>
        </div>
      ) : (
        type
      )}
    </div>
  );
}

export default function RPGFeatures() {
  const {
    inventory,
    addItem,
    hp,
    maxHp,
    attack,
    defense,
    magicPower,
    critChance,
    gold,
    equippedItems,
    equipItem,
    gainGold,
    setHP,
    updateStats,
  } = useGameStore();

  useEffect(() => {
    updateStats();
  }, [equippedItems, updateStats]);

  const shopItems: Item[] = [
    {
      id: "sword1",
      name: "Iron Sword",
      type: "weapon",
      rarity: "common",
      stats: { attack: 2 },
      cost: 10,
      description: "A basic iron sword",
      icon: "⚔️",
    },
    {
      id: "armor1",
      name: "Leather Armor",
      type: "armor",
      rarity: "common",
      stats: { defense: 2 },
      cost: 10,
      description: "Basic leather armor",
      icon: "🛡️",
    },
    {
      id: "ring1",
      name: "Magic Ring",
      type: "ring",
      rarity: "uncommon",
      stats: { magicPower: 3 },
      cost: 15,
      description: "A ring imbued with magical power",
      icon: "💍",
    },
    {
      id: "amulet1",
      name: "Lucky Charm",
      type: "amulet",
      rarity: "rare",
      stats: { critChance: 5 },
      cost: 20,
      description: "Increases your critical hit chance",
      icon: "📿",
    },
    {
      id: "potion1",
      name: "Health Potion",
      type: "potion",
      rarity: "common",
      stats: { hp: 20 },
      cost: 5,
      description: "Restores 20 HP",
      icon: "🧪",
    },
  ];

  const handleBuy = (item: Item) => {
    if (gold >= item.cost) {
      addItem(item);
      gainGold(-item.cost);
    } else {
      alert("Not enough gold!");
    }
  };

  const handleUseItem = (item: Item) => {
    if (item.type === "potion") {
      setHP(hp + (item.stats.hp || 0));
    } else {
      equipItem(item);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 bg-gray-900 text-white min-h-screen">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
          {/* Left side - Equipment and Stats */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-bold mb-4">⚔️ Equipment</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-start-2">
                  <EquipmentSlot
                    type="amulet"
                    item={equippedItems.amulet}
                    onDrop={handleUseItem}
                  />
                </div>
                <div className="col-start-2">
                  <EquipmentSlot
                    type="head"
                    item={equippedItems.head}
                    onDrop={handleUseItem}
                  />
                </div>
                <div className="col-start-1">
                  <EquipmentSlot
                    type="weapon"
                    item={equippedItems.weapon}
                    onDrop={handleUseItem}
                  />
                </div>
                <div className="col-start-2">
                  <EquipmentSlot
                    type="armor"
                    item={equippedItems.armor}
                    onDrop={handleUseItem}
                  />
                </div>
                <div className="col-start-3">
                  <EquipmentSlot
                    type="shield"
                    item={equippedItems.shield}
                    onDrop={handleUseItem}
                  />
                </div>
                <div className="col-start-1">
                  <EquipmentSlot
                    type="ring"
                    item={equippedItems.ring}
                    onDrop={handleUseItem}
                  />
                </div>
                <div className="col-start-2">
                  <EquipmentSlot
                    type="legs"
                    item={equippedItems.legs}
                    onDrop={handleUseItem}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-bold mb-4">📊 Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    HP: {hp}/{maxHp}
                  </p>
                  <p>Attack: {attack}</p>
                  <p>Defense: {defense}</p>
                </div>
                <div>
                  <p>Magic: {magicPower}</p>
                  <p>Crit: {critChance}%</p>
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
                      className="w-12 h-12 border-2 border-gray-600 rounded"
                    >
                      {item && (
                        <DraggableItem item={item} onUse={handleUseItem} />
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
                    <span className={RARITY_COLORS[item.rarity]}>
                      {item.icon} {item.name} - {item.cost} gold
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
    </DndProvider>
  );
}
