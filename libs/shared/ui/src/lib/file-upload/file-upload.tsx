import React, { ChangeEvent, useState } from 'react';
import { trpc } from '@training-insights/shared/trpc';
import { validateFitFile } from '@training-insights/shared/file-storage';

interface FileUploadProps {
  onUploadComplete?: (metadata: any) => void;
  onError?: (error: Error) => void;
  maxSize?: number; // in bytes
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onError,
  maxSize = 10 * 1024 * 1024 // 10MB default
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      onError?.(new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`));
      return;
    }

    // Validate FIT file format
    const isValidFit = await validateFitFile(file);
    if (!isValidFit) {
      onError?.(new Error('Invalid FIT file format'));
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Convert file to buffer for upload
      const buffer = await file.arrayBuffer();
      
      const result = await trpc.file.upload.mutate({
        fileName: file.name,
        contentType: 'application/fit',
        fileBuffer: Buffer.from(buffer)
      });

      setProgress(100);
      onUploadComplete?.(result.file);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center w-full">
        <label 
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isUploading ? 'bg-gray-50 border-gray-300' : 'hover:bg-gray-50 border-blue-300 hover:border-blue-400'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg 
              className={`w-10 h-10 mb-3 ${isUploading ? 'text-gray-400' : 'text-blue-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">.fit files only</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".fit"
            onChange={handleFileChange}
            disabled={isUploading}
            data-testid="file-input"
          />
        </label>
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5" role="progressbar">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};