import { Router, Request, Response } from 'express';

const battleRouter = Router();

battleRouter.get('/start/:dungeonId', (req: Request, res: Response) => {
    const dungeonId = req.params['dungeonId'];
    // Burada battle başlatma işlemleri yapılacak
    // Örnek olarak sadece dungeonId'yi döndürüyoruz
    // TODO burada json dosyası oluşuturp içine log kaydeilecek
    res.json({ message: `Battle started for dungeon ID: ${dungeonId}` });
});

battleRouter.get('/end/:dungeonId', (req: Request, res: Response) => {
    const dungeonId = req.params['dungeonId'];
    // Burada battle bitirme işlemleri yapılacak
    // Örnek olarak sadece dungeonId'yi döndürüyoruz
    res.json({ message: `Battle ended for dungeon ID: ${dungeonId}` });
}   );



export default battleRouter;
