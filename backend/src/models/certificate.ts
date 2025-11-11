import { db } from '../firebase';
import { ICertificate } from './interfaces';

class CertificateModel {
  private collection = db.collection('certificates');

  async create(data: ICertificate): Promise<ICertificate> {
    const now = new Date();
    const docRef = await this.collection.add({
      ...data,
      createdAt: now,
      updatedAt: now
    });
    
    return {
      id: docRef.id,
      ...data,
      createdAt: now,
      updatedAt: now
    };
  }

  async findOne(filter: Partial<ICertificate>): Promise<ICertificate | null> {
    const snapshot = await this.collection.where('certificateId', '==', filter.certificateId).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Convert Firestore Timestamps to Date objects
    return {
      id: doc.id,
      ...data,
      issuedAt: data.issuedAt?.toDate ? data.issuedAt.toDate() : data.issuedAt,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
    } as ICertificate;
  }

  async countDocuments(): Promise<number> {
    const snapshot = await this.collection.get();
    return snapshot.size;
  }

  async findByVolunteerId(volunteerId: string): Promise<ICertificate | null> {
    const snapshot = await this.collection.where('volunteerId', '==', volunteerId).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Convert Firestore Timestamps to Date objects
    return {
      id: doc.id,
      ...data,
      issuedAt: data.issuedAt?.toDate ? data.issuedAt.toDate() : data.issuedAt,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
    } as ICertificate;
  }
}

export const Certificate = new CertificateModel();