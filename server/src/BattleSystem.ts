import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import CardGameAdmin from './suiHandler';
import suiHandler from './suiHandler';

export interface Card {
    id: string,
    name: string,
    image_url: string,
    element: string,
    level: number,      
    attack: number, 
}



export interface Creature{
    name: string;
    image_url: string;
    level: number; // Level of the monster
    attack: number; // Attack power of the monster
    health: number; // Health points of the monster
}

export interface BattleState {
    playerHealth: number; // Player's health points
    playerAddress: string;
    monster: Creature;
    battleLog: Array<{ cardId: string; damage: number }>;
    currentDeck: Card[]; // Cards available to the player
    allCards: Card[]; // All cards available to the player
}

export class BattleSystem {
    private battles: Map<string, BattleState> = new Map();
    private static monsters: Creature[] = [{ name: "Wolves", level: 1, health: 50, attack: 5, image_url: "assets/monsters/wolves.png" },
        { name: "Armored Ork", level: 2, health: 70, attack: 10, image_url: "assets/monsters/armored_ork.png" },
        { name: "Cave Troll", level: 3, health: 90, attack: 15, image_url: "assets/monsters/cave_troll.png"},
        { name: "Dark Elf Assassin", level: 4, health: 110, attack: 20, image_url: "assets/monsters/dark_elf_assassin.png"},
        { name: "Stone Golem", level: 5, health: 130, attack: 25, image_url: "assets/monsters/stone_golem.png"},
        { name: "Fire Drake", level: 6, health: 150, attack: 30, image_url: "assets/monsters/fire_drake.png"},
        { name: "Necromancer", level: 7, health: 170, attack: 35, image_url: "assets/monsters/necromancer.png" },
        { name: "Shadow Reaper", level: 8, health: 190, attack: 40, image_url: "assets/monsters/shadow_reaper.png"},
        { name: "Ancient Wyvern", level: 9, health: 210, attack: 45, image_url: "assets/monsters/ancient_wyvern.png"},
        { name: "Demon Lord", level: 10, health: 250, attack: 50, image_url: "assets/monsters/demon_lord.png"}]

    public getBattle(userAddress: string): BattleState | undefined {
        return this.battles.get(userAddress);
    }

    // Start a new battle
    async startBattle(playerAddress: string,difficulty: number): Promise<BattleState> {
        const allCards = await CardGameAdmin.getCardFromSui(playerAddress); // Fetch the player's deck from Sui
        
        const monster = this.createMonster(5);
        const battleState: BattleState = {
            playerHealth : 100, // Initial health for the player
            playerAddress,
            monster,
            battleLog: [],
            currentDeck: [],
            allCards: allCards, // Initialize with the player's deck
        }
        battleState.currentDeck = allCards.slice(0, 3); // Initialize with the first 5 cards from the player's deck

        this.battles.set(playerAddress,battleState );



        return battleState;
    }

    // // Fetch a card from Sui and add it to the player's deck
    // async fetchCard(battleId: string): Promise<void> {
    //     const battle = this.battles.get(battleId);
    //     if (!battle) {
    //         throw new Error('Battle not found');
    //     }

    //     if (battle.currentDeck.length >= 5) {
    //         throw new Error('currentDeck is full (maximum 5 cards)');
    //     }

    //     const cardId = await this.getCardFromSui(battle.playerAddress);
    //     if (cardId) {
    //         battle.currentDeck.push(cardId);
    //     } else {
    //         throw new Error('Failed to fetch card from Sui');
    //     }
    // }

    // Get the current card count for a battle
    getCardCount(userAddress: string): number {
        const battle = this.battles.get(userAddress);
        if (!battle) {
            throw new Error('Battle not found');
        }
        return battle.currentDeck.length;
    }

    createMonster(difficulty: number): Creature {
        const monsterIndex = Math.floor(Math.random() * BattleSystem.monsters.length);
        const monster = BattleSystem.monsters[monsterIndex];
        return {
            name: monster.name,
            image_url: monster.image_url,
            level: monster.level + difficulty,
            attack: monster.attack + difficulty * 2, // Increase attack based on difficulty
            health: monster.health + difficulty * 10, // Increase health based on difficulty
        };
    }



}



export default new BattleSystem();

