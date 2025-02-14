export interface FileUploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
  error?: string;
}

export interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  userId?: string; // For future authentication
  status: FileProcessingStatus;
}

export enum FileProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}