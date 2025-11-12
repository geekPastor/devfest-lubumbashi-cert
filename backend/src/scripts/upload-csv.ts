import { db } from '../firebase';
import * as fs from 'fs';
import * as path from 'path';

interface VolunteerRow {
  name: string;
  email: string;
  type: 'volunteer' | 'speaker';
}

function parseCSV(filePath: string): VolunteerRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');

  const volunteers: VolunteerRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= 3) {
      volunteers.push({
        name: values[0].trim(),
        email: values[1].trim(),
        type: (values[2].trim() as 'volunteer' | 'speaker') || 'volunteer',
      });
    }
  }

  return volunteers;
}

async function uploadCSV() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run upload-csv <csv-file-path>');
    console.error('Example: npm run upload-csv ../test-both.csv');
    process.exit(1);
  }

  const csvPath = path.resolve(__dirname, '../../', args[0]);

  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }

  console.log(`Reading CSV file: ${csvPath}\n`);

  try {
    const volunteers = parseCSV(csvPath);
    console.log(`Found ${volunteers.length} volunteers to upload\n`);

    let added = 0;
    let skipped = 0;

    for (const volunteer of volunteers) {
      // Check if volunteer already exists
      const snapshot = await db.collection('volunteers')
        .where('email', '==', volunteer.email)
        .get();

      if (snapshot.empty) {
        await db.collection('volunteers').add({
          name: volunteer.name,
          email: volunteer.email,
          type: volunteer.type,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✓ Added ${volunteer.type}: ${volunteer.name} (${volunteer.email})`);
        added++;
      } else {
        console.log(`⊘ Skipped (already exists): ${volunteer.email}`);
        skipped++;
      }
    }

    console.log(`\nUpload complete!`);
    console.log(`  Added: ${added}`);
    console.log(`  Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Error uploading CSV:', error);
    process.exit(1);
  }
}

uploadCSV();
