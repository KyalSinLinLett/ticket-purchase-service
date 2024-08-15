import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes } from 'sequelize';
import { TicketCategories } from "types/models/ticketCategory"

export class TicketCategory extends Model<InferAttributes<TicketCategory>, InferCreationAttributes<TicketCategory>> {
    declare id?: string;
    declare event_id?: string;
    declare category?: TicketCategories;
    declare max_count?: number;
    declare price?: number;
}

export const init = (sequelize: Sequelize): void => {
    TicketCategory.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            event_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Event',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            category: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            max_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "Max count must me numeric" }
                }
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    isNumeric: { msg: "Ticket price must me numeric" }
                }
            },
        },
        {
            sequelize,
            modelName: "TicketCategory",
            freezeTableName: true,
            tableName: 'ticket_categories',
            timestamps: false,
            underscored: true,
        }
    );
}
