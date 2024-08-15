import { App } from "app";
import { RequestHandler } from "express";
import { Details } from "express-useragent";
import moment from "moment";
import { HttpStatusCode } from "types/http";
import { JsonResponse } from "types/index";
import { configuration } from "config";
import { EDIT_EVENT_DETAILS_API, EDIT_TICKET_CATEGORY_DETAILS_API, GET_EVENT_DETAILS_API, GET_EVENT_TICKETS_API, GET_USER_PURCHASED_TICKETS, LIST_EVENTS_API, NEW_EVENT_API, PURCHASE_TICKET_API } from "data/route";
import { EventDetails } from "types/models/event";
import { EventService } from "services/event";
import { TicketCategoryService } from "services/ticketCategory";
import { TicketCategories, TicketCategoryDetails } from "types/models/ticketCategory";
import { FindOptions, InferAttributes } from "sequelize";
import { Event, Ticket, TicketCategory } from "db/init";
import { TicketService } from "services/ticket";

export class TicketController {
    app: App;
    ticketService: TicketService;
    ticketCategoryService: TicketCategoryService;
    constructor(
        app: App,
        ticketService: TicketService,
        ticketCategoryService: TicketCategoryService
    ) {
        this.app = app;
        this.ticketService = ticketService;
        this.ticketCategoryService = ticketCategoryService;
        this.initRoute();
    }

    testHandler: RequestHandler = (req, res, next): void => { }

    editTicketCategoryDetailsApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
        const {
            id,
            max_count,
            price
        } = req.body;

        const updateData: InferAttributes<TicketCategory> = {};
        if (max_count) updateData["max_count"] = max_count;
        if (price) updateData["price"] = price;

        const ticketCategory = await this.ticketCategoryService.updateTicketCategory(id, updateData)

        return res.status(200).json(ticketCategory);
    }


    getUserPurchasedTicketsApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
        // pagination
        const { user_id } = req.body;

        const tickets = await this.ticketService.getAllTickets(user_id ? { where: { user_id } } : {});

        return res.status(200).json(tickets)
    }

    getEventTicketsApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
        // pagination
        const { event_id } = req.body;

        const tickets = await this.ticketService.getAllTickets(event_id ? { where: { event_id } } : {});

        return res.status(200).json(tickets)
    }

    purchaseTicketApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
        const { ticket_category_id, user_id } = req.body;

        const options: FindOptions<Ticket> = { where: { ticket_category_id, user_id } }

        const ticketExists = await this.ticketService.getTicket(options);

        if (ticketExists) return res.status(400).json({});

        const ticketCategory = await this.ticketCategoryService.getTicketGategoryById(ticket_category_id);

        if (!ticketCategory) return res.status(400).json({});

        const maxCount = ticketCategory.max_count;

        if (maxCount <= 0) return res.status(400).json({});

        const purchasedTicket = await this.ticketService.createTicket({ event_id: ticketCategory.event_id, user_id, ticket_category_id, price: ticketCategory.price, purchased_at: moment().toDate() })

        await this.ticketCategoryService.updateTicketCategory(ticket_category_id, { max_count: maxCount - 1 });

        return res.status(200).json(purchasedTicket)
    }

    initRoute = (): void => {
        this.app.route(GET_EVENT_TICKETS_API, this.getEventTicketsApi);
        this.app.route(PURCHASE_TICKET_API, this.purchaseTicketApi);
        this.app.route(GET_USER_PURCHASED_TICKETS, this.getUserPurchasedTicketsApi);
        this.app.route(EDIT_TICKET_CATEGORY_DETAILS_API, this.editTicketCategoryDetailsApi);
    };
}
