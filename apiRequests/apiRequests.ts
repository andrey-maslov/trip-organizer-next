import { Trip } from '@/types/models'

export const getAllTrips = (): Promise<{ trips: Trip[] }> =>
  fetch('/api/trips').then((res) => res.json())
