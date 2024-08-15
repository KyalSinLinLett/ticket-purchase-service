import { App } from "app";
import moment from "moment";
import { RequestHandler } from "express";
import { JsonResponse } from "types/index";
import { 
  EDIT_EVENT_DETAILS_API,
  GET_EVENT_DETAILS_API,
  LIST_EVENTS_API,
  NEW_EVENT_API 
} from "data/route";
import { EventService } from "services/event";
import { TicketCategoryService } from "services/ticketCategory";
import { 
  TicketCategories,
  TicketCategoryDetails 
} from "types/models/ticketCategory";
import { InferAttributes } from "sequelize";
import { Event } from "db/init";

export class EventController {
  app: App;
  eventService: EventService;
  ticketCategoryService: TicketCategoryService;
  constructor(
    app: App,
    eventService: EventService,
    ticketCategoryService: TicketCategoryService
  ) {
    this.app = app;
    this.eventService = eventService;
    this.ticketCategoryService = ticketCategoryService;
    this.initRoute();
  }

  editEventDetailsApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
    const {
      id,
      name,
      description,
      start_time,
      end_time,
      venue
    } = req.body;

    const updateData: InferAttributes<Event> = { updated_at: moment().toDate() };
    if (name) updateData["name"] = name;
    if (description) updateData["description"] = description;
    if (start_time) updateData["start_time"] = start_time;
    if (end_time) updateData["end_time"] = end_time;
    if (venue) updateData["venue"] = venue;

    const event = await this.eventService.updateEvent(id, updateData)

    return res.status(200).json(event);
  }

  listEventsApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
    // todo: add filters for the listing + pagination

    const result = await this.eventService.getAllEvents();

    return res.status(200).json(result);
  }

  getEventDetailsApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
    const { id } = req.body;

    const result = await this.eventService.getEventById(id);

    return res.status(200).json(result);
  }

  newEventApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {

    const {
      name,
      description,
      start_time,
      end_time,
      venue,
      created_by,
      ticket_categories
    } = req.body;

    const reqTicketCategories = ticket_categories as TicketCategoryDetails[]

    const now = moment().toDate();
    const event = await this.eventService.createEvent({
      name,
      description,
      start_time,
      end_time,
      venue,
      created_by,
      created_at: now,
      updated_at: now
    })

    await this.ticketCategoryService.createBulkTicketCategory(reqTicketCategories.map((tc: TicketCategoryDetails) => { return { max_count: tc.max_count, price: tc.price, category: TicketCategories[tc.category], event_id: event.id } }))

    const result = await this.eventService.getEventById(event.id);

    return res.status(200).json(result);
  }

  initRoute = (): void => {
    this.app.route(NEW_EVENT_API, this.newEventApi);
    this.app.route(GET_EVENT_DETAILS_API, this.getEventDetailsApi);
    this.app.route(LIST_EVENTS_API, this.listEventsApi);
    this.app.route(EDIT_EVENT_DETAILS_API, this.editEventDetailsApi);
  };
}
