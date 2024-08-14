import { InferAttributes } from "sequelize";
import { TicketCategoryRepository } from "./ticketCategory.repository";
import { TicketCategory } from "db/init";

export class TicketCategoryService {
    ticketCategoryRepository: TicketCategoryRepository;

    constructor(ticketCategoryRepository: TicketCategoryRepository) {
        this.ticketCategoryRepository = ticketCategoryRepository;
    }

    async createTicketCategory(data: InferAttributes<TicketCategory>) {
        return await this.ticketCategoryRepository.create(data);
    }

    async getTicketGategoryById(id: string) {
        return await this.ticketCategoryRepository.findById(id);
    }

    async getAllTicketCategories() {
        return await this.ticketCategoryRepository.findAll();
    }

    async updateTicketCategory(id: string, updateData: InferAttributes<TicketCategory>) {
        return await this.ticketCategoryRepository.update(id, updateData);
    }

    async deleteTicketCategory(id: string) {
        return await this.ticketCategoryRepository.delete(id);
    }
}

module.exports = TicketCategoryService;
