import moment from 'moment';
import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import { TicketCategory } from './TicketCategory';

export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    declare id?: string;
    declare name?: string;
    declare description?: string;
    declare start_time?: Date;
    declare end_time?: Date;
    declare venue?: string;
    declare created_by?: string;
    declare created_at?: Date;
    declare updated_at?: Date;

    declare ticketCategories: NonAttribute<TicketCategory[]>
}

export const init = (sequelize: Sequelize): void => {
    Event.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notNull: { msg: 'Event name must not be null' },
                    notEmpty: { msg: 'Event name must not be empty' }
                }
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: true
                }
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: true
                }
            },
            venue: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notNull: { msg: 'Venue must not be null' },
                    notEmpty: { msg: 'Venue must not be empty' }
                }
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: moment().toDate(),
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: moment().toDate(),
            },
        },
        {
            sequelize,
            modelName: "Event",
            freezeTableName: true,
            tableName: 'events',
            timestamps: false,
            underscored: true,
        }
    );
}
