import { Router, Request, Response } from 'express';
import { DungeonFactory } from '../DungeonFactory';
import { saveJsonToFile } from '../FileWriter';

const battleRouter = Router();

battleRouter.get('/start/:dungeonId', async (req: Request, res: Response) => {
    const dungeonId = req.params['dungeonId'];
    const accountId = req.headers['address'] as string;

    saveJsonToFile(accountId,{
        dungeonId: dungeonId,
        accountId: accountId,
        startTime: new Date().toISOString(),
        attacks: [],
    });


    const address = req.headers['address'] as string | undefined;

    try {
        if (!address) {
            throw new Error('Address header is required');
        }
        const dungeon = await DungeonFactory.createDungeon('Dungeon Name', 10);
        res.status(200).json({ message: `Battle started for dungeon ID: ${dungeonId}`, dungeon});
    } catch (error) {
        res.status(500).json({ 
            message: 'Error starting battle', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
});

battleRouter.get('/end/:dungeonId', (req: Request, res: Response) => {
    const dungeonId = req.params['dungeonId'];
    // Burada battle bitirme işlemleri yapılacak
    // Örnek olarak sadece dungeonId'yi döndürüyoruz
    res.json({ message: `Battle ended for dungeon ID: ${dungeonId}` });
}   );



export default battleRouter;
