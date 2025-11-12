import { db } from '../firebase';

async function cleanDatabase() {
  console.log('Starting to clean database...\n');

  try {
    // Clean volunteers collection
    console.log('Cleaning volunteers collection...');
    const volunteersSnapshot = await db.collection('volunteers').get();
    const volunteerBatch = db.batch();

    volunteersSnapshot.docs.forEach((doc) => {
      volunteerBatch.delete(doc.ref);
    });

    await volunteerBatch.commit();
    console.log(`✓ Deleted ${volunteersSnapshot.size} volunteers\n`);

    // Clean certificates collection
    console.log('Cleaning certificates collection...');
    const certificatesSnapshot = await db.collection('certificates').get();
    const certBatch = db.batch();

    certificatesSnapshot.docs.forEach((doc) => {
      certBatch.delete(doc.ref);
    });

    await certBatch.commit();
    console.log(`✓ Deleted ${certificatesSnapshot.size} certificates\n`);

    console.log('Database cleaned successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
}

cleanDatabase();
