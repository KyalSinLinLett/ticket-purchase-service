import { FindOptions, InferAttributes } from "sequelize";
import { TicketRepository } from "./ticket.repository";
import { Ticket } from "db/init";

export class TicketService {
    ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async createTicket(data: InferAttributes<Ticket>) {
        return await this.ticketRepository.create(data);
    }

    async getTicketById(id: string) {
        return await this.ticketRepository.findById(id);
    }

    async getTicket(options: FindOptions<Ticket>) {
        return await this.ticketRepository.findOne(options);
    }

    async getAllTickets(filter: FindOptions<Ticket>) {
        return await this.ticketRepository.findAll(filter);
    }

    async updateTicket(id: string, updateData: InferAttributes<Ticket>) {
        return await this.ticketRepository.update(id, updateData);
    }

    async deleteTicket(id: string) {
        return await this.ticketRepository.delete(id);
    }
}