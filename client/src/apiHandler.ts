export interface BattleStart {
    playerHealth: number;
    monster: Creature;
    currentDeck: Card[];
};

export interface Card {
    id: string,
    name: string,
    image_url: string,
    element: string,
    level: number,      
    attack: number, 
}

export interface AttackResponse {
    win: boolean;
    message: string;
    currentDeck: Card[];
    monster: Creature; 
    playerHealth: number; 
};

export interface Creature{
    name: string;
    image_url: string;
    level: number; // Level of the monster
    attack: number; // Attack power of the monster
    health: number; // Health points of the monster
}

export const serverIP = "http://localhost:3000";
class apiHandler{
    async startBattle(playerAddress: string): Promise<BattleStart> {
        const response = await fetch(`${serverIP}/api/battle/start`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'address': playerAddress,
            },
        });

        return (await response.json()) as BattleStart;
    }

    async attack(playerAddress: string, usedCards: number[]): Promise<AttackResponse> {
        const response = await fetch(`${serverIP}/api/battle/attack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'address': playerAddress,
            },
            body: JSON.stringify({ usedCards }),
        });

        return (await response.json()) as AttackResponse;
    }
} 

export default new apiHandler();