module card_game::player {
    use sui::object::{Self, UID};
    use sui::tx_context::{TxContext};
    use sui::transfer;
    use card_game::card::{Card};
    use card_game::monster::{Monster};


    // Oyuncu yapısı
    struct Player has key, store {
        id: UID,
        owner: address,
        cards: vector<UID>,
    }

    // Oyuncu oluşturma
    public fun create_player(owner: address, ctx: &mut TxContext) {
        let player = Player {
            id: object::new(ctx),
            owner,
            cards: vector::empty(),
        };
        transfer::transfer(player, owner);
    }

    public fun add_card(card: UID, player: &mut Player, ctx: &mut TxContext) {
        // Kartı oyuncunun kart listesine ekle
        vector::push_back(&mut player.cards, card);
        // Kartı oyuncuya transfer et
        transfer::transfer(card, player.owner);
    }


}
