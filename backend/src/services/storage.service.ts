import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { storage } from '../firebase';

class StorageService {
  private storagePath: string;
  private useFirebaseStorage: boolean;
  private bucket: any;

  constructor() {
    this.storagePath = config.storage.path;
    // Use Firebase Storage in production or when storage type is 'cloud'
    this.useFirebaseStorage = process.env.NODE_ENV === 'production' || config.storage.type === 'cloud';

    if (this.useFirebaseStorage) {
      this.bucket = storage.bucket();
    } else {
      this.ensureStorageDirectory();
    }
  }

  private ensureStorageDirectory() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async saveCertificate(certificateId: string, imageBuffer: Buffer): Promise<string> {
    const fileName = `${certificateId}.png`;

    if (this.useFirebaseStorage) {
      // Use Firebase Storage
      const file = this.bucket.file(`certificates/${fileName}`);
      await file.save(imageBuffer, {
        metadata: {
          contentType: 'image/png',
        },
      });

      // Make file publicly accessible
      await file.makePublic();

      // Return public URL
      return `https://storage.googleapis.com/${this.bucket.name}/certificates/${fileName}`;
    } else {
      // Use local storage (for development)
      const filePath = path.join(this.storagePath, fileName);
      await fs.promises.writeFile(filePath, imageBuffer);

      const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      return `${backendUrl}/certificates/${fileName}`;
    }
  }

  async getCertificate(certificateId: string): Promise<Buffer> {
    const fileName = `${certificateId}.png`;

    if (this.useFirebaseStorage) {
      // Download from Firebase Storage
      const file = this.bucket.file(`certificates/${fileName}`);
      const [buffer] = await file.download();
      return buffer;
    } else {
      // Read from local storage
      const filePath = path.join(this.storagePath, fileName);
      return fs.promises.readFile(filePath);
    }
  }

  async deleteCertificate(certificateId: string): Promise<void> {
    const fileName = `${certificateId}.png`;

    if (this.useFirebaseStorage) {
      // Delete from Firebase Storage
      const file = this.bucket.file(`certificates/${fileName}`);
      await file.delete().catch(() => {
        // Ignore if file doesn't exist
      });
    } else {
      // Delete from local storage
      const filePath = path.join(this.storagePath, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  }
}

export const storageService = new StorageService();