import { Router, Request, Response } from 'express';

const router = Router();

router.get('/start-battle/{dungeon-id}', (req: Request, res: Response) => {
    const dungeonId = req.params['dungeon-id'];
    // Burada battle başlatma işlemleri yapılacak
    // Örnek olarak sadece dungeonId'yi döndürüyoruz
    res.json({ message: `Battle started for dungeon ID: ${dungeonId}` });
});



export default router;
