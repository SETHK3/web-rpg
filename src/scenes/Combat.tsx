import { useState } from "react";
import { useGameStore } from "../state/gameStore";

interface Monster {
  name: string;
  hp: number;
  attack: number;
  rewardGold: number;
  rewardXP: number;
  drops?: Array<{
    chance: number;
    item: {
      id: string;
      name: string;
      type: "weapon" | "armor" | "potion";
      rarity: "common" | "uncommon" | "rare";
      stats: { attack?: number; defense?: number; hp?: number };
      cost: number;
      description: string;
      icon: string;
    };
  }>;
}

const monsters: Monster[] = [
  {
    name: "Goblin",
    hp: 6,
    attack: 2,
    rewardGold: 5,
    rewardXP: 3,
    drops: [
      {
        chance: 0.3,
        item: {
          id: "rusty_dagger",
          name: "Rusty Dagger",
          type: "weapon",
          rarity: "common",
          stats: { attack: 1 },
          cost: 3,
          description: "A worn-out dagger",
          icon: "🗡️",
        },
      },
    ],
  },
  {
    name: "Wolf",
    hp: 10,
    attack: 3,
    rewardGold: 10,
    rewardXP: 5,
    drops: [
      {
        chance: 0.2,
        item: {
          id: "wolf_pelt",
          name: "Wolf Pelt",
          type: "armor",
          rarity: "common",
          stats: { defense: 1 },
          cost: 5,
          description: "A warm wolf pelt",
          icon: "🦊",
        },
      },
    ],
  },
  {
    name: "Troll",
    hp: 18,
    attack: 4,
    rewardGold: 20,
    rewardXP: 10,
    drops: [
      {
        chance: 0.1,
        item: {
          id: "troll_club",
          name: "Troll Club",
          type: "weapon",
          rarity: "uncommon",
          stats: { attack: 3 },
          cost: 15,
          description: "A heavy club taken from a troll",
          icon: "🏑",
        },
      },
    ],
  },
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

      // Handle item drops
      if (monster.drops) {
        monster.drops.forEach((drop) => {
          if (Math.random() < drop.chance) {
            addItem(drop.item);
            newLog.push(`You found a ${drop.item.name}!`);
          }
        });
      }

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
