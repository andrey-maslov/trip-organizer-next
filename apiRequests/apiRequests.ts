import { Trip } from '@/types/models'
import ky from 'ky'

export const getAllTrips = async (): Promise<{ trips: Trip[] }> =>
  ky('trips', { prefixUrl: '/api' }).json()

export const getOneTrip = async (id: string): Promise<Trip> =>
  ky(`trips/${id}`, { prefixUrl: '/api' }).json()

export const createTrip = async (
  data: Partial<Trip>
): Promise<{ id: string }> =>
  ky.post('trips', { prefixUrl: '/api', json: data }).json()
