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
* **Backend:**
    * Node.js (running in Azure Container Apps)
    * Express.js for API endpoints
    * TypeScript for type safety
* **Cloud Infrastructure:**
    * Azure Container Apps for service hosting
    * Azure Blob Storage for file management
    * Azure Cosmos DB for data persistence
    * Azure OpenAI for ML/AI features

### Architecture Diagram

[User] --(HTTPS)--> [Azure Container Apps (Frontend - React)] --(API Calls)--> [Azure Container Apps (Backend - Node.js)]
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

### Development Process
1. Use feature branches for all changes
2. Run affected tests before commits
3. Ensure CI/CD pipeline passes
4. Review and update documentation

## IV. Project Phases & Tasks

### Phase 1: Infrastructure Setup ⏳
- [x] Task 1.1: Create Nx Workspace with React preset
- [x] Task 1.2: Configure frontend application
- [ ] Task 1.3: Setup backend API application
- [ ] Task 1.4: Configure shared libraries

### Phase 2: Azure Resources ⏳
- [ ] Task 2.1: Resource Group creation
- [ ] Task 2.2: Container Apps Environment
- [ ] Task 2.3: Blob Storage setup
- [ ] Task 2.4: Cosmos DB configuration
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
