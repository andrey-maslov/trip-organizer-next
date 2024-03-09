import {
  currencyISONameList,
  placementTypeList,
  sectionTypesList,
  statusTypesList,
  transportTypesList,
} from '@/constants/constants'

export type DateType = Date | string | null | undefined

export type Trip = {
  name: string
  dateTimeStart: DateType
  dateTimeEnd: DateType
  description: string
  sections: Section[]
  summary: TripSummaryValues
  cover: string | null
  _id: string
}

export type Section = {
  name: string
  type: SectionType
  waypoints: Waypoint[]
  points?: []
  dateTimeStart: DateType
  dateTimeEnd: DateType
  transportType: TransportType | null
  placementType: PlacementType | null
  serviceProvider: ServiceProvider | null
  status: Status
  payments: Payment[] | null
  notes: string
  _id: string
}

export type Waypoint = {
  name: string
  coords?: string[] | null
  country?: string | null
  description?: string
  _id: string
}

export type TransportType = (typeof transportTypesList)[number]
export type Status = (typeof statusTypesList)[number]
export type SectionType = (typeof sectionTypesList)[number]
export type PlacementType = (typeof placementTypeList)[number]
export type CurrencyISOName = (typeof currencyISONameList)[number]

export type ServiceProvider = {
  name: string
  link: string | null
}

export type Payment = {
  name: string
  link?: string | null
  price?: {
    amount: number
    currency: CurrencyISOName
  }
  _id: string
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
