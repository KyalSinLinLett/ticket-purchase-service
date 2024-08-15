import { Event, TicketCategory } from 'db/init'
import { FindOptions, InferAttributes } from 'sequelize'
import { IGenericRepository } from 'types/index'

export class EventRepository implements IGenericRepository<Event> {
  eventModel: typeof Event
  constructor() {
    this.eventModel = Event
  }

  async create(data: InferAttributes<Event>) {
    return await this.eventModel.create(data)
  }

  async findById(id: string) {
    return await this.eventModel.findByPk(id, {
      include: { model: TicketCategory, as: 'ticketCategories' },
    })
  }

  async findAll(filter: FindOptions<Event>) {
    return await this.eventModel.findAll(filter)
  }

  async update(id: string, updateData: InferAttributes<Event>) {
    const event = await this.eventModel.findByPk(id)
    if (event) {
      return await event.update(updateData)
    }
    return null
  }

  async delete(id: string) {
    const event = await this.eventModel.findByPk(id)
    if (event) {
      return await event.destroy()
    }
    return null
  }
}
