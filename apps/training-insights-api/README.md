# Training Insights API

Backend API service for the Training Insights platform, built with Node.js, tRPC, and TypeScript.

## Overview

This API service handles:
- FIT file processing and storage
- Training data analysis
- Activity metrics calculation
- User data management
- AI-powered recommendations

## Technology Stack

- Node.js
- tRPC for type-safe API
- MongoDB (development) / Cosmos DB (production)
- Azure Blob Storage for file management
- TypeScript
- Jest for testing

## API Structure

### Routers
- `activity.router.ts` - Training activity management
- `file.router.ts` - File upload and processing
- `analysis.router.ts` - Training analysis endpoints
- `user.router.ts` - User management

### Core Procedures

```typescript
// Activity Management
createActivity: procedure
  .input(activitySchema)
  .mutation(async ({ input }) => {...})

// File Processing
uploadFitFile: procedure
  .input(fileUploadSchema)
  .mutation(async ({ input }) => {...})

// Analysis
getIntensityDistribution: procedure
  .input(dateRangeSchema)
  .query(async ({ input }) => {...})
```

## Development

### Prerequisites
- Node.js 18+
- MongoDB running locally (via Docker)
- Azure Storage Emulator (Azurite)

### Setup
1. Install dependencies:
```bash
npm install
```

2. Start required services:
```bash
docker compose up -d
```

3. Run development server:
```bash
nx serve training-insights-api
```

### Testing
```bash
# Unit tests
nx test training-insights-api

# E2E tests
nx e2e training-insights-api-e2e

# Test coverage
nx test training-insights-api --coverage
```

## API Documentation

### Authentication
All endpoints require authentication via Azure AD:
```typescript
// Example authentication header
headers: {
  'Authorization': 'Bearer ${token}'
}
```

### Error Handling
Standard error responses:
```typescript
{
  code: string;      // Error code
  message: string;   // Human-readable message
  details?: any;     // Additional error context
}
```

### Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user

## Deployment

### Azure Container Apps
1. Build container:
```bash
nx build training-insights-api --prod
docker build -t training-insights-api .
```

2. Push to Azure Container Registry:
```bash
az acr build --registry <registry-name> --image training-insights-api .
```

### Environment Variables
Required environment variables:
```env
NODE_ENV=production
MONGODB_URL=
AZURE_STORAGE_CONNECTION_STRING=
AZURE_AD_TENANT_ID=
AZURE_AD_CLIENT_ID=
```

## Monitoring

### Health Checks
- `/health` - Basic health check
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

### Metrics
- Request duration
- Error rates
- Active connections
- File processing queue length

## Security

- Azure AD authentication
- Rate limiting
- Input validation via Zod
- CORS configuration
- Security headers
- Request logging

## Contributing

1. Run tests before submitting PR
2. Follow TypeScript strict mode
3. Document API changes
4. Update test coverage