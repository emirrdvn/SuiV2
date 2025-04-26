module card_game::monster {
    use sui::object::{Self, UID};
    use sui::tx_context::{TxContext};
    use sui::transfer;

    // Canavar yapısı
    struct Monster has key, store {
        id: UID,
        default_health: u64,
        power: u64,
        status: bool // Ekledik
    }

    // Yeni canavar oluşturma
    public fun create_monster(health: u64, power: u64, ctx: &mut TxContext) {
        let monster = Monster {
            id: object::new(ctx),
            default_health: health,
            power,
            status: true
        };
        transfer::share_object(monster);
    }
}