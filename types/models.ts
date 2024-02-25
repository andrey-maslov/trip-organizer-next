export type Trip = {
  _id: string
  name: string
  dateTimeStart: string
  dateTimeEnd: string
  description: string
  sections: Section[]
}

export type Section = {
  name: string
  type: 'road' | 'stay'
  points?: Point[]
  waypoints?: Waypoint[]
  dateTimeStart: string
  dateTimeEnd: string
  transportType?: 'bus' | 'aircraft' | 'train' | 'unknown'
  placementType?: 'flat' | 'hotel'
  serviceProvider: ServiceProvider | null
  status: 'bought' | 'reserved' | 'to_buy' | 'to_find'
  payments: Payment[]
  notes?: string
  _id: string
}

export type Point = {
  // Assuming structure from the provided JSON, it seems points are empty arrays in this sample.
  // Define a more specific type if points have a known structure.
}

export type Waypoint = {
  name: string
  country?: string
  description?: string
  _id: string
}

export type ServiceProvider = {
  name: string
  link?: string
}

export type Payment = {
  name: string
  price: Price
  link?: string
  _id: string
}

export type Price = {
  amount: number
  currency: string
}
