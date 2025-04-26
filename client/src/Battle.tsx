import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SuiClient } from '@mysten/sui/dist/cjs/client';

interface Card {
  id: string;
  type: number;
  power: number;
}

interface Monster {
  id: string;
  health: number;
  power: number;
  status: boolean;
}

const suiClient = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

const Battle: React.FC<{ address: string }> = ({ address }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [monster, setMonster] = useState<Monster | null>(null);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Kartları ve canavarı yükle
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const inventoryResponse = await axios.get('http://localhost:3000/api/inventory', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(inventoryResponse.data.cards);

        // Varsayılan bir canavar oluştur (test için)
        const monsterResponse = await axios.get('http://localhost:3000/api/monster');
        setMonster(monsterResponse.data);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        alert('Veriler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [address]);

  const startBattle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/start_battle',
        { player_address: address, monster_id: monster?.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBattleId(response.data.battle_id);
      alert('Savaş başladı!');
    } catch (error) {
      console.error('Savaş başlatma hatası:', error);
      alert('Savaş başlatılamadı.');
    }
  };

  const attack = async (cardId: string) => {
    if (!battleId || !monster) return;
    try {
      const token = localStorage.getItem('token');
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      const response = await axios.post(
        'http://localhost:3000/api/attack',
        {
          battle_id: battleId,
          card_id: cardId,
          damage: card.power,
          timestamp: Math.floor(Date.now() / 1000),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Canavarın canını güncelle
      setMonster((prev) => prev ? { ...prev, health: response.data.monster_health } : null);
      alert('Saldırı kaydedildi!');
    } catch (error) {
      console.error('Saldırı hatası:', error);
      alert('Saldırı başarısız.');
    }
  };

  const endBattle = async () => {
    if (!battleId || !monster) return;
    try {
      const token = localStorage.getItem('token');
      const outcome = monster.health <= 0 ? 0 : 1; // 0: Oyuncu kazandı, 1: Canavar kazandı
      await axios.post(
        'http://localhost:3000/api/end_battle',
        { battle_id: battleId, outcome },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBattleId(null);
      alert('Savaş bitti ve Suiye kaydedildi!');
    } catch (error) {
      console.error('Savaş bitirme hatası:', error);
      alert('Savaş bitirilemedi.');
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Savaş</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : !monster ? (
        <p>Canavar bulunamadı.</p>
      ) : (
        <>
          <p>Canavar Canı: {monster.health}</p>
          {!battleId ? (
            <button
              onClick={startBattle}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
            >
              Savaşı Başlat
            </button>
          ) : (
            <>
              <h3 className="text-xl mt-4">Kartlarla Saldır</h3>
              <ul className="grid grid-cols-3 gap-4 mt-2">
                {cards.map((card) => (
                  <li key={card.id} className="border p-4 rounded">
                    <p>Tür: {card.type === 0 ? 'Saldırı' : 'Savunma'}</p>
                    <p>Güç: {card.power}</p>
                    <button
                      onClick={() => attack(card.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mt-2"
                    >
                      Saldır
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={endBattle}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-4"
              >
                Savaşı Bitir
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Battle;