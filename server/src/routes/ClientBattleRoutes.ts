import { Router, Request, Response } from 'express';
import BattleSystem, { BattleState,  Card, Creature } from '../BattleSystem';

const battleRouter = Router();

battleRouter.get('/start', async (req: Request, res: Response) => {
    const accountId = req.headers['address'] as string;
    const currentState = await BattleSystem.startBattle(accountId, Math.random() * 10);

    res.status(200).json({
        playerHealth: currentState.playerHealth,
        monster: currentState.monster,
        currentDeck: currentState.currentDeck,
    });

});


type AttackResponse = {
    win: boolean;
    message: string;
    currentDeck: Card[];
    monster: Creature; 
    playerHealth: number; 
};

battleRouter.post('/attack', async (req: Request, res: Response) => {
    const cardIds : number[] = req.body.usedCards;
    const accountId = req.headers['address'] as string;
    const currentBattle = BattleSystem.getBattle(accountId) as BattleState;

    const cards: Card[] = [];
    const remainingCards: Card[] = [];

    cardIds.forEach((cardIndex) => {
        const card = currentBattle.currentDeck[cardIndex];
        if (card) {
            cards.push(card);
        } else {
            remainingCards.push(card);
        }
    });

    if (!currentBattle) {
        res.status(404).json({ message: 'No active battle found for this account.' });
    }
    cards.forEach((card) => {
        currentBattle.monster.health -= card.attack;
    });

    currentBattle.currentDeck = remainingCards;
    currentBattle.currentDeck.push(currentBattle.allCards[Math.floor(Math.random() * currentBattle.allCards.length)]); // Add a new random card from allCards

    // let isAllAllCardsSameType = false;
    // const firstCardType = cards[0]?.element;
    // for(const card of cards) {

    // }

    let response: AttackResponse;

    if (currentBattle.monster.health <= 0) {
        response = {
            win: true,
            message: 'You defeated the monster!',
            currentDeck: currentBattle.currentDeck,
            monster: currentBattle.monster,
            playerHealth: currentBattle.playerHealth,
        };
    }else if(currentBattle.playerHealth <= 0) {
        response = {
            win: false,
            message: 'You were defeated by the monster!',
            currentDeck: currentBattle.currentDeck,
            monster: currentBattle.monster,
            playerHealth: currentBattle.playerHealth,
        };
    } else {
        response = {
            win: false,
            message: 'The battle continues!',
            currentDeck: currentBattle.currentDeck,
            monster: currentBattle.monster,
            playerHealth: currentBattle.playerHealth,
        };
    }
    
});


export default battleRouter;
