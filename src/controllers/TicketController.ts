import { App } from 'app'
import { RequestHandler } from 'express'
import moment from 'moment'
import { JsonResponse } from 'types/index'
import {
  EDIT_TICKET_CATEGORY_DETAILS_API,
  GET_EVENT_TICKETS_API,
  GET_USER_PURCHASED_TICKETS,
  PURCHASE_TICKET_API,
} from 'data/route'
import { TicketCategoryService } from 'services/ticketCategory'
import { FindOptions, InferAttributes } from 'sequelize'
import { Ticket, TicketCategory } from 'db/init'
import { TicketService } from 'services/ticket'
import {
  editTicketCategoryValidator,
  getEventTicketsValidator,
  purchaseTicketValidator,
  userPurchasedTicketsValidator,
} from 'utils/validators'

export class TicketController {
  app: App
  ticketService: TicketService
  ticketCategoryService: TicketCategoryService
  constructor(
    app: App,
    ticketService: TicketService,
    ticketCategoryService: TicketCategoryService,
  ) {
    this.app = app
    this.ticketService = ticketService
    this.ticketCategoryService = ticketCategoryService
    this.initRoute()
  }

  editTicketCategoryDetailsApi: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<JsonResponse> => {
    try {
      const { id, max_count, price } = req.body

      const updateData: InferAttributes<TicketCategory> = {}
      if (max_count) updateData['max_count'] = max_count
      if (price) updateData['price'] = price

      const ticketCategory =
        await this.ticketCategoryService.updateTicketCategory(id, updateData)

      return res.status(200).json(ticketCategory)
    } catch (e) {
      next(e)
    }
  }

  getUserPurchasedTicketsApi: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<JsonResponse> => {
    try {
      const { user_id } = req.body

      const tickets = await this.ticketService.getAllTickets(
        user_id ? { where: { user_id } } : {},
      )

      return res.status(200).json(tickets)
    } catch (e) {
      console.log(e)
    }
  }

  getEventTicketsApi: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<JsonResponse> => {
    try {
      const { event_id } = req.body

      const tickets = await this.ticketService.getAllTickets(
        event_id ? { where: { event_id } } : {},
      )

      return res.status(200).json(tickets)
    } catch (e) {
      next(e)
    }
  }

  purchaseTicketApi: RequestHandler = async (
    req,
    res,
    next,
  ): Promise<JsonResponse> => {
    try {
      const { ticket_category_id, user_id } = req.body

      const options: FindOptions<Ticket> = {
        where: { ticket_category_id, user_id },
      }

      const ticketExists = await this.ticketService.getTicket(options)

      if (ticketExists) return res.status(400).json({})

      const ticketCategory =
        await this.ticketCategoryService.getTicketGategoryById(
          ticket_category_id,
        )

      if (!ticketCategory) return res.status(400).json({})

      const maxCount = ticketCategory.max_count

      if (maxCount <= 0) return res.status(400).json({})

      const purchasedTicket = await this.ticketService.createTicket({
        event_id: ticketCategory.event_id,
        user_id,
        ticket_category_id,
        price: ticketCategory.price,
        purchased_at: moment().toDate(),
      })

      await this.ticketCategoryService.updateTicketCategory(
        ticket_category_id,
        { max_count: maxCount - 1 },
      )

      return res.status(200).json(purchasedTicket)
    } catch (e) {
      next(e)
    }
  }

  initRoute = (): void => {
    this.app.route(
      GET_EVENT_TICKETS_API,
      this.getEventTicketsApi,
      getEventTicketsValidator,
    )
    this.app.route(
      PURCHASE_TICKET_API,
      this.purchaseTicketApi,
      purchaseTicketValidator,
    )
    this.app.route(
      GET_USER_PURCHASED_TICKETS,
      this.getUserPurchasedTicketsApi,
      userPurchasedTicketsValidator,
    )
    this.app.route(
      EDIT_TICKET_CATEGORY_DETAILS_API,
      this.editTicketCategoryDetailsApi,
      editTicketCategoryValidator,
    )
  }
}
