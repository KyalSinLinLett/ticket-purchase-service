// EventController.test.ts
import { EventController } from "controllers/EventController";
import { Request, Response, NextFunction } from "express";
import { mockApp, mockEventService, mockTicketCategoryService } from "../mocks";
import { HttpStatusCode } from "types/http";
import moment from "moment";

describe("EventController", () => {
    let eventController: EventController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        eventController = new EventController(mockApp, mockEventService, mockTicketCategoryService);

        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe("newEventApi", () => {
        it("should create a new event and return the event details", async () => {
            const mockEvent = { id: 1, name: "Sample Event" };
            mockEventService.createEvent = jest.fn().mockResolvedValue(mockEvent);
            mockTicketCategoryService.createBulkTicketCategory = jest.fn().mockResolvedValue([]);

            req.body = {
                name: "Sample Event",
                description: "Sample Description",
                start_time: new Date(),
                end_time: new Date(),
                venue: "Sample Venue",
                created_by: 1,
                ticket_categories: [
                    { max_count: 100, price: 50, category: "VIP" },
                ],
            };

            await eventController.newEventApi(req as Request, res as Response, next);

            expect(mockEventService.createEvent).toHaveBeenCalledWith(expect.objectContaining({
                name: "Sample Event",
                description: "Sample Description",
                start_time: expect.any(Date),
                end_time: expect.any(Date),
                venue: "Sample Venue",
                created_by: 1,
                created_at: expect.any(Date),
                updated_at: expect.any(Date)
            }));

            expect(mockTicketCategoryService.createBulkTicketCategory).toHaveBeenCalledWith(expect.any(Array));
        });

        it("should handle errors and call next", async () => {
            const error = new Error("Event creation failed");
            mockEventService.createEvent = jest.fn().mockRejectedValue(error);

            await eventController.newEventApi(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("editEventDetailsApi", () => {
        it("should update event details and return the updated event", async () => {
            const mockEvent = { id: 1, name: "Updated Event" };
            mockEventService.updateEvent = jest.fn().mockResolvedValue(mockEvent);

            req.body = {
                id: 1,
                name: "Updated Event",
                description: "Updated Description",
            };

            await eventController.editEventDetailsApi(req as Request, res as Response, next);

            expect(mockEventService.updateEvent).toHaveBeenCalledWith(1, expect.objectContaining({
                name: "Updated Event",
                description: "Updated Description",
                updated_at: expect.any(Date),
            }));
        });

        it("should handle errors and return a bad request", async () => {
            const error = new Error("Update failed");
            mockEventService.updateEvent = jest.fn().mockRejectedValue(error);

            req.body = { id: 1 };

            await eventController.editEventDetailsApi(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith({ status: 0, message: error.message });
        });
    });

    describe("getEventDetailsApi", () => {
        it("should retrieve event details by ID", async () => {
            const mockEvent = { id: 1, name: "Sample Event" };
            mockEventService.getEventById = jest.fn().mockResolvedValue(mockEvent);

            req.body = { id: 1 };

            await eventController.getEventDetailsApi(req as Request, res as Response, next);

            expect(mockEventService.getEventById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
            expect(res.json).toHaveBeenCalledWith(mockEvent);
        });

        it("should handle errors and call next", async () => {
            const error = new Error("Event not found");
            mockEventService.getEventById = jest.fn().mockRejectedValue(error);

            req.body = { id: 1 };

            await eventController.getEventDetailsApi(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("listEventsApi", () => {
        it("should list all events", async () => {
            const mockEvents = [{ id: 1, name: "Event 1" }, { id: 2, name: "Event 2" }];
            mockEventService.getAllEvents = jest.fn().mockResolvedValue(mockEvents);

            req.body = { name: "Event" };

            await eventController.listEventsApi(req as Request, res as Response, next);

            expect(mockEventService.getAllEvents).toHaveBeenCalledWith("Event");
            expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
            expect(res.json).toHaveBeenCalledWith(mockEvents);
        });

        it("should handle errors and call next", async () => {
            const error = new Error("Error fetching events");
            mockEventService.getAllEvents = jest.fn().mockRejectedValue(error);

            await eventController.listEventsApi(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
