import * as EmailValidator from 'email-validator';
import PasswordValidator from "password-validator";
import { phone } from "phone";

import { check, body } from 'express-validator'

export const newUserValidator = [
  check('email').notEmpty().isEmail().withMessage('Must be a valid email address'),
  check('password').isLength({ min: 8, max: 25 }).withMessage('Password must be between 8-25 characters long'),
  check('first_name').notEmpty().withMessage('First name is required'),
  check('last_name').notEmpty().withMessage('Last name is required'),
  check('phone_number').isMobilePhone('any').withMessage('Must be a valid phone number'),
  check('dob').isDate().withMessage('Must be a valid date of birth'),
  check('country').notEmpty().withMessage('Country is required'),
];

export const authUserValidator = [
  check('email').notEmpty().isEmail().withMessage('Must be a valid email address'),
  check('password').isLength({ min: 8, max: 25 }).withMessage('Password must be between 8-25 characters long'),
];

export const editTicketCategoryValidator = [
  check('id')
    .isUUID()
    .withMessage('Must be a valid UUID'),

  check('max_count')
    .isInt({ min: 1 })
    .withMessage('max_count must be an integer greater than 0'),

  check('price')
    .isFloat({ min: 0.01 })
    .withMessage('price must be a positive number greater than 0'),
]

export const userPurchasedTicketsValidator = [
  check('user_id')
    .isUUID()
    .withMessage('Must be a valid UUID'),
];

export const getEventTicketsValidator = [
  check('event_id')
    .isUUID()
    .withMessage('Must be a valid UUID'),
];

export const getEventDetailsValidator = [
  check('id')
    .isUUID()
    .withMessage('Must be a valid UUID'),
];

export const purchaseTicketValidator = [
  check('ticket_category_id')
    .isUUID()
    .withMessage('ticket_category_id must be a valid UUID'),

  check('user_id')
    .isUUID()
    .withMessage('user_id must be a valid UUID'),
];

export const newEventValidator = [
  check('name')
    .notEmpty()
    .withMessage('Event name is required'),

  check('description')
    .notEmpty()
    .withMessage('Event description is required'),

  check('start_time')
    .isISO8601()
    .withMessage('start_time must be a valid ISO 8601 date'),

  check('end_time')
    .isISO8601()
    .withMessage('end_time must be a valid ISO 8601 date')
    .custom((end_time, { req }) => {
      if (new Date(end_time) <= new Date(req.body.start_time)) {
        throw new Error('end_time must be after start_time');
      }
      return true;
    }),

  check('venue')
    .notEmpty()
    .withMessage('Venue is required'),

  check('created_by')
    .isUUID()
    .withMessage('created_by must be a valid UUID'),

  body('ticket_categories')
    .isArray({ min: 1 })
    .withMessage('ticket_categories must be a non-empty array'),

  body('ticket_categories.*.category')
    .notEmpty()
    .withMessage('Each ticket category must have a name'),

  body('ticket_categories.*.max_count')
    .isInt({ min: 1 })
    .withMessage('Each ticket category must have a max_count greater than 0'),

  body('ticket_categories.*.price')
    .isFloat({ min: 0.01 })
    .withMessage('Each ticket category must have a price greater than 0'),
];

export const listEventsValidator = [
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Event name cannot be empty if provided'),
];

export const editEventDetailsValidator = [
  check('id')
    .isUUID()
    .withMessage('ID must be a valid UUID'),

  check('name')
    .notEmpty()
    .withMessage('Event name is required'),

  check('description')
    .notEmpty()
    .withMessage('Event description is required'),

  check('start_time')
    .isISO8601()
    .withMessage('start_time must be a valid ISO 8601 date'),

  check('end_time')
    .isISO8601()
    .withMessage('end_time must be a valid ISO 8601 date')
    .custom((end_time, { req }) => {
      if (new Date(end_time) <= new Date(req.body.start_time)) {
        throw new Error('end_time must be after start_time');
      }
      return true;
    }),

  check('venue')
    .notEmpty()
    .withMessage('Venue is required'),
];

export const isValidEmail = (email: string): boolean => {
  return EmailValidator.validate(email);
}

export const isValidPassword = (password: string): boolean => {
  if (!password) return false;

  const schema = new PasswordValidator();
  schema
    .is().min(8)
    .is().max(25)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123'])
  return schema.validate(password) as boolean;
}

export const isValidPhoneNumber = (phoneNumber: string) => {
  return phone(phoneNumber).isValid
}