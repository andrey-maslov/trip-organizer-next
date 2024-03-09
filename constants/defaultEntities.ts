import { Section, Trip } from '@/types/models'

export const defaultTrip: Partial<Trip> = {
  name: 'new trip',
  sections: [],
}

export const defaultSections: Partial<Section> = {}

export const defaultCoverImage =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400'
