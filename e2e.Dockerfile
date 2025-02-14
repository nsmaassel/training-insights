FROM mcr.microsoft.com/playwright:v1.40.1-focal

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy workspace configuration
COPY nx.json tsconfig.base.json ./
COPY apps/training-insights-e2e ./apps/training-insights-e2e
COPY libs ./libs

# Install browsers
RUN npx playwright install --with-deps chromium

# Run tests
CMD ["npx", "nx", "e2e", "training-insights-e2e", "--configuration=ci"]