import { db } from '../firebase';
import { IVerificationCode } from './interfaces';

class VerificationCodeModel {
  private collection = db.collection('verificationCodes');

  async create(data: IVerificationCode): Promise<IVerificationCode> {
    const now = new Date();
    const docRef = await this.collection.add({
      ...data,
      createdAt: now
    });
    
    return {
      id: docRef.id,
      ...data,
      createdAt: now
    };
  }

  async findOne(filter: Partial<IVerificationCode>): Promise<IVerificationCode | null> {
    let query = this.collection
      .where('email', '==', filter.email)
      .where('code', '==', filter.code)
      .where('isUsed', '==', false)
      .where('expiresAt', '>', new Date());

    const snapshot = await query.get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as IVerificationCode
    };
  }

  async findByIdAndUpdate(id: string, update: Partial<IVerificationCode>): Promise<IVerificationCode | null> {
    const docRef = this.collection.doc(id);
    await docRef.update(update);

    const doc = await docRef.get();
    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data() as IVerificationCode
    };
  }

  // Add a cleanup function to delete expired codes
  async cleanupExpiredCodes(): Promise<void> {
    const now = new Date();
    const snapshot = await this.collection
      .where('expiresAt', '<', now)
      .where('isUsed', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

export const VerificationCode = new VerificationCodeModel();