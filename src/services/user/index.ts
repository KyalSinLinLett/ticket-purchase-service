import { CreationOptional, FindOptions, InferAttributes, InferCreationAttributes } from "sequelize";
import { UserRepository } from "./user.repository";
import { User } from "db/init";

export class UserService {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(data: InferAttributes<User>) {
        return await this.userRepository.create(data);
    }

    async getUser(condition: FindOptions<User>) {
        return await this.userRepository.findOne(condition);
    }
    
    async getUserById(id: string) {
        return await this.userRepository.findById(id);
    }

    async getAllUsers() {
        return await this.userRepository.findAll();
    }

    async updateUser(id: string, updateData: InferAttributes<User>) {
        return await this.userRepository.update(id, updateData);
    }

    async deleteUser(id: string) {
        return await this.userRepository.delete(id);
    }
}