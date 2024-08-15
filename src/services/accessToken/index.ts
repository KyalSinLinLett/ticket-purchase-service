import { FindOptions, InferAttributes } from "sequelize";
import { AccessTokenRepository } from "./accessToken.repository";
import { AccessToken } from "db/init";

export class AccessTokenService {
    accessTokenRepository: AccessTokenRepository;

    constructor(accessTokenRepository: AccessTokenRepository) {
        this.accessTokenRepository = accessTokenRepository;
    }

    async createAccessToken(data: InferAttributes<AccessToken>) {
        return await this.accessTokenRepository.create(data);
    }

    async getAccessToken(condition: FindOptions<AccessToken>) {
        return await this.accessTokenRepository.findOne(condition);
    }

    async getAccessTokenById(id: string) {
        return await this.accessTokenRepository.findById(id);
    }

    async getAllAccessTokens() {
        return await this.accessTokenRepository.findAll();
    }

    async updateAccessToken(id: string, updateData: InferAttributes<AccessToken>) {
        return await this.accessTokenRepository.update(id, updateData);
    }

    async deleteAccessToken(id: string) {
        return await this.accessTokenRepository.delete(id);
    }
}