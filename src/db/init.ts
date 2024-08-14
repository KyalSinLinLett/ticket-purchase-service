import { sequelizeManager } from "app";
import { Sequelize } from "sequelize";
import { User, init as initUser } from "./models/User";
import { Event, init as initEvent } from "./models/Event";
import { Ticket, init as initTicket } from "./models/Ticket";
import { TicketCategory, init as initTicketCategory } from "./models/TicketCategory"

export const setupAssociations = (): void => {
    User.hasMany(Event, {
        foreignKey: 'created_by',
        as: 'events',
    });

    User.hasMany(Ticket, {
        foreignKey: 'user_id',
        as: 'tickets',
    });

    Event.hasMany(Ticket, {
        foreignKey: 'event_id',
        as: 'tickets',
    });

    Event.hasMany(TicketCategory, {
        foreignKey: 'event_id',
        as: 'ticketCategories',
    });

    Event.belongsTo(User, {
        foreignKey: 'created_by',
        as: 'creator',
    });

    Ticket.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'buyer',
    });

    Ticket.belongsTo(Event, {
        foreignKey: 'event_id',
        as: 'event',
    });

    Ticket.belongsTo(TicketCategory, {
        foreignKey: 'ticket_category_id',
        as: 'ticketCategory',
    });

    TicketCategory.hasMany(Ticket, {
        foreignKey: 'ticket_category_id',
        as: 'tickets',
    })

    TicketCategory.belongsTo(Event, {
        foreignKey: 'event_id',
        as: 'event',
    });
}

export const getSequelize = (): Sequelize => sequelizeManager.sequelize;

export const initModels = (seq: Sequelize): void => {
    initUser(seq);
    initEvent(seq);
    initTicket(seq);
    initTicketCategory(seq);
    setupAssociations();
};

export {
    User,
    Event,
    Ticket,
    TicketCategory
};
