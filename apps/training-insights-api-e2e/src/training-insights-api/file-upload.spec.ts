import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../training-insights-api/src/app/app.router';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

test.describe('File Upload API', () => {
  const testFilePath = join(__dirname, '../fixtures/sample.fit');
  const testFileName = 'test-upload.fit';
  
  test('should upload and manage FIT files', async ({ page }) => {
    // Upload file
    const fileBuffer = readFileSync(testFilePath);
    const uploadResult = await trpc.file.upload.mutate({
      fileName: testFileName,
      contentType: 'application/fit',
      fileBuffer
    });

    expect(uploadResult.success).toBeTruthy();
    expect(uploadResult.file.name).toBe(testFileName);
    expect(uploadResult.file.contentType).toBe('application/fit');
    expect(uploadResult.file.size).toBeGreaterThan(0);

    // Get metadata
    const metadata = await trpc.file.getMetadata.query({
      fileName: testFileName
    });
    expect(metadata.name).toBe(testFileName);

    // Delete file
    const deleteResult = await trpc.file.delete.mutate({
      fileName: testFileName
    });
    expect(deleteResult.success).toBeTruthy();

    // Verify deletion
    await expect(trpc.file.getMetadata.query({
      fileName: testFileName
    })).rejects.toThrow();
  });

  test('should handle invalid file uploads', async ({ page }) => {
    // Try to upload empty file
    await expect(trpc.file.upload.mutate({
      fileName: 'empty.fit',
      contentType: 'application/fit',
      fileBuffer: Buffer.from('')
    })).rejects.toThrow();

    // Try to get non-existent file
    await expect(trpc.file.getMetadata.query({
      fileName: 'nonexistent.fit'
    })).rejects.toThrow();
  });
});