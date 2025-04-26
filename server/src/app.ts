import express from 'express';
import {authMiddleware } from './middlewares/accountIdChecker';
import battleRouter from './routes/ClientBattleRoutes';
import EncrypedStorageService from './Encrypter';
const app = express();
const port = 3000;

// JSON body parse middleware (opsiyonel, post yapacaksan lazım)
app.use(express.json());

app.use('/api/battle', authMiddleware, battleRouter);

app.post('/', (req, res) => {
  const { data } = req.body; // JSON formatında bekliyoruz
  const encrypted = EncrypedStorageService.encrypt(data); // Şifrele
  const decrypted = EncrypedStorageService.decrypt(encrypted); // Çöz
  res.json({ encrypted, decrypted }); // Şifreli ve çözülmüş veriyi döndür
  }); 



// Middleware for handling 404 errors

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
