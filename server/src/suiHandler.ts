import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Card } from './BattleSystem';

export const globalSuiClient = new SuiClient({
  url: getFullnodeUrl('testnet'),
});


const privateKeyBytes = Uint8Array.from(Buffer.from("ZFJkaTByVGU4MzFBMVZ0Zm01cTA4blfsdgkhoıjpıjp", 'base64'));
const packageId = "0xf75901985b8b324ca5c40d206909b53f56aa1479d85360fe77457c5beadf2068"; // Replace with your package ID
const adminCapId = "0xfaeb5016a2c7354f2a041bd16b7520145a98f6e5be51d40d31f16684af708e18"; // Replace with your admin cap ID

class CardGameAdmin {
  static allNFTAddresses: string[] = [];
  public client: SuiClient;
  private keypair: Ed25519Keypair;
  private packageId: string;
  private adminCapId: string;

  constructor(
    packageId: string,
    adminCapId: string,
  ) {
    this.client = new SuiClient({ url: getFullnodeUrl('testnet') });
    this.keypair = Ed25519Keypair.fromSecretKey(privateKeyBytes);
    this.packageId = packageId;
    this.adminCapId = adminCapId;

  }
  

  
  // Kartı bir oyuncuya ata
  async assignCard(cardId: string, playerAddress: string) {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::card::assign_card`,
      arguments: [
        tx.object(this.adminCapId),
        tx.object(cardId),
        tx.pure.string(playerAddress),  
      ],
    });

    const result = await this.client.signAndExecuteTransaction({
      signer: this.keypair,
      transaction: tx,
      options: { showEffects: true },
    });

    return result;
  }

  async createCard(card : Card) {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::card_nft::mint`,
      arguments: [
        tx.pure.string(this.adminCapId),
        tx.pure.string(card.name),
        tx.pure.string(card.image_url),
        tx.pure.string(card.element),
        tx.pure.u64(card.level),
        tx.pure.u64(card.attack),
      ],
    });

    const result = await this.client.signAndExecuteTransaction({
      signer: this.keypair,
      transaction: tx,
      options: { showEffects: true },
    });

    return result;
  }

  async getCardFromSui(playerAddress: string) : Promise<Card[]> {
    const objects = await this.client.getOwnedObjects({owner: playerAddress,options: { showContent: true,showType: true}});
    objects.data.filter((object) => {
      object.data?.type?.split("::")[2] === "0xf75901985b8b324ca5c40d206909b53f56aa1479d85360fe77457c5beadf2068::card"
    });
    return [{attack: 0, element: "", id: "", image_url: "", level: 0, name: ""}]; // Placeholder for the actual card data
  }
  

  // async function getCard(cardAddress : string) {
    
  // }



}

export default new CardGameAdmin(packageId, adminCapId);

