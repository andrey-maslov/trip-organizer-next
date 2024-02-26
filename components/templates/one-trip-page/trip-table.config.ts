import { ChipProps } from '@nextui-org/react'

export const columns = [
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Status', uid: 'status', sortable: true },
  { name: 'Transport or placement', uid: 'transportType', sortable: true },
  // { name: 'Placement', uid: 'placementType', sortable: true },
  { name: 'Start', uid: 'dateTimeStart' },
  { name: 'End', uid: 'dateTimeEnd' },
  { name: 'Duration', uid: 'duration' },
  { name: 'Price', uid: 'price' },
  { name: 'Notes', uid: 'notes' },
  { name: 'Actions', uid: 'actions' },
]

export const INITIAL_VISIBLE_COLUMNS = [
  'name',
  'status',
  'transportType',
  'dateTimeStart',
  'duration',
  'price',
  'notes',
  'actions',
]

export const statusColorMap: Record<string, ChipProps['color']> = {
  bought: 'success',
  reserved: 'primary',
  to_buy: 'danger',
  to_find: 'warning',
}

export const statusOptionsMap = {
  bought: 'Bought',
  reserved: 'Reserved',
  to_buy: 'To buy',
  to_find: 'To find',
}
