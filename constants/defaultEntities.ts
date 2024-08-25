import { Section, Trip, TripPoint } from '@/types/models'
import { DEFAULT_SECTION_STATUS } from '@/constants/constants'

export const defaultTrip: Partial<Trip> = {
  name: 'new trip',
  sections: [],
}

export const defaultSection: Omit<Section, 'id' | '_id' | 'note'> = {
  name: 'New section',
  status: DEFAULT_SECTION_STATUS,
}

export const defaultCoverImage =
  'https://images.unsplash.com/photo-1541665728259-94dc0f5964d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzY5NzB8MHwxfHNlYXJjaHw1fHxqb3VybmV5JTIwM3xlbnwwfHx8fDE3MTYxMzYwNzh8MA&ixlib=rb-4.0.3&q=80&w=400'

export const fakeStartPoint: TripPoint = {
  name: 'Wroclaw',
  address: 'ul. Sucha 1, 50-086 Wrocław, Polska',
  dateTime: '2023-08-29T15:36:32.807Z',
  timeZone: 'Europe/Warsaw',
  // coordinates: '',
}

export const fakeAddresses = [{ label: 'Address 1', value: 'address_1' }]
