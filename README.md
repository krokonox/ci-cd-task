# React Project with CI/CD Pipeline

This repository contains a simple React project created with Create React App and TypeScript, with a CI/CD pipeline set up using GitHub Actions. The pipeline includes steps for building, testing, and deploying the application to Vercel.

Production available at: https://ci-cd-task.vercel.app/

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [CI/CD Pipeline](#cicd-pipeline)
  - [Build and Test Workflow](#build-and-test-workflow)
  - [Deploy to Staging Workflow](#deploy-to-staging-workflow)
  - [Deploy to Production Workflow](#deploy-to-production-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- Node.js (version 20)
- npm (Node Package Manager)
- Git

## Project Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krokonox/ci-cd-task.git
   cd ci-cd-task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

## CI/CD Pipeline

The CI/CD pipeline is implemented using GitHub Actions and consists of three main workflows:

### Build and Test Workflow

This workflow runs on pull requests to any branch and pushes to any branch except `main`. It performs the following steps:
1. Checks out the source code.
2. Sets up Node.js.
3. Caches `node_modules`.
4. Installs dependencies.
5. Builds the project.
6. Uploads the build artifact with a version tag.
7. Runs tests.

```yaml
name: Build and Test

on:
  pull_request:
    branches: '*'
  push:
    branches-ignore: main
  workflow_dispatch:
  workflow_call:

env:
  artifactName: buildArtifact

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the repo source code
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Cache Node.js modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      - name: Install dependencies
        run: npm install --verbose
      - name: Build project
        run: npm run build --verbose
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${{ env.artifactName }}
          path: build/

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout the repo source code
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Cache Node.js modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      - name: Install dependencies
        run: npm install --verbose
      - name: Run tests
        run: npm test --verbose
```

### Deploy to Staging Workflow

This workflow triggers on pushes to the `main` branch and performs the following steps:
1. Runs the `build-and-test` workflow.
2. Downloads the build artifact.
3. Deploys the application to Vercel's staging environment.

```yaml
name: Deploy to Staging

on:
  push:
    branches: main

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  artifactName: buildArtifact
  projectName: "ci-cd-task"

jobs:
  build-and-test:
    uses: ./.github/workflows/build-and-test.yml
    secrets: inherit

  deploy-to-staging:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: ${{ env.artifactName }}
          path: ./buildArtifact
      - name: List build artifact directory
        run: ls -la ./buildArtifact
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

### Deploy to Production Workflow

This workflow can be manually triggered from the Actions tab and performs the following steps:
1. Runs the `build-and-test` workflow.
2. Downloads the build artifact.
3. Deploys the application to Vercel's production environment.

```yaml
name: Deploy to Production

on:
  workflow_dispatch:

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  artifactName: buildArtifact
  projectName: "ci-cd-task"

jobs:
  build-and-test:
    uses: ./.github/workflows/build-and-test.yml
    secrets: inherit

  deploy-to-production:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: ${{ env.artifactName }}
          path: ./buildArtifact
      - name: List build artifact directory
        run: ls -la ./buildArtifact
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```
