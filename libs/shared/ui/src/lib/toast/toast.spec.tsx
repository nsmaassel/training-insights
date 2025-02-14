import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from './toast';

describe('Toast System', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const TestComponent = () => {
    const toast = useToast();
    return (
      <button onClick={() => toast({ title: 'Test Toast', status: 'success' })}>
        Show Toast
      </button>
    );
  };

  it('should show and hide toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    screen.getByText('Show Toast').click();
    expect(screen.getByText('Test Toast')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
  });

  it('should show multiple toasts', () => {
    const { getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    getByText('Show Toast').click();
    getByText('Show Toast').click();

    expect(screen.getAllByText('Test Toast')).toHaveLength(2);
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleError.mockRestore();
  });
});