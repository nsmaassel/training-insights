import { Readable } from 'stream';
import { AzureBlobStorageService } from './azure-blob-storage.service';

// Mock the Azure SDK
jest.mock('@azure/storage-blob', () => {
  const mockUploadData = jest.fn().mockResolvedValue({});
  const mockGetProperties = jest.fn().mockResolvedValue({
    contentType: 'application/octet-stream',
    contentLength: 100,
    lastModified: new Date(),
    etag: 'mockEtag'
  });
  const mockDelete = jest.fn().mockResolvedValue({});
  const mockCreateIfNotExists = jest.fn().mockResolvedValue({});
  const mockContainerDelete = jest.fn().mockResolvedValue({});
  const mockDownload = jest.fn().mockResolvedValue({
    readableStreamBody: Readable.from('test data')
  });

  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue({
        getContainerClient: jest.fn().mockReturnValue({
          getBlockBlobClient: jest.fn().mockReturnValue({
            uploadData: mockUploadData,
            getProperties: mockGetProperties,
            delete: mockDelete,
            download: mockDownload
          }),
          createIfNotExists: mockCreateIfNotExists,
          delete: mockContainerDelete
        })
      })
    }
  };
});

describe('AzureBlobStorageService', () => {
  let service: AzureBlobStorageService;
  const mockConnectionString = 'DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://devstoreaccount1.blob.core.windows.net/';

  beforeEach(() => {
    service = new AzureBlobStorageService(mockConnectionString);
  });

  describe('uploadFile', () => {
    it('should upload a file and return metadata', async () => {
      const result = await service.uploadFile(
        'test-container',
        'test.fit',
        Buffer.from('test data'),
        { contentType: 'application/fit' }
      );

      expect(result).toEqual({
        name: 'test.fit',
        contentType: 'application/octet-stream',
        size: 100,
        lastModified: expect.any(Date),
        etag: 'mockEtag'
      });
    });
  });

  describe('downloadFile', () => {
    it('should return a readable stream', async () => {
      const stream = await service.downloadFile('test-container', 'test.fit');
      expect(stream).toBeInstanceOf(Readable);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      await expect(service.deleteFile('test-container', 'test.fit')).resolves.not.toThrow();
    });
  });

  describe('createContainer', () => {
    it('should create a container', async () => {
      await expect(service.createContainer('test-container')).resolves.not.toThrow();
    });
  });

  describe('deleteContainer', () => {
    it('should delete a container', async () => {
      await expect(service.deleteContainer('test-container')).resolves.not.toThrow();
    });
  });
});