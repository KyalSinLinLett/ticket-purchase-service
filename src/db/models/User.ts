import moment from 'moment';
import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id?: string;
    declare email: string;
    declare password_hash: string;
    declare first_name: string;
    declare last_name: string;
    declare phone_number: string;
    declare dob: Date;
    declare country: string;
    declare last_login_at: Date;
    declare is_active: boolean;
    declare created_at: Date;
    declare updated_at: Date;
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
            hooks: {
                beforeCreate: async (user, options) => {
                    const existingUser = await User.findOne({
                        where: { email: user.email },
                    });
                    if (existingUser) {
                        throw new Error("email already exists!");
                    }
                },
            },
        }
    );
}
