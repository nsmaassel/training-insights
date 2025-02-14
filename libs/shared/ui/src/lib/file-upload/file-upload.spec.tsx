import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { FileUpload } from './file-upload';
import { trpc } from '@training-insights/shared/trpc';

// Mock trpc
jest.mock('@training-insights/shared/trpc', () => ({
  trpc: {
    file: {
      upload: {
        useMutation: () => ({
          mutateAsync: jest.fn().mockResolvedValue({
            success: true,
            file: {
              name: 'test.fit',
              contentType: 'application/fit',
              size: 1024,
              lastModified: new Date(),
              etag: 'test-etag'
            }
          })
        })
      }
    }
  }
}));

describe('FileUpload', () => {
  const mockOnUploadComplete = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file upload interface', () => {
    render(<FileUpload />);
    expect(screen.getByText(/Click to upload or drag and drop/i)).toBeInTheDocument();
    expect(screen.getByText(/.fit files only/i)).toBeInTheDocument();
  });

  it('handles file selection and upload', async () => {
    render(
      <FileUpload 
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    const file = new File(['test data'], 'test.fit', { type: 'application/fit' });
    const input = screen.getByLabelText(/Click to upload or drag and drop/i);

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText(/Uploading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
    });
  });

  it('validates file size', async () => {
    const maxSize = 5; // 5 bytes
    render(
      <FileUpload 
        maxSize={maxSize}
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    const file = new File(['too large'], 'test.fit', { type: 'application/fit' });
    const input = screen.getByLabelText(/Click to upload or drag and drop/i);

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(mockOnError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('File size exceeds')
      })
    );
    expect(mockOnUploadComplete).not.toHaveBeenCalled();
  });

  it('handles upload errors', async () => {
    const mockError = new Error('Upload failed');
    jest.spyOn(trpc.file.upload, 'useMutation').mockReturnValueOnce({
      mutateAsync: jest.fn().mockRejectedValue(mockError)
    });

    render(
      <FileUpload 
        onUploadComplete={mockOnUploadComplete}
        onError={mockOnError}
      />
    );

    const file = new File(['test data'], 'test.fit', { type: 'application/fit' });
    const input = screen.getByLabelText(/Click to upload or drag and drop/i);

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(mockError);
      expect(mockOnUploadComplete).not.toHaveBeenCalled();
    });
  });
});