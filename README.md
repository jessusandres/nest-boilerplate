# lookerdevelopers-stores-svc-backoffice

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
  - APP_NAME=lookerdevelopers-stores-svc-backoffice
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
│   │           ├── country.entity.interface.ts
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
│       ├── gcp-storage.service.spec.ts
│       ├── google-cloud-storage.service.ts
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
