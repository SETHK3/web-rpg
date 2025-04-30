import { useState } from "react";
import { useGameStore } from "../state/gameStore";

interface Monster {
  name: string;
  hp: number;
  attack: number;
  rewardGold: number;
  rewardXP: number;
}

const monsters: Monster[] = [
  { name: "Goblin", hp: 6, attack: 2, rewardGold: 5, rewardXP: 3 },
  { name: "Wolf", hp: 10, attack: 3, rewardGold: 10, rewardXP: 5 },
  { name: "Troll", hp: 18, attack: 4, rewardGold: 20, rewardXP: 10 },
];

export default function Combat() {
  const { hp, attack, gainGold, addItem } = useGameStore();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [playerHP, setPlayerHP] = useState(hp);
  const [monsterHP, setMonsterHP] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const startCombat = (selected: Monster) => {
    setMonster({ ...selected });
    setMonsterHP(selected.hp);
    setPlayerHP(hp);
    setLog([`You encountered a ${selected.name}!`]);
  };

  const attackMonster = () => {
    if (!monster) return;

    const newMonsterHP = monsterHP - attack;
    const newPlayerHP = playerHP - monster.attack;

    setMonsterHP(newMonsterHP);
    setPlayerHP(newPlayerHP);

    const newLog = [
      ...log,
      `You hit the ${monster.name} for ${attack} damage.`,
    ];

    if (newMonsterHP <= 0) {
      gainGold(monster.rewardGold);
      newLog.push(
        `You defeated the ${monster.name} and earned ${monster.rewardGold} gold!`
      );
      setMonster(null);
    } else {
      newLog.push(`The ${monster.name} hits you for ${monster.attack} damage.`);
    }

    if (newPlayerHP <= 0) {
      newLog.push("You were defeated... back to town!");
      setMonster(null);
    }

    setLog(newLog);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">⚔️ Combat</h2>
      {!monster && (
        <div className="space-y-2">
          <p>Select a monster to fight:</p>
          {monsters.map((m) => (
            <button
              key={m.name}
              onClick={() => startCombat(m)}
              className="p-2 border rounded hover:bg-gray-100"
            >
              {m.name}
            </button>
          ))}
        </div>
      )}
      {monster && (
        <div className="mt-4">
          <p>
            🧟 {monster.name}: {monsterHP} HP
          </p>
          <p>🧍 You: {playerHP} HP</p>
          <button
            onClick={attackMonster}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Attack
          </button>
        </div>
      )}
      <div className="mt-4 bg-gray-100 p-2 rounded h-40 overflow-y-scroll">
        {log.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
