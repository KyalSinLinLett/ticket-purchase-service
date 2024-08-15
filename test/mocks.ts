// mocks.ts
import { App } from 'app'
import { UserService } from 'services/user'
import { AccessTokenService } from 'services/accessToken'
import { EventService } from 'services/event'
import { TicketCategoryService } from 'services/ticketCategory'
import { TicketService } from 'services/ticket'

export const mockApp = {
  route: jest.fn(),
} as unknown as App

export const mockEventService = {
  createEvent: jest.fn(),
  updateEvent: jest.fn(),
  getEventById: jest.fn(),
  getAllEvents: jest.fn(),
} as unknown as EventService

export const mockTicketCategoryService = {
  createBulkTicketCategory: jest.fn(),
} as unknown as TicketCategoryService

export const mockTicketService = {
  getAllTickets: jest.fn(),
  getTicket: jest.fn(),
  createTicket: jest.fn(),
} as unknown as TicketService

export const mockUserService = {
  createUser: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
} as unknown as UserService

export const mockAccessTokenService = {
  getAccessToken: jest.fn(),
  createAccessToken: jest.fn(),
  updateAccessToken: jest.fn(),
} as unknown as AccessTokenService
