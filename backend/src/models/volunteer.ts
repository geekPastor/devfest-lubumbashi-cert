import { db } from '../firebase';
import { IVolunteer } from './interfaces';

class VolunteerModel {
  private collection = db.collection('volunteers');

  async findOne(filter: Partial<IVolunteer>): Promise<IVolunteer | null> {
    const snapshot = await this.collection.where('email', '==', filter.email).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as IVolunteer
    };
  }

  async create(data: IVolunteer): Promise<IVolunteer> {
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

  async findByIdAndUpdate(id: string, update: Partial<IVolunteer>): Promise<IVolunteer | null> {
    const docRef = this.collection.doc(id);
    const now = new Date();
    await docRef.update({
      ...update,
      updatedAt: now
    });

    const doc = await docRef.get();
    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data() as IVolunteer
    };
  }

  async findAll(): Promise<IVolunteer[]> {
    const snapshot = await this.collection.get();
    const volunteers: IVolunteer[] = [];

    snapshot.forEach(doc => {
      volunteers.push({
        id: doc.id,
        ...doc.data() as IVolunteer
      });
    });

    return volunteers;
  }
}

export const Volunteer = new VolunteerModel();