import { Event } from 'db/init'

export type EventDetails = {
  id: string
  name: string
  description: string
  start_time: Date
  end_time: Date
  venue: string
  created_by: string
  created_at: Date
  updated_at: Date
}

export interface IEventDetails {
  id: string
  name: string
  description: string
  startTime: Date
  endTime: Date
  venue: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export const getEventDto = (event: Event): IEventDetails => {
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    startTime: event.start_time,
    endTime: event.end_time,
    venue: event.venue,
    createdBy: event.created_by,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  }
}
