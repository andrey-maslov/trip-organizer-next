import { Types } from 'mongoose'

import {
  placementTypes,
  serviceProviderTypes,
  statusTypes,
  transportTypes,
} from '@/constants/constants'

export type MakeOptional<T, K extends keyof T> =
  Omit<T, K> & Partial<Pick<T, K>>;

export type DateType = Date | string | undefined

export type Trip = {
  _id: string
  name: string
  slug: string
  sections: Section[]
  exchangeRates: ExchangeRates
  dateTimeStart?: DateType
  dateTimeEnd?: DateType
  description?: string
  cover?: string
  user?: string // TODO change to userId
  userId?: string // to connect with mongoDB
}

export type Section = {
  _id: string
  name: string
  status: Status
  type: string
  isEnabled: boolean
  dateTimeStart?: string // TODO Remove after the TripPoint implementation
  dateTimeEnd?: string // TODO Remove after the TripPoint implementation
  startingPoint: TripPoint
  endPoint: TripPoint
  transportType?: TransportType
  placementType?: PlacementType
  serviceProvider?: {
    type?: string
    name?: string
    url?: string
  }
  payments?: Expense[] // TODO replace 'price' and 'payment' to one name: Expense/expenses
  note?: Types.ObjectId | string
}

export type SectionFE = MakeOptional<Section, "_id"> & { id: string }

export type TransportType = (typeof transportTypes)[number]
export type Status = (typeof statusTypes)[number]
export type SectionType = (typeof serviceProviderTypes)[number]
export type PlacementType = (typeof placementTypes)[number]

export type Expense = {
  _id: string
  name?: string
  link?: string
  amount?: number
  currency?: string
}

export type ExchangeRates = {
  success: boolean
  timestamp: number
  base: string
  date: string
  rates: Record<Exclude<string, string>, number>
}

export type TripPoint = {
  place: {
    name?: string
    secondaryName?: string
    address?: string
    placeId?: string
  }
  dateTime?: string
  timeZone?: string
}

export type AllExchangeRates = Record<string, ExchangeRates>

export type TripSummaryValues = {
  totalTimeMs: number
  totalTimeStr: string
  roadTimeMs: number
  roadTimeStr: string
  stayTimeMs: number
  stayTimeStr: string
  waitingTimeMs: number
  waitingTimeStr: string
  totalCost: number
  roadCost: number
  stayCost: number
  currency: string
}

export type UnsplashPhoto = {
  id: string
  created_at: string
  width: number
  height: number
  color: string
  blur_hash: string
  likes: number
  liked_by_user: boolean
  description: string
  user: {
    id: string
    username: string
    name: string
    first_name: string
    last_name: string
    instagram_username: string
    twitter_username: string
    portfolio_url: string
    profile_image: {
      small: string
      medium: string
      large: string
    }
    links: {
      self: string
      html: string
      photos: string
      likes: string
    }
  }
  current_user_collections: any[]
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  links: {
    self: string
    html: string
    download: string
  }
}

export interface UnsplashApiResponse {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

export type Note = {
  _id: string
  id: string
  trip: Types.ObjectId | string
  section: Types.ObjectId | string
  content?: JSON | undefined
  createdAt: DateType
  updatedAt?: DateType
}

export type SearchParams = {
  note: string
  fullscreen: string
}

// Google autocomplete place type
export type GAPlace = {
  description: string
  matched_substrings: Array<{
    length: number
    offset: number
  }>
  place_id: string
  reference: string
  structured_formatting: {
    main_text: string
    main_text_matched_substrings: Array<{
      length: number
      offset: number
    }>
    secondary_text: string
  }
  terms: Array<{
    offset: number
    value: string
  }>
  types: string[]
}
