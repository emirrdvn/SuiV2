import { Router, Request, Response } from 'express';
import { saveJsonToFile } from '../FileWriter';

const battleRouter = Router();

battleRouter.get('/start/:dungeonId', (req: Request, res: Response) => {
    const dungeonId = req.params['dungeonId'];
    const accountId = req.headers['address'] as string;

    saveJsonToFile(accountId,{
        dungeonId: dungeonId,
        accountId: accountId,
        startTime: new Date().toISOString(),
        attacks: [],
    });


    // Burada battle başlatma işlemleri yapılacak
    // Örnek olarak sadece dungeonId'yi döndürüyoruz
    // TODO burada json dosyası oluşuturp içine log kaydeilecek
    res.status(200).json({ message: `Battle started for dungeon ID: ${dungeonId}`});
});

battleRouter.get('/end/:dungeonId', (req: Request, res: Response) => {
    const dungeonId = req.params['dungeonId'];
    // Burada battle bitirme işlemleri yapılacak
    // Örnek olarak sadece dungeonId'yi döndürüyoruz
    res.json({ message: `Battle ended for dungeon ID: ${dungeonId}` });
}   );



export default battleRouter;
