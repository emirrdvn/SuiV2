module card_game::card {
    use sui::object::{Self, UID};
    use sui::tx_context::{TxContext};
    use sui::transfer;

    const BASIC_TYPE: u8 = 0;
    const FIRE_TYPE: u8 = 1;
    const WATER_TYPE: u8 = 2;
    const DEATH_TYPE: u8 = 3;
    const MYSTIC_TYPE: u8 = 4;

    struct Card has key, store {
        id: UID,
        type: u8,
        power: u64,
    }

    // Kart oluşturma
    public fun create_card(type: u8, power: u64, ctx: &mut TxContext): Card {
        let card = Card {
            id: object::new(ctx),
            type,
            power,
        };
        transfer::share_object(card);
        card
    }
}