import { useState, useEffect } from 'react';
import { trpcClient } from './trpc';

const DEBUG = process.env.NODE_ENV === 'test';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  
  const uploadMutation = trpcClient.fileUpload.uploadFile.useMutation({
    onSuccess: (data) => {
      if (DEBUG) console.log('Upload success:', data);
      setUploadId(data.id);
    },
    onError: (error) => {
      if (DEBUG) console.log('Upload error:', error);
    }
  });

  const uploadStatus = trpcClient.fileUpload.getUploadStatus.useQuery(uploadId ?? '', {
    enabled: !!uploadId,
    refetchInterval: (data) => 
      data?.status === 'COMPLETED' ? false : 1000,
  });

  useEffect(() => {
    if (DEBUG) {
      console.log('Upload status data:', uploadStatus.data);
      console.log('Upload mutation state:', {
        isLoading: uploadMutation.isLoading,
        error: uploadMutation.error,
        data: uploadMutation.data
      });
    }
  }, [uploadStatus.data, uploadMutation.isLoading, uploadMutation.error, uploadMutation.data]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.fit')) {
      if (DEBUG) console.log('Handling file:', file.name);
      setSelectedFile(file);
      try {
        const buffer = await file.arrayBuffer();
        const uploadData = {
          fileName: file.name,
          fileType: file.type,
          size: file.size,
          data: Buffer.from(buffer),
        };
        if (DEBUG) console.log('Starting upload with:', uploadData);
        uploadMutation.mutate(uploadData);
      } catch (err) {
        console.error('File upload failed:', err);
      }
    }
  };

  // Reset state when file upload is complete
  useEffect(() => {
    if (uploadStatus.data?.status === 'COMPLETED') {
      setTimeout(() => {
        setSelectedFile(null);
        setUploadId(null);
      }, 3000);
    }
  }, [uploadStatus.data?.status]);

  return (
    <div className="min-h-screen bg-gray-100" data-testid="app-container">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Training Insights</h1>
          <p className="text-xl text-gray-600">Upload your training data for analysis</p>
        </header>
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center">
            <input
              type="file"
              accept=".fit"
              onChange={handleFileUpload}
              className="sr-only"
              id="file-upload"
              data-testid="file-input"
              aria-label="Choose FIT file"
              disabled={uploadMutation.isLoading}
            />
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={uploadMutation.isLoading}
              className={`${
                uploadMutation.isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
              } text-white font-semibold py-2 px-4 rounded transition duration-200`}
              data-testid="upload-button"
              aria-busy={uploadMutation.isLoading}
            >
              {uploadMutation.isLoading ? 'Uploading...' : 'Upload FIT file'}
            </button>
            
            {selectedFile && (
              <p className="mt-4 text-gray-600" role="status" data-testid="selected-file">
                Selected file: {selectedFile.name}
              </p>
            )}
            
            {uploadMutation.error && (
              <p className="mt-4 text-red-600" role="alert" data-testid="upload-error">
                Upload failed: {uploadMutation.error.message}
              </p>
            )}
            
            {uploadStatus.data && (
              <div className="mt-4" role="status" data-testid="upload-status" aria-live="polite">
                <p className="text-gray-600">
                  Status: {uploadStatus.data.status}
                </p>
                {uploadStatus.data.status === 'COMPLETED' && (
                  <p className="text-green-600 mt-2" data-testid="upload-complete">
                    Upload complete! Your activity data is being processed.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
