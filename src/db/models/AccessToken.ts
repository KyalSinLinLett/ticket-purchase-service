import {
    Model,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute,
    Sequelize,
    CreationOptional,
    DataTypes,
    Association
} from "sequelize";

import { User } from "./User"

export class AccessToken extends Model<
    InferAttributes<AccessToken>,
    InferCreationAttributes<AccessToken>
> {
    declare token: string;
    declare user_id: ForeignKey<User["id"]>;
    declare expiry: Date;
    declare invalidated: boolean;
    declare user_agent: string;
    declare registration_datetime: Date;
}

export const init = (sequelize: Sequelize): void => {
    AccessToken.init({
        token: {
            primaryKey: true,
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.STRING
        },
        expiry: {
            type: DataTypes.DATE,
        },
        invalidated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        user_agent: {
            type: DataTypes.STRING
        },
        registration_datetime: {
            type: DataTypes.DATE
        },
    }, {
        sequelize,
        modelName: "AccessToken",
        freezeTableName: true,
        tableName: 'access_token',
        createdAt: "registration_datetime",
        updatedAt: false,
        underscored: true,
    });
};
