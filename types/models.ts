import {
  currencyISONameList,
  placementTypeList,
  sectionTypesList,
  statusTypesList,
  transportTypesList,
} from '@/constants/constants'

export type Trip = {
  name: string
  dateTimeStart: string | null
  dateTimeEnd: string | null
  description: string
  sections: Section[]
  summary: TripSummaryValues
  _id: string
}

export type Section = {
  name: string
  type: SectionType
  waypoints: Waypoint[]
  points?: []
  dateTimeStart: string | null
  dateTimeEnd: string | null
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
