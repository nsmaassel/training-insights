import { validateFitFile } from './utils';

describe('validateFitFile', () => {
  it('should validate correct FIT file headers', async () => {
    // Create a mock File with valid FIT header
    // FIT file header structure:
    // Byte 0: Header size (14 bytes)
    // Byte 1: Protocol version (major)
    // Byte 2-3: Profile version
    // Byte 4-7: Data size (little endian)
    // Byte 8-11: ".FIT" ASCII
    // Byte 12-13: Header CRC
    const validHeader = new Uint8Array([
      14,     // Header size
      16,     // Protocol version
      46, 0,  // Profile version
      0, 0, 0, 0,  // Data size (empty file)
      46, 70, 73, 84,  // ".FIT" in ASCII
      0, 0    // CRC
    ]);

    const mockFile = new File([validHeader], 'test.fit', { type: 'application/fit' });
    expect(await validateFitFile(mockFile)).toBe(true);
  });

  it('should reject files with invalid extension', async () => {
    const mockFile = new File(['test data'], 'test.txt', { type: 'text/plain' });
    expect(await validateFitFile(mockFile)).toBe(false);
  });

  it('should reject files with invalid headers', async () => {
    // Create a mock File with invalid header
    const invalidHeader = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    const mockFile = new File([invalidHeader], 'test.fit', { type: 'application/fit' });
    expect(await validateFitFile(mockFile)).toBe(false);
  });

  it('should handle empty files', async () => {
    const emptyFile = new File([], 'empty.fit', { type: 'application/fit' });
    expect(await validateFitFile(emptyFile)).toBe(false);
  });
});