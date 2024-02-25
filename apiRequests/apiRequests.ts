import { Trip } from '@/types/models'

export const getAllTrips = (): Promise<{ trips: Trip[] }> =>
  fetch('/api/trips').then((res) => res.json())

export const getOneTrip = (id: string): Promise<Trip> =>
  fetch(`/api/trips/${id}`).then((res) => res.json())
