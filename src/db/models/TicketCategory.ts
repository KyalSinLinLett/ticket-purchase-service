import { Model, DataTypes, Sequelize, InferCreationAttributes, InferAttributes } from 'sequelize';
import { TicketCategories } from "types/models/ticketCategory"

export class TicketCategory extends Model<InferAttributes<TicketCategory>, InferCreationAttributes<TicketCategory>> {
    public id!: string;
    public event_id!: string;
    public category!: TicketCategories;
    public max_count!: number;
    public price!: number;
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
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
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
