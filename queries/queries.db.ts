import ky from 'ky'

import { Note, Section, Trip, TripSummaryValues } from '@/types/types'

const api = ky.create({
  prefixUrl: '/api',
})

/******** TRIP ********/
export const getAllTrips = async (): Promise<{ trips: Trip[] }> =>
  api('trips').json()

export const getOneTrip = async (id: string): Promise<Trip> =>
  api(`trips/${id}`).json()

export const createTrip = async (
  data: Partial<Trip>
): Promise<{ id: string; slug: string }> =>
  api.post('trips', { json: data }).json()

export const deleteOneTrip = async (id: string): Promise<any> =>
  api.delete('trips', { json: { id } }).text()

export const updateTrip = async (
  data: Partial<Trip>
): Promise<{ id: string }> =>
  api.put(`trips/${data._id}`, { json: data }).json()

export const getTripSummary = async (
  id: string,
  currency: string
): Promise<TripSummaryValues> =>
  api(`trips/${id}/summary?currency=${currency}`).json()

/******** SECTION ******/
export const updateSection = async (
  trip: string, // slug or id
  sectionData: Partial<Section>
): Promise<any> =>
  api.put(`trips/${trip}/${sectionData.id}`, { json: sectionData }).json()

/******** NOTES ******/
export const getOneNote = async (id: string): Promise<Note> =>
  api(`notes/${id}`).json()

export const createNote = async (
  data: Partial<Note> & { tripId: string; sectionId: string }
): Promise<Note> => api.post('notes', { json: data }).json()

export const updateNote = async (data: Partial<Note>): Promise<Note> =>
  api.put(`notes/${data._id}`, { json: data }).json()

export const deleteOneNote = async ({
  noteId,
  sectionId,
  tripId,
}: {
  noteId: string
  sectionId: string
  tripId: string
}): Promise<any> =>
  api.delete('notes', { json: { noteId, sectionId, tripId } }).text()
