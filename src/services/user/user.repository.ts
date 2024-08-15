import { User } from "db/init";
import { FindOptions, InferAttributes, InferCreationAttributes } from "sequelize";
import { IGenericRepository } from "types/index";

export class UserRepository implements IGenericRepository<User> {
    userModel: typeof User;
    constructor() {
        this.userModel = User;
    }

    async create(data: InferAttributes<User>) {
        return await this.userModel.create(data);
    }

    async findOne(conditions: FindOptions<User>) {
        return await this.userModel.findOne(conditions);
    }

    async findById(id: string) {
        return await this.userModel.findByPk(id);
    }

    async findAll() {
        return await this.userModel.findAll();
    }

    async update(id: string, updateData: InferAttributes<User>) {
        const user = await this.userModel.findByPk(id);
        if (user) {
            return await user.update(updateData);
        }
        return null;
    }

    async delete(id: string) {
        const user = await this.userModel.findByPk(id);
        if (user) {
            return await user.destroy();
        }
        return null;
    }
}