module game::core {
    use sui::object::{Self, UID};
    use sui::tx_context::{TxContext};
    use sui::transfer;
    use sui::vec::Vector;

    // Oyuncu yapısı
    struct Player has key, store {
        id: UID,
        owner: address,
        cards: vector<UID>,
        status: bool
    }

    // Kart yapısı
    struct Card has key, store {
        id: UID,
        type: u8,
        power: u64,
        owner: address
    }

    // Canavar yapısı
    struct Monster has key, store {
        id: UID,
        health: u64,
        power: u64,
        status: bool
    }

    // Savaş logu ve saldırı detayları
    struct BattleLog has key, store {
        id: UID,
        player: address,
        monster: UID,
        attacks: vector<Attack>,
        timestamp: u64,
        outcome: u8
    }

    struct Attack has store {
        card: UID,
        damage: u64,
        timestamp: u64
    }

    // Oyuncu oluşturma
    public fun create_player(owner: address, ctx: &mut TxContext) {
        let player = Player {
            id: object::new(ctx),
            owner,
            cards: vector::empty(),
            status: true
        };
        transfer::transfer(player, owner);
    }

    // Yeni kart ekleme
    public fun add_card(player: &mut Player, type: u8, power: u64, ctx: &mut TxContext) {
        let card = Card {
            id: object::new(ctx),
            type,
            power,
            owner: player.owner
        };
        vector::push_back(&mut player.cards, card.id);
        transfer::transfer(card, player.owner);
    }

    // Savaş logu kaydetme
    public fun log_battle(
        player: address,
        monster: UID,
        attacks: vector<Attack>,
        timestamp: u64,
        outcome: u8,
        ctx: &mut TxContext
    ) {
        let log = BattleLog {
            id: object::new(ctx),
            player,
            monster,
            attacks,
            timestamp,
            outcome
        };
        transfer::share_object(log);
    }

    // Canavarın canını güncelleme
    public fun update_monster_health(monster: &mut Monster, new_health: u64) {
        monster.health = new_health;
        if (new_health == 0) {
            monster.status = false;
        }
    }

    // Yeni canavar oluşturma
    public fun create_monster(health: u64, power: u64, ctx: &mut TxContext) {
        let monster = Monster {
            id: object::new(ctx),
            health,
            power,
            status: true
        };
        transfer::share_object(monster);
    }
}