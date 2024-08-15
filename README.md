# Ticket Purchase Service

This service facilitates the purchasing of event tickets.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone git@github.com:KyalSinLinLett/ticket-purchase-service.git
cd ticket-purchase-service
```

### 2. Install Dependencies

```bash
yarn
```

### 3. Set Up the Database

Run the PostgreSQL service using Docker:

```bash
docker-compose -f postgres.yaml up -d
```

Ensure you set the environment variables in the `.env` file. You can follow the
format provided in `.env.sample`.

### 4. Run the Service Locally

```bash
yarn start
```

### 5. Run Tests

```bash
yarn test
```

### 6. Deployment: Build the Docker Image

```bash
docker build . -t ticket-purchase-service:latest
```

### 7. View API Documentation

You can view the OpenAPI Swagger documentation locally at:
[http://localhost:3010/docs/](http://localhost:3010/docs/)

### 8. Build API Documentation

If there are updates to the API specs, rebuild the documentation with:

```bash
npx @redocly/cli build-docs ./src/docs/api-spec.yaml -o ./src/docs/api-spec.html
```

## Self-Reflection and Future Improvements

There are several areas where this project can be further enhanced:

- **Performance Optimization:** Implement pagination and caching to improve
  performance.
- **Testing:** Expand and refine the test suite to ensure comprehensive
  coverage.
- **Security:** Incorporate security best practices, such as rate limiting, to
  protect the service.
