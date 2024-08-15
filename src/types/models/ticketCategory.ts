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
