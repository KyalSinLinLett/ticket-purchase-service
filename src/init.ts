import { App } from './app'
import { configuration } from 'config'
import { initModels } from 'db/init'

import { UserController } from 'controllers/UserController'
import { EventController } from 'controllers/EventController'
import { TicketController } from 'controllers/TicketController'
import {
  accessTokenService,
  eventService,
  ticketCategoryService,
  ticketService,
  userService,
} from 'utils/DI/container'

const {
  dbHost,
  dbPort,
  dbUsn,
  dbPassword,
  dbName,
  dbMaxConnection,
  serviceName,
  version,
} = configuration

const app = new App(
  '/ticket-api',
  version,
  serviceName,
  dbHost,
  dbPort,
  dbName,
  dbUsn,
  dbPassword,
  dbMaxConnection,
  initModels,
  false,
  false,
)

new UserController(app, userService, accessTokenService)
new EventController(app, eventService, ticketCategoryService)
new TicketController(app, ticketService, ticketCategoryService)

export { app }
