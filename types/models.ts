import {
  currencyISONames,
  placementTypes,
  sectionTypes,
  statusTypes,
  transportTypes,
} from '@/constants/constants'

export type DateType = Date | string | undefined

export type Trip = {
  _id: string
  name: string
  sections: SectionBE[]
  dateTimeStart?: DateType
  dateTimeEnd?: DateType
  description?: string
  cover?: string
}

export type Section = {
  // _id: string // do not use in FE
  id: string // for FE only
  name: string
  status: Status
  type?: SectionType
  dateTimeStart?: DateType
  dateTimeEnd?: DateType
  // startingPoint: Point
  // endPoint: Point
  transportType?: TransportType
  placementType?: PlacementType
  serviceProvider?: {
    type?: string
    name?: string
    url?: string
  }
  payments?: Payment[]
  note?: string // TODO noteID
}

export type SectionBE = Section & { _id?: string }

export type TransportType = (typeof transportTypes)[number]
export type Status = (typeof statusTypes)[number]
export type SectionType = (typeof sectionTypes)[number]
export type PlacementType = (typeof placementTypes)[number]
export type CurrencyISOName = (typeof currencyISONames)[number]

// TODO fix it keeping in mind geo coordinates etc
export type Point = {
  point: string
  staringDate: string
  startingTime: string
  timeZone: any
}

export type Payment = {
  _id: string
  name?: string
  link?: string
  amount?: number
  currency?: CurrencyISOName
}

export type CurrencyRates = {
  success: boolean
  timestamp: number
  base: string
  date: string
  rates: Record<Exclude<CurrencyISOName, string>, number>
}

export type AllCurrencyRates = Record<CurrencyISOName, CurrencyRates>

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
  currency: CurrencyISOName
}

export type GetOneTripParams = {
  currency: CurrencyISOName
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
