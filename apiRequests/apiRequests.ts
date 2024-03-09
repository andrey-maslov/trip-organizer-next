import { Trip, UnsplashApiResponse } from '@/types/models'
import ky from 'ky'

const unsplashUrl = 'https://api.unsplash.com/search/photos'
const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export const getAllTrips = async (): Promise<{ trips: Trip[] }> =>
  ky('trips', { prefixUrl: '/api' }).json()

export const getOneTrip = async (id: string): Promise<Trip> =>
  ky(`trips/${id}`, { prefixUrl: '/api' }).json()

export const createTrip = async (
  data: Partial<Trip>
): Promise<{ id: string }> =>
  ky.post('trips', { prefixUrl: '/api', json: data }).json()

export const searchPictures = async (
  query: string
): Promise<UnsplashApiResponse> =>
  ky(
    `${unsplashUrl}?page=1&per_page=5&query=${query}&client_id=${unsplashKey}`
  ).json()
