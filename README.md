# Training Insights

A platform for analyzing training data from Garmin Connect, providing insights into training patterns and analyzing intensity distribution.

## Current Status

This project is in active development. Check [DEVLOG.md](./DEVLOG.md) for the latest progress.

## Tech Stack

- **Frontend**: React + Vite (via Nx)
- **Backend**: Node.js + tRPC
- **Database**: MongoDB (local/CI), Cosmos DB (production)
- **Storage**: Azure Blob Storage (Azurite for local)
- **Testing**: Playwright (E2E), Vitest (Unit), React Testing Library
- **Infrastructure**: Docker, Azure Container Apps

## Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop
- Nx CLI (`npm install -g nx`)

### Setup
1. Install dependencies:
```bash
npm install
```

2. Start local services:
```bash
docker compose up -d
```

3. Start development servers:
```bash
nx serve training-insights          # Frontend on http://localhost:4200
nx serve training-insights-api      # API on http://localhost:3000
```

## Development

### Key Commands
```bash
# Development
nx serve training-insights          # Frontend
nx serve training-insights-api      # API

# Testing
nx test training-insights          # Frontend tests
nx test training-insights-api      # API tests
nx e2e training-insights-e2e      # E2E tests

# Build
nx build training-insights        # Frontend build
nx build training-insights-api    # API build

# Code Quality
nx lint                          # Lint all projects
nx format:write                  # Format code
```

### Project Structure
```
apps/
  training-insights/            # Frontend app
  training-insights-api/        # Backend API
  training-insights-e2e/        # E2E tests
libs/
  shared/
    data-access/               # Data models & API interfaces
    test-utils/               # Testing utilities
    trpc/                    # tRPC configuration
```

## Local Development

### Environment Setup
Create a `.env` file in the root:
```env
MONGODB_URL=mongodb://localhost:27017/training-insights
STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1
```

### Testing
See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for detailed testing strategy and guidelines.

## Documentation
- [Development Log](./DEVLOG.md) - Current progress and decisions
- [Project Charter](./INSTRUCTIONS.md) - Project goals and guidelines
- [API Documentation](./apps/training-insights-api/README.md) - API details

## Contributing
1. Check existing issues or create a new one
2. Create a feature branch
3. Write tests first (TDD approach)
4. Submit PR with link to related issue
