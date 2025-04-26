export interface Creature {
    name: string;
    strength: number;
    health: number;
}

export interface Dungeon {
    name: string;
    difficulty: number;
    creatures: Creature[];
}

export class DungeonFactory {
    private static creaturePool: Creature[] = [
        { name: "Goblin", strength: 5, health: 20 },
        { name: "Orc", strength: 10, health: 40 },
        { name: "Troll", strength: 15, health: 60 },
        { name: "Dragon", strength: 25, health: 100 },
        { name: "Skeleton", strength: 7, health: 25 },
        { name: "Zombie", strength: 8, health: 30 },
        { name: "Vampire", strength: 12, health: 50 },
        { name: "Werewolf", strength: 18, health: 70 },
        { name: "Hydra", strength: 20, health: 90 },
        { name: "Demon", strength: 30, health: 120 },
    ];

    public static createDungeon(name: string, difficulty: number): Dungeon {
        const creatures = this.generateCreatures(difficulty);
        return {
            name,
            difficulty,
            creatures,
        };
    }

    private static generateCreatures(difficulty: number): Creature[] {
        const creatures: Creature[] = [];
        let remainingDifficulty = difficulty;

        while (remainingDifficulty > 0) {
            const creature = this.getRandomCreature(remainingDifficulty);
            creatures.push(creature);
            remainingDifficulty -= creature.strength*creature.health/100; // Adjust difficulty based on creature's strength and health
        }

        return creatures;
    }

    private static getRandomCreature(maxStrength: number): Creature {
        const filteredCreatures = this.creaturePool.filter(
            (creature) => creature.strength <= maxStrength
        );
        const randomIndex = Math.floor(Math.random() * filteredCreatures.length);
        return filteredCreatures[randomIndex];
    }
}
