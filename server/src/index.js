const express = require('express');
const { SuiClient, getFullnodeUrl, verifyPersonalMessage } = require('@mysten/sui.js');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
const JWT_SECRET = 'your-secret-key';
const MODULE_ADDRESS = '0x{your_module_address}'; // Move modül adresinizi buraya ekleyin

// Geçici savaş verileri (üretimde veritabanı kullanın)
const battles = {};

// Kimlik doğrulama
app.post('/api/login', async (req, res) => {
  const { address, nonce, signature } = req.body;

  try {
    const isValid = await verifyPersonalMessage(Buffer.from(nonce), signature, address);
    if (!isValid) {
      return res.status(401).json({ error: 'Geçersiz imza' });
    }

    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Doğrulama hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Token doğrulama middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token eksik' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Geçersiz token' });
    req.address = decoded.address;
    next();
  });
};

// Envanter sorgulama
app.get('/api/inventory', authenticate, async (req, res) => {
  try {
    const address = req.address;

    const playerObjects = await suiClient.getOwnedObjects({
      owner: address,
      filter: { StructType: `${MODULE_ADDRESS}::core::Player` },
    });

    if (!playerObjects.data.length) {
      return res.status(404).json({ error: 'Oyuncu bulunamadı' });
    }

    const playerId = playerObjects.data[0].data.objectId;
    const player = await suiClient.getObject({
      id: playerId,
      options: { showContent: true },
    });

    const cardIds = player.data.content.fields.cards;
    const cards = await Promise.all(
      cardIds.map(async (cardId) => {
        const card = await suiClient.getObject({
          id: cardId,
          options: { showContent: true },
        });
        return {
          id: cardId,
          type: card.data.content.fields.type,
          power: card.data.content.fields.power,
        };
      })
    );

    res.json({
      player: {
        id: playerId,
        status: player.data.content.fields.status,
      },
      cards,
    });
  } catch (error) {
    console.error('Envanter sorgulama hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Varsayılan canavar (test için)
app.get('/api/monster', async (req, res) => {
  try {
    // Test için sabit bir canavar
    res.json({
      id: '0xmock_monster_id',
      health: 100,
      power: 20,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Savaş başlatma
app.post('/api/start_battle', authenticate, (req, res) => {
  const { player_address, monster_id } = req.body;
  const battle_id = `battle_${Math.random().toString(36).substring(2)}`;

  battles[battle_id] = {
    player_address,
    monster_id,
    attacks: [],
    monster_health: 100, // Varsayılan canavar canı
  };

  res.json({ battle_id });
});

// Saldırı kaydetme
app.post('/api/attack', authenticate, (req, res) => {
  const { battle_id, card_id, damage, timestamp } = req.body;

  if (!battles[battle_id]) {
    return res.status(404).json({ error: 'Savaş bulunamadı' });
  }

  battles[battle_id].attacks.push({ card: card_id, damage, timestamp });
  battles[battle_id].monster_health = Math.max(0, battles[battle_id].monster_health - damage);

  res.json({ monster_health: battles[battle_id].monster_health });
});

// Savaş bitirme ve Sui'ye kaydetme
app.post('/api/end_battle', authenticate, async (req, res) => {
  const { battle_id, outcome } = req.body;

  if (!battles[battle_id]) {
    return res.status(404).json({ error: 'Savaş bulunamadı' });
  }

  const battle = battles[battle_id];

  try {
    // Sunucunun bir admin cüzdanı ile işlem yapması gerekiyor
    // Bu örnekte, işlem detayları basitleştirildi
    // Gerçek uygulamada, sunucunun Sui cüzdanı ile transaction oluşturması gerekir
    console.log('Suiye kaydediliyor:', {
      player: battle.player_address,
      monster: battle.monster_id,
      attacks: battle.attacks,
      timestamp: Math.floor(Date.now() / 1000),
      outcome,
    });

    // Örnek: Sui transaction (gerçek uygulamada sunucu cüzdanı ile yapılır)
    /*
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${MODULE_ADDRESS}::core::log_battle`,
      arguments: [
        tx.pure(battle.player_address),
        tx.pure(battle.monster_id),
        tx.pure(battle.attacks),
        tx.pure(Math.floor(Date.now() / 1000)),
        tx.pure(outcome),
      ],
    });
    await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: serverKeypair,
    });
    */

    delete battles[battle_id];
    res.json({ status: 'Savaş kaydedildi' });
  } catch (error) {
    console.error('Savaş kaydetme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.listen(3000, () => console.log('Sunucu 3000 portunda çalışıyor'));