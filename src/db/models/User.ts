import moment from 'moment'
import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import { isValidEmail, isValidPhoneNumber } from 'utils/validators'

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id?: string
  declare email?: string
  declare password_hash?: string
  declare first_name?: string
  declare last_name?: string
  declare phone_number?: string
  declare dob?: Date
  declare country?: string
  declare last_login_at?: Date
  declare is_active?: boolean
  declare created_at?: Date
  declare updated_at?: Date
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
        validate: {
          isValidEmail(value: string) {
            if (!isValidEmail(value)) {
              throw new Error('Invalid email format!')
            }
          },
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: { msg: 'Password hash must not be null' },
          notEmpty: { msg: 'Password hash must not be empty' },
        },
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isAlpha: { msg: 'First name be alphabetical' },
          notNull: { msg: 'First name must not be null' },
          notEmpty: { msg: 'First name must not be empty' },
        },
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isAlpha: { msg: 'Last name be alphabetical' },
          notNull: { msg: 'Last name must not be null' },
          notEmpty: { msg: 'Last name must not be empty' },
        },
      },
      phone_number: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
          isValidPhoneNumber(value: string) {
            if (!isValidPhoneNumber(value)) {
              throw new Error('Invalid phone number format!')
            }
          },
        },
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: { msg: 'Country must not be null' },
          notEmpty: { msg: 'Country must not be empty' },
        },
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
      modelName: 'User',
      freezeTableName: true,
      tableName: 'users',
      timestamps: false,
      underscored: true,
      hooks: {
        beforeCreate: async (user, options) => {
          const existingUser = await User.findOne({
            where: { email: user.email },
          })
          if (existingUser) {
            throw new Error('email already exists!')
          }
        },
      },
    },
  )
}
