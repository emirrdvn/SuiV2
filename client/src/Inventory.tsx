import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SuiClient } from '@mysten/sui/dist/cjs/client';

interface Card {
  id: string;
  type: number;
  power: number;
}

interface InventoryProps {
  address: string;
}

const suiClient = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

const Inventory: React.FC<InventoryProps> = ({ address }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/inventory', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(response.data.cards);
      } catch (error) {
        console.error('Envanter hatası:', error);
        alert('Envanter yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [address]);

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Envanter</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : cards.length === 0 ? (
        <p>Kart bulunamadı.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-4">
          {cards.map((card) => (
            <li key={card.id} className="border p-4 rounded">
              <p>Tür: {card.type === 0 ? 'Saldırı' : 'Savunma'}</p>
              <p>Güç: {card.power}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inventory;