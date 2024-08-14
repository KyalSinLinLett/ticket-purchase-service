import { TicketCategory } from "db/init";
import { InferAttributes } from "sequelize";
import { IGenericRepository } from "types/index";

export class TicketCategoryRepository implements IGenericRepository<TicketCategory> {
    ticketCategoryModel: typeof TicketCategory;
    constructor() {
        this.ticketCategoryModel = TicketCategory;
    }

    async create(data: InferAttributes<TicketCategory>) {
        return await this.ticketCategoryModel.create(data);
    }

    async findById(id: string) {
        return await this.ticketCategoryModel.findByPk(id);
    }

    async findAll() {
        return await this.ticketCategoryModel.findAll();
    }

    async update(id: string, updateData: InferAttributes<TicketCategory>) {
        const ticketCategory = await this.ticketCategoryModel.findByPk(id);
        if (ticketCategory) {
            return await ticketCategory.update(updateData);
        }
        return null;
    }

    async delete(id: string) {
        const ticketCategory = await this.ticketCategoryModel.findByPk(id);
        if (ticketCategory) {
            return await ticketCategory.destroy();
        }
        return null;
    }
}

module.exports = TicketCategoryRepository;
