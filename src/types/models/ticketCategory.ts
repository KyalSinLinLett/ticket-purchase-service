import { TicketCategory } from 'db/init'

export enum TicketCategories {
  VIP = 'VIP',
  GA = 'General Admissions',
  EB = 'Early Bird',
}

export type TicketCategoryDetails = {
  id: string
  event_id: string
  category: TicketCategories
  max_count: number
  price: number
}

export interface ITicketCategoryDetails {
  id: string
  eventId: string
  category: TicketCategories
  maxCount: number
  price: number
}

export const getTicketCategoryDto = (ticketCategory: TicketCategory) => {
  return {
    id: ticketCategory.id,
    eventId: ticketCategory.event_id,
    category: ticketCategory.category,
    maxCount: ticketCategory.max_count,
    price: ticketCategory.price,
  }
}
