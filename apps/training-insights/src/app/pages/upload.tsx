import React from 'react';
import { FileUpload } from '@training-insights/shared/ui';
import { useToast } from '@training-insights/shared/ui/toast'; // We'll need to create this later

export const UploadPage: React.FC = () => {
  const toast = useToast();

  const handleUploadComplete = (metadata: any) => {
    toast({
      title: 'Upload Complete',
      description: `Successfully uploaded ${metadata.name}`,
      status: 'success'
    });
  };

  const handleError = (error: Error) => {
    toast({
      title: 'Upload Failed',
      description: error.message,
      status: 'error'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Training Data</h1>
      <div className="max-w-xl mx-auto">
        <FileUpload
          onUploadComplete={handleUploadComplete}
          onError={handleError}
          accept=".fit"
          maxSize={20 * 1024 * 1024} // 20MB limit
        />
        <div className="mt-4 text-sm text-gray-500">
          <h2 className="font-medium mb-2">Supported Files:</h2>
          <ul className="list-disc list-inside">
            <li>Garmin FIT files (.fit)</li>
            <li>Maximum file size: 20MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};