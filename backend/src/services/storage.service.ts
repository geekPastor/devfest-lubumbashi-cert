import fs from 'fs';
import path from 'path';
import { config } from '../config';

class StorageService {
  private storagePath: string;

  constructor() {
    this.storagePath = config.storage.path;
    this.ensureStorageDirectory();
  }

  private ensureStorageDirectory() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async saveCertificate(certificateId: string, imageBuffer: Buffer): Promise<string> {
    const fileName = `${certificateId}.png`;
    const filePath = path.join(this.storagePath, fileName);

    await fs.promises.writeFile(filePath, imageBuffer);

    // Return full URL for the certificate
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${backendUrl}/certificates/${fileName}`;
  }

  async getCertificate(certificateId: string): Promise<Buffer> {
    const filePath = path.join(this.storagePath, `${certificateId}.png`);
    return fs.promises.readFile(filePath);
  }

  async deleteCertificate(certificateId: string): Promise<void> {
    const filePath = path.join(this.storagePath, `${certificateId}.png`);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

export const storageService = new StorageService();