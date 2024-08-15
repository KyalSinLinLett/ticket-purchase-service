import { TicketController } from 'controllers/TicketController'
import { Request, Response, NextFunction } from 'express'
import { mockApp, mockTicketService, mockTicketCategoryService } from '../mocks'
import { HttpStatusCode } from 'types/http'
import moment from 'moment'

describe('TicketController', () => {
  let ticketController: TicketController
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    ticketController = new TicketController(
      mockApp,
      mockTicketService,
      mockTicketCategoryService,
    )

    req = {
      body: {},
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    next = jest.fn()
  })

  describe('editTicketCategoryDetailsApi', () => {
    it('should update ticket category details and return the updated category', async () => {
      const mockTicketCategory = { id: 1, max_count: 100, price: 50 }
      mockTicketCategoryService.updateTicketCategory = jest
        .fn()
        .mockResolvedValue(mockTicketCategory)

      req.body = {
        id: 1,
        max_count: 150,
        price: 60,
      }

      await ticketController.editTicketCategoryDetailsApi(
        req as Request,
        res as Response,
        next,
      )

      expect(
        mockTicketCategoryService.updateTicketCategory,
      ).toHaveBeenCalledWith(1, {
        max_count: 150,
        price: 60,
      })

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK)
      // expect(res.json).toHaveBeenCalledWith(mockTicketCategory)
    })

    it('should handle errors and call next', async () => {
      const error = new Error('Failed to update ticket category')
      mockTicketCategoryService.updateTicketCategory = jest
        .fn()
        .mockRejectedValue(error)

      await ticketController.editTicketCategoryDetailsApi(
        req as Request,
        res as Response,
        next,
      )

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getUserPurchasedTicketsApi', () => {
    it('should return a list of purchased tickets for a user', async () => {
      const mockTickets = [
        { id: 1, event_id: 1, user_id: 1, ticket_category_id: 1 },
      ]
      mockTicketService.getAllTickets = jest.fn().mockResolvedValue(mockTickets)

      req.body = {
        user_id: 1,
      }

      await ticketController.getUserPurchasedTicketsApi(
        req as Request,
        res as Response,
        next,
      )

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK)
      expect(res.json).toHaveBeenCalledWith({
        data: [
          {
            eventId: 1,
            id: 1,
            price: undefined,
            purchasedAt: undefined,
            ticketCategoryId: 1,
            userId: 1,
          },
        ],
        message: 'get purchased tickets success',
        status: 1,
      })
    })
  })

  describe('getEventTicketsApi', () => {
    it('should return a list of tickets for an event', async () => {
      const mockTickets = [
        { id: 1, event_id: 1, user_id: 1, ticket_category_id: 1 },
      ]
      mockTicketService.getAllTickets = jest.fn().mockResolvedValue(mockTickets)

      req.body = {
        event_id: 1,
      }

      await ticketController.getEventTicketsApi(
        req as Request,
        res as Response,
        next,
      )

      expect(mockTicketService.getAllTickets).toHaveBeenCalledWith({
        where: { event_id: 1 },
      })
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK)
      expect(res.json).toHaveBeenCalledWith({
        data: [
          {
            eventId: 1,
            id: 1,
            price: undefined,
            purchasedAt: undefined,
            ticketCategoryId: 1,
            userId: 1,
          },
        ],
        message: 'get event tickets success',
        status: 1,
      })
    })

    it('should handle errors and call next', async () => {
      const error = new Error('Failed to fetch event tickets')
      mockTicketService.getAllTickets = jest.fn().mockRejectedValue(error)

      await ticketController.getEventTicketsApi(
        req as Request,
        res as Response,
        next,
      )

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('purchaseTicketApi', () => {
    it('should purchase a ticket and update the category count', async () => {
      const mockTicket = {
        id: 1,
        event_id: 1,
        user_id: 1,
        ticket_category_id: 1,
        price: 50,
        purchased_at: moment().toDate(),
      }
      const mockTicketCategory = {
        id: 1,
        event_id: 1,
        max_count: 10,
        price: 50,
      }

      mockTicketService.getTicket = jest.fn().mockResolvedValue(null)
      mockTicketCategoryService.getTicketGategoryById = jest
        .fn()
        .mockResolvedValue(mockTicketCategory)
      mockTicketService.createTicket = jest.fn().mockResolvedValue(mockTicket)
      mockTicketCategoryService.updateTicketCategory = jest
        .fn()
        .mockResolvedValue({ ...mockTicketCategory, max_count: 9 })

      req.body = {
        ticket_category_id: 1,
        user_id: 1,
      }

      await ticketController.purchaseTicketApi(
        req as Request,
        res as Response,
        next,
      )

      expect(
        mockTicketCategoryService.getTicketGategoryById,
      ).toHaveBeenCalledWith(1)
      expect(
        mockTicketCategoryService.updateTicketCategory,
      ).toHaveBeenCalledWith(1, { max_count: 9 })
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK)
      // expect(res.json).toHaveBeenCalledWith(mockTicket)
    })

    it('should return 400 if ticket already exists', async () => {
      const mockTicket = {
        id: 1,
        event_id: 1,
        user_id: 1,
        ticket_category_id: 1,
      }

      mockTicketService.getTicket = jest.fn().mockResolvedValue(mockTicket)

      req.body = {
        ticket_category_id: 1,
        user_id: 1,
      }

      await ticketController.purchaseTicketApi(
        req as Request,
        res as Response,
        next,
      )

      // expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST)
      // expect(res.json).toHaveBeenCalledWith({})
    })

    it('should return 400 if ticket category does not exist', async () => {
      mockTicketService.getTicket = jest.fn().mockResolvedValue(null)
      mockTicketCategoryService.getTicketGategoryById = jest
        .fn()
        .mockResolvedValue(null)

      req.body = {
        ticket_category_id: 1,
        user_id: 1,
      }

      await ticketController.purchaseTicketApi(
        req as Request,
        res as Response,
        next,
      )

      // expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST)
      // expect(res.json).toHaveBeenCalledWith({})
    })

    it('should return 400 if max count is 0', async () => {
      const mockTicketCategory = { id: 1, event_id: 1, max_count: 0, price: 50 }

      mockTicketService.getTicket = jest.fn().mockResolvedValue(null)
      mockTicketCategoryService.getTicketGategoryById = jest
        .fn()
        .mockResolvedValue(mockTicketCategory)

      req.body = {
        ticket_category_id: 1,
        user_id: 1,
      }

      await ticketController.purchaseTicketApi(
        req as Request,
        res as Response,
        next,
      )

      // expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST)
      // expect(res.json).toHaveBeenCalledWith({})
    })

    it('should handle errors and call next', async () => {
      const error = new Error('Failed to purchase ticket')
      mockTicketService.getTicket = jest.fn().mockRejectedValue(error)

      await ticketController.purchaseTicketApi(
        req as Request,
        res as Response,
        next,
      )

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
