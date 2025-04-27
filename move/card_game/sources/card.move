
module card_game::card_nft;
    use sui::url::{Self, Url};
    use std::string::{Self, String};
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;

    const BASIC_TYPE: u8 = 0;
    const FIRE_TYPE: u8 = 1;
    const WATER_TYPE: u8 = 2;
    const DEATH_TYPE: u8 = 3;
    const MYSTIC_TYPE: u8 = 4;


    // Admin capability to restrict minting
    public struct AdminCap has key { id: UID }

    // CardNFT struct representing the NFT
    public struct CardNFT has key, store {
        id: UID,
        name: String,
        image_url: Url,
        element: String, // e.g., "Basic", "Fire", "Water"
        level: u64,      // e.g., 1
        attack: u64,     // e.g., 10
    }

    // Event emitted when an NFT is minted
    public struct NFTMinted has copy, drop {
        object_id: ID,
        creator: address,
        name: String,
    }

    // Initialize the module and create AdminCap
    fun init(ctx: &mut TxContext) {
        // Create and transfer AdminCap to the deployer
        transfer::transfer(AdminCap { id: object::new(ctx) }, tx_context::sender(ctx));
    }

    // Mint a new CardNFT (only callable by AdminCap holder)
    public entry fun mint(
        _cap: &AdminCap, // Requires AdminCap
        name: vector<u8>,
        image_url: vector<u8>,
        element: vector<u8>,
        level: u64,
        attack: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = CardNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            image_url: url::new_unsafe_from_bytes(image_url),
            element: string::utf8(element),
            level,
            attack,
        };

        // Emit an event for the minted NFT
        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        // Transfer the NFT to the sender (admin)
        transfer::public_transfer(nft, sender);
    }

    // Transfer the CardNFT to another address
    public entry fun transfer(
        nft: CardNFT,
        recipient: address,
        _ctx: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient);
    }

    // Update the level of the CardNFT
    public entry fun update_level(
        nft: &mut CardNFT,
        new_level: u64,
        _ctx: &mut TxContext
    ) {
        nft.level = new_level;
    }

    // Update the attack of the CardNFT
    public entry fun update_attack(
        nft: &mut CardNFT,
        new_attack: u64,
        _ctx: &mut TxContext
    ) {
        nft.attack = new_attack;
    }

    // Burn (delete) the CardNFT
    public entry fun burn(
        nft: CardNFT,
        _ctx: &mut TxContext
    ) {
        let CardNFT { id, name: _, image_url: _, element: _, level: _, attack: _ } = nft;
        object::delete(id);
    }

    // Getters for CardNFT attributes
    public fun get_name(nft: &CardNFT): &String {
        &nft.name
    }


    public fun get_image_url(nft: &CardNFT): &Url {
        &nft.image_url
    }

    public fun get_element(nft: &CardNFT): &String {
        &nft.element
    }

    public fun get_level(nft: &CardNFT): u64 {
        nft.level
    }

    public fun get_attack(nft: &CardNFT): u64 {
        nft.attack
    }