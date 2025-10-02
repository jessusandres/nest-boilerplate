<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# NestJS Boilerplate Service

Backoffice service built with NestJS (TypeScript). This project exposes an API with request validation, Swagger documentation, error filters, authentication/role guards, optional cache/Redis, rate limiting, and cloud storage (AWS S3 or Google Cloud Storage) selected via configuration.

## Requirements
- Node.js 18+
- pnpm 8+
- PostgreSQL (if you use the local database)
- Optional Redis (if you enable cache)

## Installation
```bash
  pnpm install
```

## Environment configuration
Create a `.env` file at the repository root using `.env.example` as a template.

Main variables (see all in `.env.example`):

- Application
  - APP_NAME=lookerdevelopers-boilerplate
  - API_VERSION=1
  - HOST=127.0.0.1
  - PORT=6001
  - PATH_PREFIX=ms  # global prefix for routes (e.g., /ms/health). If not set, code defaults to `api`.

- Database (PostgreSQL)
  - DB_CONNECTION=postgres
  - DB_HOST=127.0.0.1
  - DB_PORT=5432
  - DB_USERNAME=...
  - DB_PASSWORD=...
  - DB_DATABASE=...
  - DB_MAX_CONNECTIONS=10
  - DB_MIN_CONNECTIONS=1
  - DB_LOGGER=true
  - DB_SSL=false

- Redis (optional)
  - ENABLE_REDIS=false
  - REDIS_HOST=127.0.0.1
  - REDIS_PORT=6379
  - REDIS_PASSWORD=
  - REDIS_CA=

- Rate limiting
  - THROTTLE_TTL=1
  - THROTTLE_LIMIT=10

- File storage
  - STORAGE_PROVIDER=aws  # options: aws | gcp
  - BUCKET_NAME=
  - BUCKET_PROJECT_ID=

- AWS (With Identity Center)
  - S3_BUCKET_NAME=
  - AWS_REGION=us-east-1
  - AWS_PROFILE=

## Run
```bash
# Development
pnpm run start:dev

# Production (build + run)
pnpm run build && pnpm run start:prod

# Simple development mode
pnpm run start
```

The app starts with a global prefix defined by `PATH_PREFIX` (defaults to `api` when the env var is not set; `.env.example` shows `ms`).

- Swagger docs: `http://localhost:6001/docs`
- Health check (no prefix): `http://localhost:6001/health`

## Testing
```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# coverage
pnpm run test:cov
```

## Folder structure (src)
```
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── core
│   ├── config
│   │   ├── config.module.ts
│   │   ├── env.ts
│   │   ├── env.validator.ts
│   │   └── index.ts
│   ├── core.module.ts
│   ├── exceptions
│   │   └── index.ts
│   ├── health
│   │   ├── health.controller.spec.ts
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── logging
│   │   └── index.ts
│   └── swagger
│       └── index.ts
├── infrastructure
│   ├── cache
│   │   ├── app-cache.module.ts
│   │   ├── index.ts
│   │   ├── redis.factory.ts
│   │   ├── redis.service.spec.ts
│   │   └── redis.service.ts
│   ├── database
│   │   ├── database.module.ts
│   │   ├── index.ts
│   │   └── models
│   │       ├── country.entity.ts
│   │       ├── index.ts
│   │       └── interfaces
│   │           ├── country.interface.ts
│   │           └── index.ts
│   ├── http
│   │   └── index.ts
│   ├── infrastructure.module.ts
│   ├── limiter
│   │   ├── index.ts
│   │   └── throttler.module.ts
│   ├── queue
│   │   └── index.ts
│   └── storage
│       ├── aws-s3-storage.repository.ts
│       ├── gcp-storage.repository.spec.ts
│       ├── google-cloud-storage.repository.ts
│       ├── index.ts
│       ├── storage.module.ts
│       └── storage.repository.ts
├── modules
│   ├── auth
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   └── strategies/
│   ├── home
│   │   ├── commands/
│   │   │   ├── handlers/
│   │   │   └── impl/
│   │   ├── home.controller.spec.ts
│   │   ├── home.controller.ts
│   │   ├── home.module.ts
│   │   ├── home.service.spec.ts
│   │   ├── home.service.ts
│   │   └── queries/
│   │       ├── handlers/
│   │       ├── impl/
│   │       └── interfaces/
│   └── index.ts
└── shared
    ├── decorators/
    ├── dto/
    ├── enums/
    ├── filters/
    ├── guards/
    ├── helpers/
    ├── interceptors/
    ├── interfaces/
    ├── middlewares/
    ├── services/
    ├── shared.module.ts
    └── utils/
```

### Layer overview
- core: configuration, exceptions, health, logging, and Swagger.
- infrastructure: technical integrations (cache/Redis, DB, HTTP, rate limiting, queues, cloud storage).
- modules: domain use cases and controllers (e.g., auth, home).
- shared: cross-cutting utilities (DTOs, guards, filters, interceptors, services, helpers).

## File storage
- Supported providers: `aws` (S3) and `gcp` (Google Cloud Storage).
- Select via env: `STORAGE_PROVIDER=aws | gcp`.
- Relevant code: `src/infrastructure/storage/*` and consumer `src/shared/services/storage.service.ts`.

## Useful scripts
- Lint/format (if configured in package.json):
  - pnpm run lint
  - pnpm run format
- Build: `pnpm run build`

## Notes
- The global route prefix is defined with `PATH_PREFIX` and excludes `/health` (see `main.ts`).
- Swagger is available at `/docs`.
