import { writeFileSync } from 'fs';
import { join } from 'path';

// Create a minimal FIT file structure
// This is a simplified version just for testing
const createMockFitFile = () => {
  // FIT file header (simplified)
  const header = Buffer.from([
    0x0E, // Header size
    0x10, // Protocol version
    0x2E, // Profile version
    0x00, 0x00, 0x00, 0x00, // Data size
    0x2E, 0x46, 0x49, 0x54, // .FIT
    0x00, // CRC
  ]);

  // Mock activity data
  const data = Buffer.from([
    // Simplified activity record
    0x00, 0x01, 0x02, 0x03,
    // Add more mock data as needed
  ]);

  return Buffer.concat([header, data]);
};

// Create and save the mock FIT file
const mockFitFile = createMockFitFile();
const fixturePath = join(__dirname, 'sample.fit');
writeFileSync(fixturePath, mockFitFile);

console.log(`Created mock FIT file at: ${fixturePath}`);