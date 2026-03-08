<div align="center">
  <img src=".github/assets/banner.png" alt="Kubernetes Examples Banner" width="100%" />

  <h1>Kubernetes Examples</h1>

  <p>A comprehensive monorepo showcasing microservices, infrastructure as code, and Kubernetes deployments.</p>

![Github Actions](https://github.com/iamtanbirahmed/kubernetes-examples/actions/workflows/ci.yml/badge.svg)
![Github Actions](https://github.com/iamtanbirahmed/kubernetes-examples/actions/workflows/cd.yml/badge.svg)
![Github Actions](https://github.com/iamtanbirahmed/kubernetes-examples/actions/workflows/deploy-infrastructure.yml/badge.svg)
![Github Actions](https://github.com/iamtanbirahmed/kubernetes-examples/actions/workflows/destroy-infrastructure.yml/badge.svg)

![Node LTS](https://img.shields.io/node/v-lts/aws-cdk-lib)
![Nx](https://img.shields.io/badge/Nx-143055?style=flat&logo=nx&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=flat&logo=kubernetes&logoColor=white)
![AWS CDK](https://img.shields.io/badge/aws%20cdk-%23232F3E.svg?style=flat&logo=amazon-aws&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![Helm](https://img.shields.io/badge/helm-%230F1689.svg?style=flat&logo=helm&logoColor=white)

</div>

<br />

## 📖 Overview

This repository serves as a practical, production-ready example of how to build, package, and deploy modernized architectures using **Node.js, NestJS, AWS CDK, and Kubernetes**.

It focuses on a CQRS (Command Query Responsibility Segregation) microservices pattern, encompassing:

- Local development orchestrated with **Nx**.
- CI/CD pipelines managed by **GitHub Actions**.
- Infrastructure automation via **AWS CDK** (EKS, Networking, and external resources).
- Container orchestration via **Helm** charts for Kubernetes.

## 🏗️ Architecture & Structure

This project is built as an **Nx Monorepo**. The structure is outlined below:

```text
├── apps/               # NestJS Microservices (command, query, worker)
├── charts/             # Helm Charts for Kubernetes deployment
├── infra/              # AWS CDK Infrastructure definitions
├── packages/           # Shared libraries and internal dependencies
├── scripts/            # Helper bash scripts (e.g., semantic version tags, CI workflows)
└── .github/workflows/  # CI/CD GitHub Actions (CI & CD)
```

### Microservices

The backend uses **NestJS** separated into distinct bounded contexts:

- **`command`**: Handles incoming commands/mutations, validating and pushing state changes.
- **`query`**: Serves read-optimized data and projections.
- **`worker`**: Background processing, event handling, and asynchronous tasks.

## 🚀 Getting Started

### Prerequisites

You need the following tools installed:

- Node.js (LTS recommended)
- Docker Desktop
- AWS CLI & AWS CDK (for infrastructure deployment)
- Helm & kubectl (for Kubernetes interactions)
- `yq` (used in release scripts)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/iamtanbirahmed/kubernetes-examples.git
   cd kubernetes-examples
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run Nx commands:**
   ```bash
   npx nx run-many --target=build --all
   npx nx run-many --target=lint --all
   npx nx run-many --target=test --all
   ```

## 🛠️ Infrastructure & Deployment

The infrastructure is provisioned through **AWS CDK** in the `infra/` folder. The primary stacks manage:

- VPC and Subnets Configuration
- Relational Databases / Data Stores
- Amazon EKS Cluster configuration

### Deploy Infrastructure

```bash
npm run infra:deploy
```

### Deploying Helm Charts

The application payloads are packaged via generic Helm charts residing in (`charts/`).
This repository's continuous deployment strategy packages the newly built containers and upgrades the respective charts upon every published release.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes using conventional commits
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
