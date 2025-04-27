import express from 'express';
import {authMiddleware } from './middlewares/accountIdChecker';
import battleRouter from './routes/ClientBattleRoutes';
import CardGameAdmin from './suiHandler';
import * as path from 'path';
import suiHandler from './suiHandler';
import { Card } from './BattleSystem';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public'))); // Static file serving for HTML and JS files

app.use(cors());


// JSON body parse middleware (opsiyonel, post yapacaksan lazım)
app.use(express.json());

app.use('/clientget',authMiddleware,async (req,res) => {
  const objects = await suiHandler.client.getOwnedObjects({owner: req.headers['address'] as string,options: { showContent: true,showType: true}});
  res.json(objects);
})

app.use('/create_card',authMiddleware,async (req,res) => {
  const card : Card = {id: "", name: req.body.name, image_url: req.body.image_url, element: req.body.element, level: req.body.level, attack: req.body.attack};
  const result = await CardGameAdmin.createCard(card);
  console.log(result);
  res.json(result);
});

app.use('/api/battle', authMiddleware, battleRouter);



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
