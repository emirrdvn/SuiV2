import { Creature, DungeonFactory } from './DungeonFactory';
import { saveJsonToFile } from './FileWriter';
// Import Sui SDK or API client
import { SuiClient } from '@mysten/sui/dist/cjs/client'; // Replace with actual Sui client import

interface BattleState {
    playerAddress: string;
    monster: Creature;
    monsterHealth: number;
    battleLog: Array<{ cardId: string; damage: number }>;
    deck: string[]; // Cards available to the player
}

export class BattleSystem {
    private battles: Map<string, BattleState> = new Map();

    // Start a new battle
    async startBattle(playerAddress: string, dungeonName: string, difficulty: number): Promise<string> {
        const dungeon = await DungeonFactory.createDungeon(dungeonName, difficulty, playerAddress);
        const monster = dungeon.creatures[0]; // Assume one monster for simplicity

        const battleId = `${playerAddress}-${Date.now()}`;
        this.battles.set(battleId, {
            playerAddress,
            monster,
            monsterHealth: monster.health,
            battleLog: [],
            deck: [], // Initialize an empty deck
        });

        saveJsonToFile(playerAddress, battleId, { dungeon, monster });
        return battleId;
    }

    // Fetch a card from Sui and add it to the player's deck
    async fetchCard(battleId: string): Promise<void> {
        const battle = this.battles.get(battleId);
        if (!battle) {
            throw new Error('Battle not found');
        }

        if (battle.deck.length >= 5) {
            throw new Error('Deck is full (maximum 5 cards)');
        }

        const cardId = await this.getCardFromSui(battle.playerAddress);
        if (cardId) {
            battle.deck.push(cardId);
        } else {
            throw new Error('Failed to fetch card from Sui');
        }
    }

    // Process an attack using a card
    attack(battleId: string, cardIndex: number, damage: number): string {
        const battle = this.battles.get(battleId);
        if (!battle) {
            throw new Error('Battle not found');
        }

        if (cardIndex < 0 || cardIndex >= battle.deck.length) {
            throw new Error('Invalid card index');
        }

        const cardId = battle.deck[cardIndex];
        battle.deck.splice(cardIndex, 1); // Remove the used card from the deck

        battle.monsterHealth -= damage;
        battle.battleLog.push({ cardId, damage });

        if (battle.monsterHealth <= 0) {
            battle.monsterHealth = 0;
            return 'Monster defeated!';
        }

        return `Monster health: ${battle.monsterHealth}`;
    }

    // Helper method to fetch a card from Sui
    private async getCardFromSui(playerAddress: string): Promise<string | null> {
        try {
            const suiClient = new SuiClient(); // Initialize Sui client
            const cards = await suiClient.getCards({ owner: playerAddress }); // Replace with actual Sui API call
            if (cards && cards.length > 0) {
                return cards[0].id; // Adjust based on Sui's response structure
            }
            return null;
        } catch (error) {
            console.error('Error fetching card from Sui:', error);
            return null;
        }
    }

    // End the battle
    endBattle(battleId: string): void {
        const battle = this.battles.get(battleId);
        if (!battle) {
            throw new Error('Battle not found');
        }

        saveJsonToFile(battle.playerAddress, `${battleId}-log`, battle.battleLog);
        this.battles.delete(battleId);
    }
}

export default new BattleSystem();