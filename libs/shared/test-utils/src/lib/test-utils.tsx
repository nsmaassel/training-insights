import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import '@testing-library/jest-dom';

export function TestUtils() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TestUtils!</h1>
    </div>
  );
}

// Add providers here as the app grows
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export * from '@testing-library/jest-dom';

// Override render method
export { customRender as render };

export default TestUtils;
