# test-utils

This library provides shared testing utilities for the Training Insights project.

## Philosophy

Our testing approach prioritizes:
- Testing units of functionality over implementation details
- Using real dependencies where practical instead of mocks
- Maintaining simple, readable tests that evolve with the codebase

## Usage

### For Unit Tests
```typescript
import { renderWithProviders } from '@training-insights/test-utils';

describe('MyComponent', () => {
  it('renders with real data', () => {
    renderWithProviders(<MyComponent />);
    // Test component behavior
  });
});
```

### For E2E Tests
Our E2E tests use real integrations by default. The test setup provides:
- Automated cleanup between tests
- Real tRPC client configuration
- Database state management

## Running Tests

- Unit tests: `nx test test-utils`
- E2E tests: `nx e2e training-insights-e2e`
- API E2E tests: `nx e2e training-insights-api-e2e`

## Best Practices

1. Focus on testing behavior over implementation
2. Use real dependencies when possible
3. Keep tests simple and maintainable
4. Test error cases and edge conditions
5. Clean up test data after each test

## Getting Help

See INSTRUCTIONS.md for detailed testing guidelines and acceptance criteria.
