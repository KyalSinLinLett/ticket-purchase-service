import { API_PREFIX, AUTH_USER_API, HEALTH, NEW_USER_API } from './route'

export const NO_AUTH_PATHS = [
  API_PREFIX + HEALTH,
  API_PREFIX + NEW_USER_API,
  API_PREFIX + AUTH_USER_API,
]

export const SwaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Purchase Service API',
      version: '0.0.1',
      description: 'API documentation for Ticket Purchase Service',
    },
  },
  apis: ['src/app.ts'],
}
