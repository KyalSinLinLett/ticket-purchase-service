import { UserService } from "services/user";
import { UserRepository } from 'services/user/user.repository';
import { User } from 'db/init';
import { FindOptions, InferAttributes } from 'sequelize';
import moment from "moment";

describe('Userservice unit tests', () => {
    let userService: UserService;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    const mockUserData: InferAttributes<User> = {
        email: "tester111@gmail.com",
        password_hash: "hashed_password",
        first_name: "tester",
        last_name: "retset",
        phone_number: "+66612341234",
        dob: new Date("2000-01-01"),
        country: "SG",
        last_login_at: null,
        is_active: true,
        created_at: moment().toDate(),
        updated_at: moment().toDate()
    };

    beforeEach(() => {
        userRepositoryMock = {
            create: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        userService = new UserService(userRepositoryMock);
    });

    it('should create a user', async () => {
        userRepositoryMock.create.mockResolvedValue(mockUserData as any);

        const result = await userService.createUser(mockUserData);

        expect(userRepositoryMock.create).toHaveBeenCalledWith(mockUserData);
        expect(result).toEqual(mockUserData);
    });

    it('should get a user by conditions', async () => {
        const condition: FindOptions<User> = { where: { email: 'tester111@gmail.com' } };
        userRepositoryMock.findOne.mockResolvedValue(mockUserData as any);

        const result = await userService.getUser(condition);

        expect(userRepositoryMock.findOne).toHaveBeenCalledWith(condition);
        expect(result).toEqual(mockUserData);
    });

    it('should get a user by ID', async () => {
        const id = '1';
        userRepositoryMock.findById.mockResolvedValue(mockUserData as any);

        const result = await userService.getUserById(id);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockUserData);
    });

    it('should get all users', async () => {
        const users: User[] = [mockUserData as any];
        userRepositoryMock.findAll.mockResolvedValue(users);

        const result = await userService.getAllUsers();

        expect(userRepositoryMock.findAll).toHaveBeenCalled();
        expect(result).toEqual(users);
    });

    it('should update a user', async () => {
        const id = '1';
        const updateData: InferAttributes<User> = {
            ...mockUserData,
            first_name: "updatedTester"
        };
        const updatedUser = { ...mockUserData, ...updateData } as any;
    
        userRepositoryMock.findById.mockResolvedValue(mockUserData as any);
        userRepositoryMock.update.mockResolvedValue(updatedUser);
    
        const result = await userService.updateUser(id, updateData);
    
        expect(userRepositoryMock.update).toHaveBeenCalledWith(id, updateData);
        expect(result).toEqual(updatedUser);
    });
    
    it('should delete a user', async () => {
        const id = '1';
    
        userRepositoryMock.findById.mockResolvedValue(mockUserData as any);
        userRepositoryMock.delete.mockResolvedValue(mockUserData as any);
    
        const result = await userService.deleteUser(id);
    
        expect(userRepositoryMock.delete).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockUserData);
    });    

    it('should handle create user failure', async () => {
        userRepositoryMock.create.mockRejectedValue(new Error('Creation failed'));

        await expect(userService.createUser(mockUserData)).rejects.toThrow('Creation failed');
    });

    it('should handle find user failure', async () => {
        const condition: FindOptions<User> = { where: { email: 'nonexistent@gmail.com' } };
        userRepositoryMock.findOne.mockRejectedValue(new Error('Find failed'));

        await expect(userService.getUser(condition)).rejects.toThrow('Find failed');
    });

    it('should handle get user by ID failure', async () => {
        const id = 'nonexistent-id';
        userRepositoryMock.findById.mockResolvedValue(null);

        const result = await userService.getUserById(id);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith(id);
        expect(result).toBeNull();
    });

    it('should handle get all users failure', async () => {
        userRepositoryMock.findAll.mockRejectedValue(new Error('Get all failed'));

        await expect(userService.getAllUsers()).rejects.toThrow('Get all failed');
    });

    it('should handle update user failure', async () => {
        const id = '1';
        const updateData: InferAttributes<User> = {
            ...mockUserData,
            first_name: "updateFailed"
        };
        userRepositoryMock.findById.mockResolvedValue(mockUserData as any);
        userRepositoryMock.update.mockRejectedValue(new Error('Update failed'));

        await expect(userService.updateUser(id, updateData)).rejects.toThrow('Update failed');
    });

    it('should handle delete user failure', async () => {
        const id = '1';
        userRepositoryMock.findById.mockResolvedValue(mockUserData as any);
        userRepositoryMock.delete.mockRejectedValue(new Error('Delete failed'));

        await expect(userService.deleteUser(id)).rejects.toThrow('Delete failed');
    });

    it('should handle empty user list', async () => {
        userRepositoryMock.findAll.mockResolvedValue([]);

        const result = await userService.getAllUsers();

        expect(userRepositoryMock.findAll).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('should create a user with optional fields', async () => {
        const partialUserData: InferAttributes<User> = {
            email: "optional@example.com",
            password_hash: "optional_password",
            first_name: "optional",
            last_name: "fields",
            phone_number: "+66698765432",
            dob: new Date("1990-01-01"),
            country: "US",
            last_login_at: null,
            is_active: true,
            created_at: moment().toDate(),
            updated_at: moment().toDate()
        };
        userRepositoryMock.create.mockResolvedValue(partialUserData as any);

        const result = await userService.createUser(partialUserData);

        expect(userRepositoryMock.create).toHaveBeenCalledWith(partialUserData);
        expect(result).toEqual(partialUserData);
    });

    it('should correctly handle cases where no user data is provided', async () => {
        const emptyData: InferAttributes<User> = {
            email: "",
            password_hash: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            dob: null,
            country: "",
            last_login_at: null,
            is_active: false,
            created_at: null,
            updated_at: null
        };
        userRepositoryMock.create.mockResolvedValue(emptyData as any);

        const result = await userService.createUser(emptyData);

        expect(userRepositoryMock.create).toHaveBeenCalledWith(emptyData);
        expect(result).toEqual(emptyData);
    });

    it('should handle invalid email format in user data', async () => {
        const invalidEmailData: InferAttributes<User> = {
            ...mockUserData,
            email: "invalid-email-format"
        };
        userRepositoryMock.create.mockResolvedValue(invalidEmailData as any);

        const result = await userService.createUser(invalidEmailData);

        expect(userRepositoryMock.create).toHaveBeenCalledWith(invalidEmailData);
        expect(result).toEqual(invalidEmailData);
    });

    it('should handle user data with extra fields gracefully', async () => {
        const extraFieldsData: any = {
            ...mockUserData,
            extra_field: "extra_value"
        };
        userRepositoryMock.create.mockResolvedValue(extraFieldsData);

        const result = await userService.createUser(extraFieldsData);

        expect(userRepositoryMock.create).toHaveBeenCalledWith(extraFieldsData);
        expect(result).toEqual(extraFieldsData);
    });

    it('should return null when no user is found with the given condition', async () => {
        const condition: FindOptions<User> = { where: { email: 'nonexistent@example.com' } };
        userRepositoryMock.findOne.mockResolvedValue(null);

        const result = await userService.getUser(condition);

        expect(userRepositoryMock.findOne).toHaveBeenCalledWith(condition);
        expect(result).toBeNull();
    });

    it('should return an empty array when no users are found', async () => {
        userRepositoryMock.findAll.mockResolvedValue([]);

        const result = await userService.getAllUsers();

        expect(userRepositoryMock.findAll).toHaveBeenCalled();
        expect(result).toEqual([]);
    });
    
    it('should handle user creation with incomplete data', async () => {
        // Incomplete user data with missing required fields
        const incompleteUserData: InferAttributes<User> = {
            email: "",  // Assuming email is required and cannot be empty
            password_hash: "",  // Assuming password_hash is required
            first_name: "",  // Assuming first_name is required
            last_name: "",  // Assuming last_name is required
            phone_number: "",  // Assuming phone_number is optional but included for completeness
            dob: null,  // Assuming dob is optional but included
            country: "",  // Assuming country is required
            last_login_at: null,
            is_active: false,
            created_at: null,
            updated_at: null
        };
    
        // Mock the repository to throw an error or return a specific response when incomplete data is used
        userRepositoryMock.create.mockRejectedValue(new Error('Invalid user data'));
    
        // Test to ensure the service throws an error for incomplete user data
        await expect(userService.createUser(incompleteUserData)).rejects.toThrow('Invalid user data');
    
        // Ensure the create method on the repository was called
        expect(userRepositoryMock.create).toHaveBeenCalledWith(incompleteUserData);
    });
    
});