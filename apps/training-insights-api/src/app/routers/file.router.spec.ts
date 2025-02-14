import { inferProcedureInput } from '@trpc/server';
import { AppRouter } from '../trpc';
import { router } from './file.router';
import { AzureBlobStorageService } from '@training-insights/shared/file-storage';

// Mock the storage service
jest.mock('@training-insights/shared/file-storage', () => ({
  AzureBlobStorageService: jest.fn().mockImplementation(() => ({
    createContainer: jest.fn().mockResolvedValue(undefined),
    uploadFile: jest.fn().mockResolvedValue({
      name: 'test.fit',
      contentType: 'application/fit',
      size: 1024,
      lastModified: new Date(),
      etag: 'test-etag'
    }),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    getFileMetadata: jest.fn().mockResolvedValue({
      name: 'test.fit',
      contentType: 'application/fit',
      size: 1024,
      lastModified: new Date(),
      etag: 'test-etag'
    })
  }))
}));

describe('File Router', () => {
  const mockStorageService = new AzureBlobStorageService('mock-connection-string');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    type UploadInput = inferProcedureInput<AppRouter['file']['upload']>;
    const validInput: UploadInput = {
      fileName: 'test.fit',
      contentType: 'application/fit',
      fileBuffer: Buffer.from('test data')
    };

    it('should upload a file successfully', async () => {
      const caller = router.createCaller({ storageService: mockStorageService });
      const result = await caller.upload(validInput);

      expect(result.success).toBe(true);
      expect(result.file).toEqual({
        name: 'test.fit',
        contentType: 'application/fit',
        size: 1024,
        lastModified: expect.any(Date),
        etag: 'test-etag'
      });
    });

    it('should handle upload failures', async () => {
      const mockError = new Error('Upload failed');
      mockStorageService.uploadFile = jest.fn().mockRejectedValue(mockError);

      const caller = router.createCaller({ storageService: mockStorageService });
      await expect(caller.upload(validInput)).rejects.toThrow('Failed to upload file');
    });
  });

  describe('delete', () => {
    it('should delete a file successfully', async () => {
      const caller = router.createCaller({ storageService: mockStorageService });
      const result = await caller.delete({ fileName: 'test.fit' });

      expect(result.success).toBe(true);
      expect(mockStorageService.deleteFile).toHaveBeenCalledWith('fit-files', 'test.fit');
    });

    it('should handle delete failures', async () => {
      const mockError = new Error('Delete failed');
      mockStorageService.deleteFile = jest.fn().mockRejectedValue(mockError);

      const caller = router.createCaller({ storageService: mockStorageService });
      await expect(caller.delete({ fileName: 'test.fit' })).rejects.toThrow('Failed to delete file');
    });
  });

  describe('getMetadata', () => {
    it('should return file metadata', async () => {
      const caller = router.createCaller({ storageService: mockStorageService });
      const metadata = await caller.getMetadata({ fileName: 'test.fit' });

      expect(metadata).toEqual({
        name: 'test.fit',
        contentType: 'application/fit',
        size: 1024,
        lastModified: expect.any(Date),
        etag: 'test-etag'
      });
    });

    it('should handle not found errors', async () => {
      const mockError = new Error('Not found');
      mockStorageService.getFileMetadata = jest.fn().mockRejectedValue(mockError);

      const caller = router.createCaller({ storageService: mockStorageService });
      await expect(caller.getMetadata({ fileName: 'nonexistent.fit' })).rejects.toThrow('File not found');
    });
  });
});