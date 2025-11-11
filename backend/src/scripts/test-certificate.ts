import { certificateService } from '../services/certificate.service';
import fs from 'fs';
import path from 'path';

async function testCertificateGeneration() {
  console.log('Testing certificate generation...\n');

  try {
    // Test with a sample name
    const testName = 'Emmanuel Joseph (JET)';
    const testCertId = 'DFAE2025-VOL-0005';

    console.log(`Generating certificate for: ${testName}`);
    console.log(`Certificate ID: ${testCertId}\n`);

    const { imageBuffer, imageUrl } = await certificateService.createCertificate(
      testName,
      testCertId
    );

    // Save the test certificate locally
    const outputPath = path.join(__dirname, '../../test-output');
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const testFilePath = path.join(outputPath, `test-certificate-${Date.now()}.png`);
    fs.writeFileSync(testFilePath, imageBuffer);

    console.log('✓ Certificate generated successfully!');
    console.log(`✓ Saved locally to: ${testFilePath}`);
    console.log(`✓ Image URL from storage: ${imageUrl}`);
    console.log(`✓ File size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
    console.log('\nCertificate generation test completed successfully!');
  } catch (error) {
    console.error('✗ Error generating certificate:', error);
    throw error;
  }
}

// Run the test
testCertificateGeneration()
  .then(() => {
    console.log('\n✓ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Test failed:', error);
    process.exit(1);
  });
