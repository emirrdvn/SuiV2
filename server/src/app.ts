import express from 'express';
import {authMiddleware } from './middlewares/accountIdChecker';
import router from './routes/ClientBattleRoutes';
const app = express();
const port = 3000;

// JSON body parse middleware (opsiyonel, post yapacaksan lazım)
app.use(express.json());

app.use('/api', authMiddleware, router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
