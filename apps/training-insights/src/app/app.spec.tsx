import { render, screen, fireEvent } from '@training-insights/shared/test-utils';
import App from './app';

describe('Homepage', () => {
  it('should render welcome message and upload section', () => {
    render(<App />);
    
    expect(screen.getByRole('heading', { name: /Training Insights/i })).toBeInTheDocument();
    expect(screen.getByText(/Upload your training data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload FIT file/i)).toBeInTheDocument();
  });

  it('should handle FIT file upload', () => {
    render(<App />);
    
    const file = new File(['dummy content'], 'test.fit', { type: 'application/octet-stream' });
    const fileInput = screen.getByLabelText(/Upload FIT file/i);
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText(/Selected file: test.fit/i)).toBeInTheDocument();
  });

  it('should not display selected file message when no file is uploaded', () => {
    render(<App />);
    
    expect(screen.queryByText(/Selected file:/i)).not.toBeInTheDocument();
  });
});
