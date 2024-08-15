import { AccessToken } from "db/init";
import { FindOptions, InferAttributes } from "sequelize";
import { IGenericRepository } from "types/index";

export class AccessTokenRepository implements IGenericRepository<AccessToken> {
    accessTokenModel: typeof AccessToken;
    constructor() {
        this.accessTokenModel = AccessToken;
    }

    async create(data: InferAttributes<AccessToken>) {
        return await this.accessTokenModel.create(data);
    }

    async findOne(conditions: FindOptions<AccessToken>) {
        return await this.accessTokenModel.findOne(conditions);
    }

    async findById(id: string) {
        return await this.accessTokenModel.findByPk(id);
    }

    async findAll() {
        return await this.accessTokenModel.findAll();
    }

    async update(id: string, updateData: InferAttributes<AccessToken>) {
        const token = await this.accessTokenModel.findByPk(id);
        if (token) {
            return await token.update(updateData);
        }
        return null;
    }

    async delete(id: string) {
        const token = await this.accessTokenModel.findByPk(id);
        if (token) {
            return await token.destroy();
        }
        return null;
    }
}