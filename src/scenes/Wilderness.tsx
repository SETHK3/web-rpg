import Combat from "./Combat";

export default function Wilderness() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🌲 Wilderness</h1>
      <p>Fight monsters, gain loot and XP!</p>
      <Combat />
    </div>
  );
}
