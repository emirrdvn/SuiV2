module card_game::game {
    use sui::object::{Self, UID};
    use sui::tx_context::{TxContext};
    use sui::transfer;

    const WIN: u8 = 1;
    const LOSE: u8 = 0;
    const DRAW: u8 = 2;

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
}