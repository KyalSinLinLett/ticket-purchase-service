import { TicketCategoryService } from "services/ticketCategory";
import { TicketCategoryRepository } from "services/ticketCategory/ticketCategory.repository";
import { TicketCategory } from "db/init";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { TicketCategories, TicketCategoryDetails } from "types/models/ticketCategory";

describe('TicketCategoryService unit tests', () => {
    let ticketCategoryService: TicketCategoryService;
    let ticketCategoryRepositoryMock: jest.Mocked<TicketCategoryRepository>;

    const mockTicketCategoryData = {
        id: "1",
        event_id: "event1",
        category: TicketCategories.VIP,
        max_count: 100,
        price: 500
    };

    beforeEach(() => {
        ticketCategoryRepositoryMock = {
            create: jest.fn(),
            createBulk: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<TicketCategoryRepository>;

        ticketCategoryService = new TicketCategoryService(ticketCategoryRepositoryMock);
    });

    it('should create a ticket category', async () => {
        ticketCategoryRepositoryMock.create.mockResolvedValue(mockTicketCategoryData as any);

        const result = await ticketCategoryService.createTicketCategory(mockTicketCategoryData);

        expect(ticketCategoryRepositoryMock.create).toHaveBeenCalledWith(mockTicketCategoryData);
        expect(result).toEqual(mockTicketCategoryData);
    });

    it('should create multiple ticket categories', async () => {
        const categories: TicketCategoryDetails[] = [mockTicketCategoryData];
        ticketCategoryRepositoryMock.createBulk.mockResolvedValue(categories as any);

        const result = await ticketCategoryService.createBulkTicketCategory(categories);

        expect(ticketCategoryRepositoryMock.createBulk).toHaveBeenCalledWith(categories);
        expect(result).toEqual(categories);
    });

    it('should get a ticket category by ID', async () => {
        const id = '1';
        ticketCategoryRepositoryMock.findById.mockResolvedValue(mockTicketCategoryData as any);

        const result = await ticketCategoryService.getTicketGategoryById(id);

        expect(ticketCategoryRepositoryMock.findById).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockTicketCategoryData);
    });

    it('should get all ticket categories', async () => {
        const categories: TicketCategoryDetails[] = [mockTicketCategoryData];
        ticketCategoryRepositoryMock.findAll.mockResolvedValue(categories as any);

        const result = await ticketCategoryService.getAllTicketCategories();

        expect(ticketCategoryRepositoryMock.findAll).toHaveBeenCalled();
        expect(result).toEqual(categories);
    });

    it('should update a ticket category', async () => {
        const id = '1';
        const updateData: Partial<TicketCategory> = { price: 600 };
        const updatedCategory = { ...mockTicketCategoryData, ...updateData };

        ticketCategoryRepositoryMock.findById.mockResolvedValue(mockTicketCategoryData as any);
        ticketCategoryRepositoryMock.update.mockResolvedValue(updatedCategory as any);

        const result = await ticketCategoryService.updateTicketCategory(id, updateData);

        expect(ticketCategoryRepositoryMock.update).toHaveBeenCalledWith(id, updateData);
        expect(result).toEqual(updatedCategory);
    });

    it('should delete a ticket category', async () => {
        const id = '1';

        ticketCategoryRepositoryMock.findById.mockResolvedValue(mockTicketCategoryData as any);
        ticketCategoryRepositoryMock.delete.mockResolvedValue(mockTicketCategoryData as any);

        const result = await ticketCategoryService.deleteTicketCategory(id);

        expect(ticketCategoryRepositoryMock.delete).toHaveBeenCalledWith(id);
        expect(result).toEqual(mockTicketCategoryData);
    });

    it('should handle create ticket category failure', async () => {
        ticketCategoryRepositoryMock.create.mockRejectedValue(new Error('Creation failed'));

        await expect(ticketCategoryService.createTicketCategory(mockTicketCategoryData)).rejects.toThrow('Creation failed');
    });

    it('should handle create multiple ticket categories failure', async () => {
        const categories: TicketCategoryDetails[] = [mockTicketCategoryData];
        ticketCategoryRepositoryMock.createBulk.mockRejectedValue(new Error('Bulk creation failed'));

        await expect(ticketCategoryService.createBulkTicketCategory(categories)).rejects.toThrow('Bulk creation failed');
    });

    it('should handle get ticket category by ID failure', async () => {
        const id = 'non-existent-id';
        ticketCategoryRepositoryMock.findById.mockResolvedValue(null);

        const result = await ticketCategoryService.getTicketGategoryById(id);

        expect(ticketCategoryRepositoryMock.findById).toHaveBeenCalledWith(id);
        expect(result).toBeNull();
    });

    it('should handle get all ticket categories failure', async () => {
        ticketCategoryRepositoryMock.findAll.mockRejectedValue(new Error('Get all failed'));

        await expect(ticketCategoryService.getAllTicketCategories()).rejects.toThrow('Get all failed');
    });

    it('should handle update ticket category failure', async () => {
        const id = '1';
        const updateData: Partial<TicketCategory> = { price: 600 };
        ticketCategoryRepositoryMock.findById.mockResolvedValue(mockTicketCategoryData as any);
        ticketCategoryRepositoryMock.update.mockRejectedValue(new Error('Update failed'));

        await expect(ticketCategoryService.updateTicketCategory(id, updateData)).rejects.toThrow('Update failed');
    });

    it('should handle delete ticket category failure', async () => {
        const id = '1';
        ticketCategoryRepositoryMock.findById.mockResolvedValue(mockTicketCategoryData as any);
        ticketCategoryRepositoryMock.delete.mockRejectedValue(new Error('Delete failed'));

        await expect(ticketCategoryService.deleteTicketCategory(id)).rejects.toThrow('Delete failed');
    });

    it('should handle creation of ticket category with missing optional fields', async () => {
        const partialTicketCategoryData = {
            category: "Standard"
        };
        ticketCategoryRepositoryMock.create.mockResolvedValue(partialTicketCategoryData as any);

        const result = await ticketCategoryService.createTicketCategory(partialTicketCategoryData as any);

        expect(ticketCategoryRepositoryMock.create).toHaveBeenCalledWith(partialTicketCategoryData);
        expect(result).toEqual(partialTicketCategoryData);
    });

    it('should handle creation with empty data', async () => {
        const emptyData = {};
        ticketCategoryRepositoryMock.create.mockResolvedValue(emptyData as any);

        const result = await ticketCategoryService.createTicketCategory(emptyData);

        expect(ticketCategoryRepositoryMock.create).toHaveBeenCalledWith(emptyData);
        expect(result).toEqual(emptyData);
    });

    it('should handle creation with invalid data', async () => {
        const invalidData: any = { invalidField: "invalidValue" };
        ticketCategoryRepositoryMock.create.mockResolvedValue(invalidData);

        const result = await ticketCategoryService.createTicketCategory(invalidData);

        expect(ticketCategoryRepositoryMock.create).toHaveBeenCalledWith(invalidData);
        expect(result).toEqual(invalidData);
    });

    it('should handle update with non-existent data', async () => {
        const id = 'non-existent-id';
        const updateData: Partial<TicketCategory> = { price: 700 };
        ticketCategoryRepositoryMock.findById.mockResolvedValue(null);

        const result = await ticketCategoryService.updateTicketCategory(id, updateData);

        expect(ticketCategoryRepositoryMock.update).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it('should handle delete with non-existent data', async () => {
        const id = 'non-existent-id';
        ticketCategoryRepositoryMock.findById.mockResolvedValue(null);

        const result = await ticketCategoryService.deleteTicketCategory(id);

        expect(ticketCategoryRepositoryMock.delete).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it('should handle find all with empty result', async () => {
        ticketCategoryRepositoryMock.findAll.mockResolvedValue([]);

        const result = await ticketCategoryService.getAllTicketCategories();

        expect(ticketCategoryRepositoryMock.findAll).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('should handle creation with only required fields', async () => {
        const requiredData = {
            category: "Standard",
            price: 100
        };
        ticketCategoryRepositoryMock.create.mockResolvedValue(requiredData as any);

        const result = await ticketCategoryService.createTicketCategory(requiredData as any);

        expect(ticketCategoryRepositoryMock.create).toHaveBeenCalledWith(requiredData);
        expect(result).toEqual(requiredData);
    });

    it('should handle creation with additional fields gracefully', async () => {
        const extraFieldsData: any = {
            ...mockTicketCategoryData,
            extra_field: "extra_value"
        };
        ticketCategoryRepositoryMock.create.mockResolvedValue(extraFieldsData);

        const result = await ticketCategoryService.createTicketCategory(extraFieldsData);

        expect(ticketCategoryRepositoryMock.create).toHaveBeenCalledWith(extraFieldsData);
        expect(result).toEqual(extraFieldsData);
    });
});