import { Ticket } from "db/init";
import { InferAttributes } from "sequelize";
import { IGenericRepository } from "types/index";

export class TicketRepository implements IGenericRepository<Ticket> {
    ticketModel: typeof Ticket;
    constructor() {
        this.ticketModel = Ticket;
    }

    async create(data: InferAttributes<Ticket>) {
        return await this.ticketModel.create(data);
    }

    async findById(id: string) {
        return await this.ticketModel.findByPk(id);
    }

    async findAll() {
        return await this.ticketModel.findAll();
    }

    async update(id: string, updateData: InferAttributes<Ticket>) {
        const ticket = await this.ticketModel.findByPk(id);
        if (ticket) {
            return await ticket.update(updateData);
        }
        return null;
    }

    async delete(id: string) {
        const ticket = await this.ticketModel.findByPk(id);
        if (ticket) {
            return await ticket.destroy();
        }
        return null;
    }
}

module.exports = TicketRepository;
