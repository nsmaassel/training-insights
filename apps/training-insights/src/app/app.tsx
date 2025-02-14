import { useState } from 'react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.fit')) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer transition duration-200"
            >
              Upload FIT file
            </label>
            {selectedFile && (
              <p className="mt-4 text-gray-600">Selected file: {selectedFile.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
