import moment from 'moment';
import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    public id!: string;
    public email!: string;
    public password_hash!: string;
    public first_name!: string;
    public last_name!: string;
    public phone_number!: string;
    public dob!: Date;
    public country!: string;
    public last_login_at!: Date;
    public is_active!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
}

export const init = (sequelize: Sequelize): void => {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            first_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            phone_number: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            dob: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1,
                allowNull: false,
            },
            last_login_at: {
                type: DataTypes.DATE,
                defaultValue: moment().toDate(),
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
            modelName: "User",
            freezeTableName: true,
            tableName: 'users',
            timestamps: false,
            underscored: true,
        }
    );
}
