import { db } from '../firebase';

const volunteers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Registration',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Technical Support',
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'Venue Management',
  },
  // Add test account for development
  {
    name: 'Test Volunteer',
    email: 'test@example.com',
    role: 'Testing',
  },
];

async function seedVolunteers() {
  console.log('Starting to seed volunteer data...');
  
  for (const volunteer of volunteers) {
    try {
      // Check if volunteer already exists
      const snapshot = await db.collection('volunteers')
        .where('email', '==', volunteer.email)
        .get();
      
      if (snapshot.empty) {
        await db.collection('volunteers').add({
          ...volunteer,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`Added volunteer: ${volunteer.name} (${volunteer.email})`);
      } else {
        console.log(`Volunteer already exists: ${volunteer.email}`);
      }
    } catch (error) {
      console.error(`Error adding volunteer ${volunteer.email}:`, error);
    }
  }
  
  console.log('Finished seeding volunteer data.');
  process.exit(0);
}

seedVolunteers();