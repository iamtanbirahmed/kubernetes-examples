# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run all tasks in parallel (what CI runs)
npx nx run-many -t lint test build typecheck --parallel=3

# Run a single target for a specific project
npx nx run command:build
npx nx run command:test
npx nx run command:lint
npx nx run command:serve   # dev server with hot reload

# Run a single test file
npx nx run command:test --testFile=apps/command/src/app/app.service.spec.ts

# Infrastructure (AWS CDK via Nx)
npm run infra:deploy                              # deploy all CDK stacks
npm run infra:destroy                             # destroy all CDK stacks
npx nx run aws:synth --configuration=staging      # synthesize CloudFormation templates
npx nx run aws:diff --configuration=staging       # diff against deployed stack
npx nx run aws:bootstrap                          # CDK bootstrap (first-time only)

# Release
npx nx release --skip-publish                     # version bump + GitHub release
```

## Architecture

This is an **Nx monorepo** with three workspaces: `apps/`, `packages/`, `infra/`.

### Apps (`apps/`)
Three **NestJS** microservices following a CQRS pattern:
- **`command`** — handles mutations/writes
- **`query`** — handles reads/projections
- **`worker`** — background processing and async tasks

Each app uses webpack for bundling (production build) and has `environment.ts` / `environment.prod.ts` / `environment.staging.ts` for config. Build output goes to `apps/<name>/dist/`.

### Charts (`charts/`)
Helm charts for Kubernetes deployment:
- **`k8s-examples/`** — umbrella chart that depends on `command`, `query`, `worker` sub-charts
- **`k8s-ingress/`** — ingress configuration
- Individual charts per service (`command/`, `query/`, `worker/`)

Chart versions are bumped automatically by `scripts/versionbump.sh` during CD runs.

### Infrastructure (`infra/aws/`)
**AWS CDK** (TypeScript) managing:
- VPC and networking
- Amazon EKS cluster
- Relational databases / data stores

Supports `staging`, `demo`, and `prod` configurations. The CDK app is invoked via Nx targets defined in `infra/aws/package.json`.

### CI/CD Flow
1. **CI** (`.github/workflows/ci.yml`): On PRs and pushes to `main` — runs `lint test build typecheck` via Nx.
2. **Release** (same CI workflow): On merge to `main`, `npx nx release` creates a GitHub release using conventional commits.
3. **CD** (`.github/workflows/cd.yml`): Triggered on release — bumps Helm chart versions, builds Docker images tagged as `<release-tag>` and `<release-tag>-<sha>`, pushes to Amazon ECR (`k8s-examples-command`, `k8s-examples-query`, `k8s-examples-worker`).
4. **Infrastructure deploy** (`.github/workflows/deploy-infrastructure.yml`): Manual `workflow_dispatch` only.

### Conventions
- Commits must follow **Conventional Commits** (enforced by commitlint + husky). Versioning is driven by commit types.
- The `packages/` directory is reserved for shared internal libraries (currently empty).
- Nx caches build artifacts in `.nx/cache/`; the CI pipeline caches this between runs.
- AWS region is `ca-central-1`.
