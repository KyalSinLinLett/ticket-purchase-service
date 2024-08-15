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

export type TUserService = typeof UserService
