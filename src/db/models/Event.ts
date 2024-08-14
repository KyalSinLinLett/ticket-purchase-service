import moment from 'moment';
import { Model, DataTypes, Sequelize } from 'sequelize';

export class Event extends Model {
    public id!: string;
    public name!: string;
    public description?: string;
    public start_time!: Date;
    public end_time!: Date;
    public venue!: string;
    public created_by!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
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
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            venue: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
                onDelete: 'CASCADE',
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
