export interface FileMetadata {
  name: string;
  contentType: string;
  size: number;
  lastModified: Date;
  etag?: string;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  overwrite?: boolean;
}

export interface DownloadOptions {
  // Future options like range requests can go here
}

export interface IStorageService {
  /**
   * Upload a file to storage
   * @param containerName The container/bucket to upload to
   * @param blobName The name to give the file in storage
   * @param content The file content as a Buffer, Readable stream, or string
   * @param options Upload options
   */
  uploadFile(
    containerName: string,
    blobName: string,
    content: Buffer | NodeJS.ReadableStream | string,
    options?: UploadOptions
  ): Promise<FileMetadata>;

  /**
   * Download a file from storage
   * @param containerName The container/bucket to download from
   * @param blobName The name of the file in storage
   * @param options Download options
   */
  downloadFile(
    containerName: string,
    blobName: string,
    options?: DownloadOptions
  ): Promise<NodeJS.ReadableStream>;

  /**
   * Delete a file from storage
   * @param containerName The container/bucket containing the file
   * @param blobName The name of the file to delete
   */
  deleteFile(containerName: string, blobName: string): Promise<void>;

  /**
   * Get metadata about a file
   * @param containerName The container/bucket containing the file
   * @param blobName The name of the file
   */
  getFileMetadata(containerName: string, blobName: string): Promise<FileMetadata>;

  /**
   * Create a container if it doesn't exist
   * @param containerName The name of the container to create
   */
  createContainer(containerName: string): Promise<void>;

  /**
   * Delete a container and all its contents
   * @param containerName The name of the container to delete
   */
  deleteContainer(containerName: string): Promise<void>;
}