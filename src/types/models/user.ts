import { User } from 'db/init'
import { UserService } from 'services/user'

export type UserDetails = {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone_number: string
  dob: Date
  country: string
  last_login_at: Date
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface IUserDetails {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  dob: Date
  country: string
  lastLoginAt: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export const getUserDto = (user: User): IUserDetails => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phoneNumber: user.phone_number,
    dob: user.dob,
    country: user.country,
    lastLoginAt: user.last_login_at,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }
}

export type TUserService = typeof UserService
