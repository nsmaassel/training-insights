# Training Insights Project - Development Charter

## I. Overall Project Vision

* **Goal:** Enable users to upload their Garmin Connect training data (e.g., FIT files), analyze it for insights (like 80/20 intensity compliance, load progression), and eventually generate future workout suggestions based on their training history and goals.
* **Key Principles:**
    * **User-Centric:** Focus on providing actionable insights to the athlete.
    * **Nx-First Development:** Leverage Nx workspace features, generators, and best practices for all development.
    * **Iterative Development:** Build, test, and refine in small, manageable steps.
    * **Microsoft Ecosystem:** Leverage Azure services for scalability, data processing, and AI.
    * **Measurable Success:** Define clear acceptance criteria for each feature.

## II. Technology Stack & Architecture

### Core Stack
* **Workspace Management:**
    * Nx Monorepo for workspace management and task orchestration
    * Custom Nx generators for repeated patterns
    * Nx libraries for shared code and feature modules
* **Frontend:**
    * React with Vite (via Nx preset)
    * Module Federation for micro-frontend architecture (if needed)
    * Tailwind CSS for styling
    * tRPC client for type-safe API communication
* **Backend:**
    * Node.js (running in Azure Container Apps)
    * tRPC for type-safe API endpoints
    * TypeScript for type safety
    * Zod for runtime validation
* **Cloud Infrastructure:**
    * Azure Container Apps for service hosting
    * Azure Blob Storage for file management
    * Azure Cosmos DB for data persistence
    * Azure OpenAI for ML/AI features

### Architecture Diagram

[User] --(HTTPS)--> [Azure Container Apps (Frontend - React + tRPC Client)] --(tRPC over HTTP)--> [Azure Container Apps (Backend - Node.js + tRPC Server)]
^
| (Data Access)
|
+-----------------------------------+-----------------------------------+-----------------------------+
|                                   |                                   |                             |
[Azure Blob Storage (FIT Files)]    [Azure Cosmos DB (Activity Data)]   [Azure OpenAI (LLM)]

## III. Development Guidelines

### Nx Workspace Guidelines
* Use `nx generate` for creating new:
    * Applications (`nx g @nx/react:app`)
    * Libraries (`nx g @nx/react:lib` or `nx g @nx/node:lib`)
    * Components (`nx g @nx/react:component`)
    * Custom generators (`nx g @nx/plugin:generator`)
* Organize code into focused libraries:
    * `libs/shared/ui` - Reusable UI components
    * `libs/shared/utils` - Common utilities
    * `libs/feature-*` - Feature-specific code
    * `libs/data-access` - Data access and API interfaces

### Best Practices
* Follow Nx module boundary rules
* Write unit tests for all features
* Use TypeScript strictly
* Implement proper error handling
* Follow Azure security best practices
* Document all major components

### Testing Guidelines
* **Test Strategy:**
  - E2E Tests: Use real dependencies and integrations
    * MongoDB for data persistence
    * Real API endpoints
    * Actual file system operations
    * Minimal test doubles
  - Integration Tests: Focus on service boundaries
    * Real database connections
    * Actual file processing
    * External service integration points
  - Unit Tests: Pure logic only
    * Business rules
    * Data transformations
    * Utility functions

* **Test Data Management:**
  - Use shared test fixtures
  - Clean up test data after each run
  - Maintain test data isolation
  - Use meaningful test data examples

* **Test Environment:**
  - Local development:
    * MongoDB instance
    * Test file fixtures
    * Environment configuration
  - CI Pipeline:
    * Containerized services
    * Automated setup/teardown
    * Parallel test execution

* **Testing Best Practices:**
  - Write tests before implementation (TDD)
  - Focus on behavior over implementation
  - Use real dependencies by default
  - Keep tests simple and focused
  - Document test scenarios
  - Include error cases
  - Test accessibility
  - Verify performance metrics

### Development Process
1. Test-First Development
   - Write failing E2E test for feature
   - Implement minimal passing code
   - Add integration tests for boundaries
   - Unit test complex logic
   - Refactor and optimize
2. Code Review Requirements
   - All tests must pass
   - Test coverage requirements met
   - No unnecessary mocks
   - Clear test scenarios
   - Proper test cleanup
3. Continuous Integration
   - Automated test runs
   - Environment setup validation
   - Performance benchmarks
   - Code coverage reports

## IV. Project Phases & Tasks

### Phase 1: Infrastructure Setup ✅
- [x] Task 1.1: Create Nx Workspace with React preset
- [x] Task 1.2: Configure frontend application
- [x] Task 1.3: Setup backend API application with tRPC
- [x] Task 1.4: Configure shared libraries and data models

### Phase 2: Azure Resources ⏳
- [ ] Task 2.1: Resource Group creation
- [ ] Task 2.2: Container Apps Environment
- [ ] Task 2.3: Blob Storage setup for FIT files
- [ ] Task 2.4: Cosmos DB configuration for activity data
- [ ] Task 2.5: OpenAI resource deployment

### Phase 3: Core Features ⏳
- [ ] Task 3.1: File upload functionality
- [ ] Task 3.2: FIT file parsing
- [ ] Task 3.3: Activity data storage
- [ ] Task 3.4: Basic activity analysis
- [ ] Task 3.5: LLM integration

### Phase 4: Advanced Features 🔜
- [ ] Task 4.1: 80/20 analysis
- [ ] Task 4.2: Training load tracking
- [ ] Task 4.3: Workout recommendations
- [ ] Task 4.4: Data visualization

### Phase 5: Production Readiness 🔜
- [ ] Task 5.1: CI/CD pipeline
- [ ] Task 5.2: Monitoring setup
- [ ] Task 5.3: Production deployment
- [ ] Task 5.4: Documentation

## V. Acceptance Criteria

Each feature must meet these baseline criteria:
1. Proper Nx workspace integration
2. Unit test coverage (>80%)
3. E2E test coverage for critical paths
4. TypeScript strict mode compliance
5. Documentation
6. Accessibility compliance
7. Performance benchmarks met

## VI. Future Considerations

* Machine Learning integration for advanced analytics
* Social features for sharing and comparing
* Mobile app development
* Integration with other fitness platforms

---
Note: This is a living document. Update as the project evolves.
