import { FindOptions, InferAttributes, Op } from 'sequelize'
import { EventRepository } from './event.repository'
import { Event, TicketCategory } from 'db/init'

export class EventService {
  eventRepository: EventRepository

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }

  async createEvent(data: InferAttributes<Event>) {
    return await this.eventRepository.create(data)
  }

  async getEventById(id: string) {
    return await this.eventRepository.findById(id)
  }

  async getAllEvents(name?: string) {
    const whereClause = {}
    if (name) whereClause['name'] = { [Op.like]: `%${name}%` }

    return await this.eventRepository.findAll({
      where: whereClause,
      include: { model: TicketCategory, as: 'ticketCategories' },
    })
  }

  async updateEvent(id: string, updateData: InferAttributes<Event>) {
    return await this.eventRepository.update(id, updateData)
  }

  async deleteEvent(id: string) {
    return await this.eventRepository.delete(id)
  }
}
