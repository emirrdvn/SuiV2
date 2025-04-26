import crypto from "crypto";

class EncryptedStorageService {
  private secret: string;
  private key: Buffer;

  constructor(secret: string) {
    this.secret = secret;
    this.key = this.generateKey(secret);
  }

  // SHA256 ile key oluştur
  private generateKey(secret: string): Buffer {
    return crypto.createHash('sha256').update(secret).digest();
  }

  // JSON veriyi şifrele
  encrypt(data: object): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);

    const jsonString = JSON.stringify(data);

    let encrypted = cipher.update(jsonString, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // IV + encryptedData base64 formatında döner
    return `${iv.toString('base64')}:${encrypted}`;
  }

  // Şifreli veriyi çöz
  decrypt(encryptedData: string): object {
    const [ivBase64, encryptedBase64] = encryptedData.split(':');
    if (!ivBase64 || !encryptedBase64) {
      throw new Error("Invalid encrypted data format.");
    }

    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);

    let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }
}


export default new EncryptedStorageService("SEPSECRET_KEY");