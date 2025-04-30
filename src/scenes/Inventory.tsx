import { useGameStore } from "../state/gameStore";

export default function Inventory() {
  const { inventory } = useGameStore();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">🎒 Inventory</h2>
      {inventory.length === 0 ? (
        <p>Your inventory is empty.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {inventory.map((item, index) => (
            <li key={index}>
              {item.name} ({item.type}
              {item.power ? `, +${item.power}` : ""})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
