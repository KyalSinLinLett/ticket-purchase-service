import { Ticket } from 'db/init'

export type TicketDetails = {
  id: string
  event_id: string
  user_id: string
  ticket_category_id: string
  price: number
  purchased_at: Date
}

export interface ITicketDetails {
  id: string
  eventId: string
  userId: string
  ticketCategoryId: string
  price: number
  purchasedAt: Date
}

export const getTicketDto = (ticket: Ticket) => {
  return {
    id: ticket.id,
    eventId: ticket.event_id,
    userId: ticket.user_id,
    ticketCategoryId: ticket.ticket_category_id,
    price: ticket.price,
    purchasedAt: ticket.purchased_at,
  }
}
