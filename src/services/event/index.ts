import { InferAttributes } from "sequelize";
import { EventRepository } from "./event.repository";
import { Event } from "db/init";

export class EventService {
    eventRepository: EventRepository;

    constructor(eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
    }

    async createEvent(data: InferAttributes<Event>) {
        return await this.eventRepository.create(data);
    }

    async getEventById(id: string) {
        return await this.eventRepository.findById(id);
    }

    async getAllEvents() {
        return await this.eventRepository.findAll();
    }

    async updateEvent(id: string, updateData: InferAttributes<Event>) {
        return await this.eventRepository.update(id, updateData);
    }

    async deleteEvent(id: string) {
        return await this.eventRepository.delete(id);
    }
}