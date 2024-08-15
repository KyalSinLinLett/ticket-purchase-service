import { UserService } from "services/user";
import { UserRepository } from "services/user/user.repository";
const userRepository = new UserRepository();
export const userService = new UserService(userRepository);

import { AccessTokenService } from "services/accessToken";
import { AccessTokenRepository } from "services/accessToken/accessToken.repository";
const accessTokenRepository = new AccessTokenRepository();
export const accessTokenService = new AccessTokenService(accessTokenRepository);

import { EventService } from "services/event";
import { EventRepository } from "services/event/event.repository";
const eventRepository = new EventRepository();
export const eventService = new EventService(eventRepository);

import { TicketCategoryService } from "services/ticketCategory";
import { TicketCategoryRepository } from "services/ticketCategory/ticketCategory.repository";
const ticketCategoryRepository = new TicketCategoryRepository();
export const ticketCategoryService = new TicketCategoryService(ticketCategoryRepository);

import { TicketService } from "services/ticket";
import { TicketRepository } from "services/ticket/ticket.repository";
const ticketRepository = new TicketRepository();
export const ticketService = new TicketService(ticketRepository);