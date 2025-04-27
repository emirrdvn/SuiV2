import { useCurrentAccount } from '@mysten/dapp-kit';
import "./Game.css";
import React, { useState, useEffect } from 'react';
import apiHandler, { Creature, serverIP } from './apiHandler';

// Card and Monster types for type safety
interface Card {
  id: string;
  name: string;
  element: string;
  attack: number;
  image_url: string;
}

interface GameState {
  hand: Card[];
  currentMonster: Creature | null;
  playerHP: number;
}

interface Message {
  id: number;
  text: string;
}

function Game(){
  const currentAccount = useCurrentAccount();
  const [selectedCards, setSelectedCards] = useState<number[]>([]); // Track selected card indexes
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    hand: [],
    currentMonster: null,
    playerHP: 100,
  });

  useEffect(() => {
    apiHandler.startBattle(currentAccount!.address as string).then((data) => {
      setPlayerId(currentAccount!.address as string);
      setGameState({
        hand: data.currentDeck,
        currentMonster: data.monster,
        playerHP: data.playerHealth,
      });
    });
  },[]);

  const [messages, setMessages] = useState<Message[]>([]);

  // Bildirim göstermek için yardımcı fonksiyon
  function showMessage(message: string) {
    const newMessage: Message = { id: Date.now(), text: message };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 3000);
  }

  // Eli güncelle
  function renderHand(hand: Card[]) {
    return hand.map((card, idx) => (
      <div key={card.id} className={selectedCards.includes(idx) ? "card selected" : "card"} onClick={() => selectCard(idx)}>
        <img src={`${serverIP}/${card.image_url.replace(/^\//, '')}`} alt={card.name} />
        <div className="overlay">
          {card.name}<br />
          [{card.element}]<br />
          ATK: {card.attack}
        </div>
      </div>
    ));
  }

  // Battle combo'yu güncelle
  function renderBattleCombo() {
    return selectedCards.map(idx => {
      const card = gameState.hand[idx];
      if (!card) return null;
      return (
        <div key={card.id} className="played-card" onClick={() => deselectCard(idx)}>
          <img src={`${serverIP}/${card.image_url.replace(/^\//, '')}`} alt={card.name} />
          <div className="overlay">
            {card.name}<br />
            [{card.element}]
          </div>
        </div>
      );
    });
  }

  // Canavarı güncelle
  function renderMonster(currentMonster: Creature | null) {
    if (!currentMonster) {
      return null;
    }

    if (currentMonster.health > 0) {
      return (
        <div className="monster" id="monster">
          <img src={`${serverIP}/${currentMonster.image_url.replace(/^\//, '')}`} alt={currentMonster.name} />
          <div className="overlay">
            {currentMonster.name} (Lv.{currentMonster.level})<br />
            HP: {currentMonster.health}<br />
            ATK: {currentMonster.attack}
          </div>
        </div>
      );
    } else {
      return (
        <div className="monster fade-out" id="monster">
          Defeated!
        </div>
      );
    }
  }

  // Oyunu başlat
  async function startGame() {
    try {
      const response = await apiHandler.startBattle(currentAccount!.address as string);
      setGameState({currentMonster: response.monster, hand: response.currentDeck, playerHP: response.playerHealth});
    } catch (error) {
      console.error('Error starting game:', error);
      showMessage('Failed to start game. Please try again.');
    }
  }

  // Kart seç
  function selectCard(idx: number) {
    if (!selectedCards.includes(idx)) {
      setSelectedCards([...selectedCards, idx]);
    }
  }

  // Kart seçimini geri al
  function deselectCard(idx: number) {
    setSelectedCards(selectedCards.filter(i => i !== idx));
  }

  // Turu bitir
  async function endTurn() {
    if (!playerId) return;
    if (selectedCards.length === 0) {
      showMessage('Select at least one card to attack!');
      return;
    }
    try {
      const response = await apiHandler.attack(playerId, selectedCards);
      setGameState({
        hand: response.currentDeck,
        currentMonster: response.monster,
        playerHP: response.playerHealth,
      });
      setSelectedCards([]);
      showMessage(response.message);
    } catch (error) {
      console.error('Error ending turn:', error);
      showMessage('Failed to end turn. Please try again.');
    }
  }

  // Oyunu başlat
  useEffect(() => {
    startGame();
  }, []);

  return (
    <div>
      <h1>Dungeon Card Battle</h1>

      <div id="player-stats">
        Player HP: <span id="player-hp">{gameState.playerHP}</span>
      </div>

      <div id="monster-area">{renderMonster(gameState.currentMonster)}</div>

      <h2>Your Hand</h2>
      <div className="hand" id="hand">
        {renderHand(gameState.hand)}
      </div>

      <h2>Selected Combo</h2>
      <div className="combo" id="battle-combo">
        {renderBattleCombo()}
      </div>

      <button onClick={endTurn}>Attack</button>

      {messages.map(msg => (
        <div key={msg.id} className="message">
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default Game;