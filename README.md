# Nestjs Cloud Function Boilerplate
This project is a Google Cloud Function developed with NestJS for tracking and synchronizing bigquery data.

## Description

This application provides an API for:
- Retrieving the last 10 invoice records stored in the database
- Synchronizing data from BigQuery to the local database

The application is designed as a Cloud Function that can be deployed on Google Cloud Platform.

## Technologies

- Node.js 20.17.x
- NestJS 10.x
- Sequelize (ORM)
- Google Cloud BigQuery
- Jest (Testing)
- TypeScript

## Project Structure

```
├── src/
│   ├── controllers/        # Application controllers
│   ├── filters/            # Exception filters
│   ├── helpers/            # Helper functions
│   ├── middlewares/        # Application middlewares
│   ├── models/             # Data models and interfaces
│   ├── modules/            # NestJS modules
│   ├── services/           # Application services
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
├── test/                   # E2E tests and mocks
├── .gcloudignore           # Files ignored by Google Cloud
├── .gitignore              # Files ignored by Git
├── commitlint.config.js    # Commitlint configuration
├── jest.config.json        # Jest configuration
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Dependencies and scripts
├── runDeploy.sh            # Deployment script
├── sonar.properties        # SonarQube configuration
├── tsconfig.build.json     # TypeScript configuration for build
└── tsconfig.json           # TypeScript configuration
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jessusandres/nest-boilerplate
   cd nest-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   DB_CONNECTION=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=username
   DB_PASSWORD=password
   DB_DATABASE=db_name
   DB_LOGGER=true
   DB_SSL=false
   
   BQ_LOCATION=US
   BQ_PROJECT=gcp-project-name
   BQ_TABLE=table
   BQ_DATASET=dataset
   ```

## Execution

### Development

To run the application in development mode:

```bash
  npm run start:dev
```

### Production

To build the application for production:

```bash
  npm run build
```

To run the application in production mode:

```bash
  npm run start
```

## API Endpoints

### GET /api

Returns the last 10 invoice records ordered by creation date in descending order.

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "customerId": "string",
      "codigoClienteSap": "string",
      "sapInvoice": 123,
      "invoice": "string",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "metadata": {}
}
```

### POST /api

Synchronizes data from BigQuery to the local database.

**Response:**
```json
{
  "code": 200,
  "data": [
    {
      "field1": "value1",
      "field2": "value2"
    }
  ],
  "metadata": {}
}
```

## Testing

### Run unit tests

```bash
  npm run test
```

### Run tests with coverage

```bash
  npm run test:cov
```

### Run e2e tests

```bash
  npm run test:e2e
```

## Deployment

The project is configured to be deployed as a Cloud Function on Google Cloud Platform.

1. Make sure you have the Google Cloud SDK configured and properly authenticated.

2. Run the deployment script:
   ```bash
   ./runDeploy.sh
   ```

## License

ISC

## Author
Jesús Andrés Cumpa
