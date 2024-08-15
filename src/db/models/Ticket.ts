import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

export class Ticket extends Model<
  InferAttributes<Ticket>,
  InferCreationAttributes<Ticket>
> {
  declare id?: string
  declare event_id: string
  declare user_id: string
  declare ticket_category_id: string
  declare price: number
  declare purchased_at: Date
}

export const init = (sequelize: Sequelize): void => {
  Ticket.init(
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      ticket_category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'TicketCategory',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isNumeric: { msg: 'Ticket price must me numeric' },
        },
      },
      purchased_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      tableName: 'tickets',
      timestamps: false,
      underscored: true,
    },
  )
}
