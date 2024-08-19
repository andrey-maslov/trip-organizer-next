import ky from 'ky'

import { UnsplashApiResponse } from '@/types/models'

const unsplashUrl = 'https://api.unsplash.com/search/photos'
const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export const searchPictures = async (
  query: string
): Promise<UnsplashApiResponse> =>
  ky(
    `${unsplashUrl}?page=1&per_page=5&query=${query}&client_id=${unsplashKey}`
  ).json()
