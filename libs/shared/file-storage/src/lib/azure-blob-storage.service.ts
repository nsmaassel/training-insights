import { BlobServiceClient, StorageSharedKeyCredential, ContainerClient } from '@azure/storage-blob';
import { IStorageService, FileMetadata, UploadOptions, DownloadOptions } from './types';

export class AzureBlobStorageService implements IStorageService {
  private blobServiceClient: BlobServiceClient;

  constructor(connectionString: string) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  private getContainerClient(containerName: string): ContainerClient {
    return this.blobServiceClient.getContainerClient(containerName);
  }

  async uploadFile(
    containerName: string,
    blobName: string,
    content: Buffer | NodeJS.ReadableStream | string,
    options?: UploadOptions
  ): Promise<FileMetadata> {
    const containerClient = this.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);

    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: options?.contentType
      },
      metadata: options?.metadata
    };

    // Convert content to Buffer for Azure SDK compatibility
    const buffer = content instanceof Buffer ? content : 
                  typeof content === 'string' ? Buffer.from(content) :
                  Buffer.from(await streamToBuffer(content));

    const result = await blobClient.uploadData(buffer, uploadOptions);
    const properties = await blobClient.getProperties();

    return {
      name: blobName,
      contentType: properties.contentType || 'application/octet-stream',
      size: properties.contentLength || 0,
      lastModified: properties.lastModified || new Date(),
      etag: properties.etag
    };
  }

  async downloadFile(
    containerName: string,
    blobName: string,
    options?: DownloadOptions
  ): Promise<NodeJS.ReadableStream> {
    const containerClient = this.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const downloadResponse = await blobClient.download();
    return downloadResponse.readableStreamBody!;
  }

  async deleteFile(containerName: string, blobName: string): Promise<void> {
    const containerClient = this.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.delete();
  }

  async getFileMetadata(containerName: string, blobName: string): Promise<FileMetadata> {
    const containerClient = this.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const properties = await blobClient.getProperties();

    return {
      name: blobName,
      contentType: properties.contentType || 'application/octet-stream',
      size: properties.contentLength || 0,
      lastModified: properties.lastModified || new Date(),
      etag: properties.etag
    };
  }

  async createContainer(containerName: string): Promise<void> {
    const containerClient = this.getContainerClient(containerName);
    await containerClient.createIfNotExists();
  }

  async deleteContainer(containerName: string): Promise<void> {
    const containerClient = this.getContainerClient(containerName);
    await containerClient.delete();
  }
}

// Helper function to convert ReadableStream to Buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}