import { EventService } from 'services/event';
import { EventRepository } from 'services/event/event.repository';
import { Event, TicketCategory } from 'db/init';
import { FindOptions, InferAttributes, Op } from 'sequelize';
import moment from 'moment';

describe('EventService unit tests', () => {
    let eventService: EventService;
    let eventRepositoryMock: jest.Mocked<EventRepository>;

    const st = moment("2024-08-15T11:54:32.107Z").toDate();
    const et = moment("2024-08-22T11:54:32.107Z").toDate();
    const mockEventData: InferAttributes<Event> = {
        id: '553b8580-febe-4dfe-843a-9b41ae8a9cc4',
        name: 'event_A',
        description: 'event_A_description',
        start_time: st,
        end_time: et,
        venue: 'event_A_venue',
        created_by: 'a3b7fdf8-6492-478f-a960-df187ff7f379'
    };

    const updatedEventData: InferAttributes<Event> = {
        id: '553b8580-febe-4dfe-843a-9b41ae8a9cc4',
        name: 'event_A edited',
        description: 'event_A_description edited',
        start_time: st,
        end_time: moment().add(2, 'week').toDate(),
        venue: 'event_A_venue edited'
    };

    beforeEach(() => {
        eventRepositoryMock = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<EventRepository>;

        eventService = new EventService(eventRepositoryMock);
    });

    it('should create an event', async () => {
        eventRepositoryMock.create.mockResolvedValue(mockEventData as any);

        const result = await eventService.createEvent(mockEventData);

        expect(eventRepositoryMock.create).toHaveBeenCalledWith(mockEventData);
        expect(result).toEqual(mockEventData);
    });

    it('should get an event by ID', async () => {
        eventRepositoryMock.findById.mockResolvedValue(mockEventData as any);

        const result = await eventService.getEventById(mockEventData.id);

        expect(eventRepositoryMock.findById).toHaveBeenCalledWith(mockEventData.id);
        expect(result).toEqual(mockEventData);
    });

    it('should get all events with name filter', async () => {
        const condition: FindOptions<Event> = {
            where: { name: { [Op.like]: `%event%` } },
            include: { model: TicketCategory, as: 'ticketCategories' }
        };
        eventRepositoryMock.findAll.mockResolvedValue([mockEventData] as any);

        const result = await eventService.getAllEvents('event');

        expect(eventRepositoryMock.findAll).toHaveBeenCalledWith(condition);
        expect(result).toEqual([mockEventData]);
    });

    it('should update an event', async () => {
        eventRepositoryMock.findById.mockResolvedValue(mockEventData as any);
        eventRepositoryMock.update.mockResolvedValue({ ...mockEventData, ...updatedEventData } as any);

        const result = await eventService.updateEvent(mockEventData.id, updatedEventData);

        expect(eventRepositoryMock.update).toHaveBeenCalledWith(mockEventData.id, updatedEventData);
        expect(result).toEqual({ ...mockEventData, ...updatedEventData });
    });

    it('should delete an event', async () => {
        eventRepositoryMock.findById.mockResolvedValue(mockEventData as any);
        eventRepositoryMock.delete.mockResolvedValue(null);

        const result = await eventService.deleteEvent(mockEventData.id);

        expect(eventRepositoryMock.delete).toHaveBeenCalledWith(mockEventData.id);
        expect(result).toBeNull();
    });

    it('should handle create event failure', async () => {
        eventRepositoryMock.create.mockRejectedValue(new Error('Creation failed'));

        await expect(eventService.createEvent(mockEventData)).rejects.toThrow('Creation failed');
    });

    it('should handle get event by ID failure', async () => {
        eventRepositoryMock.findById.mockResolvedValue(null);

        const result = await eventService.getEventById(mockEventData.id);

        expect(eventRepositoryMock.findById).toHaveBeenCalledWith(mockEventData.id);
        expect(result).toBeNull();
    });

    it('should handle get all events failure', async () => {
        eventRepositoryMock.findAll.mockRejectedValue(new Error('Get all failed'));

        await expect(eventService.getAllEvents()).rejects.toThrow('Get all failed');
    });

    it('should handle update event failure', async () => {
        eventRepositoryMock.findById.mockResolvedValue(mockEventData as any);
        eventRepositoryMock.update.mockRejectedValue(new Error('Update failed'));

        await expect(eventService.updateEvent(mockEventData.id, updatedEventData)).rejects.toThrow('Update failed');
    });

    it('should handle delete event failure', async () => {
        eventRepositoryMock.findById.mockResolvedValue(mockEventData as any);
        eventRepositoryMock.delete.mockRejectedValue(new Error('Delete failed'));

        await expect(eventService.deleteEvent(mockEventData.id)).rejects.toThrow('Delete failed');
    });

    it('should return empty array when no events are found', async () => {
        eventRepositoryMock.findAll.mockResolvedValue([]);

        const result = await eventService.getAllEvents();

        expect(eventRepositoryMock.findAll).toHaveBeenCalledWith({ where: {}, include: { model: TicketCategory, as: 'ticketCategories' } });
        expect(result).toEqual([]);
    });

    it('should create an event with optional fields', async () => {
        const partialEventData: InferAttributes<Event> = {
            id: 'new-id',
            name: 'new_event',
            description: 'new_event_description',
            start_time: st,
            end_time: et,
            venue: 'new_event_venue',
            created_by: 'new_user_id'
        };
        eventRepositoryMock.create.mockResolvedValue(partialEventData as any);

        const result = await eventService.createEvent(partialEventData);

        expect(eventRepositoryMock.create).toHaveBeenCalledWith(partialEventData);
        expect(result).toEqual(partialEventData);
    });

    it('should handle event creation with missing required fields', async () => {
        const incompleteEventData: InferAttributes<Event> = {
            id: '',
            name: '',
            description: '',
            start_time: null,
            end_time: null,
            venue: '',
            created_by: ''
        };

        eventRepositoryMock.create.mockRejectedValue(new Error('Invalid event data'));

        await expect(eventService.createEvent(incompleteEventData)).rejects.toThrow('Invalid event data');
    });

    it('should handle event data with extra fields gracefully', async () => {
        const extraFieldsData: any = {
            ...mockEventData,
            extra_field: 'extra_value'
        };
        eventRepositoryMock.create.mockResolvedValue(extraFieldsData as any);

        const result = await eventService.createEvent(extraFieldsData);

        expect(eventRepositoryMock.create).toHaveBeenCalledWith(extraFieldsData);
        expect(result).toEqual(extraFieldsData);
    });

    it('should return null when no event is found with the given condition', async () => {
        const condition: FindOptions<Event> = { where: { name: { [Op.like]: `%nonexistent_event%` } }, include: { model: TicketCategory, as: "ticketCategories" } };
        eventRepositoryMock.findAll.mockResolvedValue([]);

        const result = await eventService.getAllEvents('nonexistent_event');

        expect(eventRepositoryMock.findAll).toHaveBeenCalledWith(condition);
        expect(result).toEqual([]);
    });

    it('should handle event data with invalid start_time format', async () => {
        const invalidDateEventData = {
            ...mockEventData,
            start_time: 'invalid_date'
        };
        eventRepositoryMock.create.mockResolvedValue(invalidDateEventData as any);

        const result = await eventService.createEvent(invalidDateEventData as any);

        expect(eventRepositoryMock.create).toHaveBeenCalledWith(invalidDateEventData);
        expect(result).toEqual(invalidDateEventData);
    });

    it('should handle event data with invalid end_time format', async () => {
        const invalidDateEventData = {
            ...mockEventData,
            end_time: 'invalid_date'
        };
        eventRepositoryMock.create.mockResolvedValue(invalidDateEventData as any);

        const result = await eventService.createEvent(invalidDateEventData as any);

        expect(eventRepositoryMock.create).toHaveBeenCalledWith(invalidDateEventData);
        expect(result).toEqual(invalidDateEventData);
    });

    it('should correctly handle missing optional fields', async () => {
        const eventDataWithMissingOptionalFields: InferAttributes<Event> = {
            id: 'missing-fields-id',
            name: 'event_with_missing_fields',
            description: 'description',
            start_time: st,
            end_time: et,
            venue: 'venue',
            created_by: 'user_id'
        };
        eventRepositoryMock.create.mockResolvedValue(eventDataWithMissingOptionalFields as any);

        const result = await eventService.createEvent(eventDataWithMissingOptionalFields);

        expect(eventRepositoryMock.create).toHaveBeenCalledWith(eventDataWithMissingOptionalFields);
        expect(result).toEqual(eventDataWithMissingOptionalFields);
    });

    it('should handle event creation with empty data', async () => {
        const emptyEventData = {
            id: '',
            name: '',
            description: '',
            start_time: '',
            end_time: '',
            venue: '',
            created_by: ''
        };
        eventRepositoryMock.create.mockResolvedValue(emptyEventData as any);

        const result = await eventService.createEvent(emptyEventData as any);

        expect(eventRepositoryMock.create).toHaveBeenCalledWith(emptyEventData);
        expect(result).toEqual(emptyEventData);
    });

    it('should handle missing required fields during update', async () => {
        const incompleteUpdateData: InferAttributes<Event> = {
            name: '',  // Assuming name is required and cannot be empty
            description: '',
            start_time: null,
            end_time: null,
            venue: '',
            created_by: ''
        };

        eventRepositoryMock.findById.mockResolvedValue(mockEventData as any);
        eventRepositoryMock.update.mockRejectedValue(new Error('Invalid update data'));

        await expect(eventService.updateEvent(mockEventData.id, incompleteUpdateData)).rejects.toThrow('Invalid update data');

        expect(eventRepositoryMock.update).toHaveBeenCalledWith(mockEventData.id, incompleteUpdateData);
    });

    it('should return undefined when event to update is not found', async () => {
        eventRepositoryMock.findById.mockResolvedValue(null);

        const result = await eventService.updateEvent(mockEventData.id, updatedEventData);

        expect(result).toBeUndefined();
    });

    it('should handle update event with invalid data', async () => {
        const invalidUpdateData = {
            name: 'invalid_update_event',
            description: 'invalid_description',
            start_time: 'invalid_date',
            end_time: 'invalid_date',
            venue: 'invalid_venue',
            created_by: 'invalid_user_id'
        };

        eventRepositoryMock.findById.mockResolvedValue(mockEventData as any);
        eventRepositoryMock.update.mockResolvedValue(invalidUpdateData as any);

        const result = await eventService.updateEvent(mockEventData.id, invalidUpdateData as any);

        expect(eventRepositoryMock.update).toHaveBeenCalledWith(mockEventData.id, invalidUpdateData);
        expect(result).toEqual(invalidUpdateData);
    });

    it('should handle deletion of an event with non-existent ID', async () => {
        eventRepositoryMock.findById.mockResolvedValue(null);
        eventRepositoryMock.delete.mockRejectedValue(new Error('Delete failed'));

        await expect(eventService.deleteEvent(mockEventData.id)).rejects.toThrow('Delete failed');
    });
});