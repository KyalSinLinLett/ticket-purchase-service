import { App } from "./app";
import { configuration } from "config";
import { initModels } from "db/init";

import { UserController } from "controllers/UserController";
import { UserService } from "services/user";
import { UserRepository } from "services/user/user.repository";
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

import { AccessTokenService } from "services/accessToken";
import { AccessTokenRepository } from "services/accessToken/accessToken.repository";
const accessTokenRepository = new AccessTokenRepository();
const accessTokenService = new AccessTokenService(accessTokenRepository);

import { EventController } from "controllers/EventController";
import { EventService } from "services/event";
import { EventRepository } from "services/event/event.repository";
const eventRepository = new EventRepository();
const eventService = new EventService(eventRepository);

import { TicketController } from "controllers/TicketController";
import { TicketCategoryService } from "services/ticketCategory";
import { TicketCategoryRepository } from "services/ticketCategory/ticketCategory.repository";
const ticketCategoryRepository = new TicketCategoryRepository();
const ticketCategoryService = new TicketCategoryService(ticketCategoryRepository);

import { TicketService } from "services/ticket";
import { TicketRepository } from "services/ticket/ticket.repository";
const ticketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);

const {
  dbHost,
  dbPort,
  dbUsn,
  dbPassword,
  dbName,
  dbMaxConnection,
  serviceName,
  version,
} = configuration;

const app = new App(
  "/ticket-api",
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
  false
);

new UserController(app, userService, accessTokenService);
new EventController(app, eventService, ticketCategoryService);
new TicketController(app, ticketService, ticketCategoryService);

export { app };
