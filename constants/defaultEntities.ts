import { Note, Section, Trip } from '@/types/models'
import { DEFAULT_SECTION_STATUS } from '@/constants/constants'

export const defaultTrip: Partial<Trip> = {
  name: 'new trip',
  sections: [],
}

export const defaultSection: Omit<Section, 'id' | '_id'> = {
  name: 'New section',
  status: DEFAULT_SECTION_STATUS,
}

export const defaultCoverImage =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400'

export const defaultNote: Note = {
  id: '',
  sectionId: '',
  content: undefined,
}
