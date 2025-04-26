import { SuiClient } from '@mysten/sui/dist/cjs/client';
import {server_sui_adress} from './variables'; // Import the server Sui address

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
    private static suiClient = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

    public static async createDungeon(name: string, difficulty: number): Promise<Dungeon> {
        const creatures = await this.generateCreatures(difficulty);
        return {
            name,
            difficulty,
            creatures,
        };
    }

    private static async generateCreatures(difficulty: number): Promise<Creature[]> {
        const creatures: Creature[] = [];
        let remainingDifficulty = difficulty;

        const availableCreatures = await this.fetchCreaturesFromSui();

        while (remainingDifficulty > 0 && availableCreatures.length > 0) {
            const creature = this.getRandomCreature(availableCreatures, remainingDifficulty);
            creatures.push(creature);
            remainingDifficulty -= creature.strength * creature.health / 100; // Adjust difficulty based on creature's strength and health
        }

        return creatures;
    }

    private static getRandomCreature(creatures: Creature[], maxStrength: number): Creature {
        const filteredCreatures = creatures.filter(
            (creature) => creature.strength <= maxStrength
        );
        const randomIndex = Math.floor(Math.random() * filteredCreatures.length);
        return filteredCreatures[randomIndex];
    }

    private static async fetchCreaturesFromSui(): Promise<Creature[]> {
        try {
            const response = await this.suiClient.getOwnedObjects({ owner: server_sui_adress }); // Replace with the actual Sui API call
            return response.data.map((obj: any) => ({
                name: obj.name,
                strength: obj.strength,
                health: obj.health,
            }));
        } catch (error) {
            console.error('Error fetching creatures from Sui:', error);
            return [];
        }
    }
}
