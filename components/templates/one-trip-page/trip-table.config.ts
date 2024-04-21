import { ChipProps } from '@nextui-org/react'
import { Status } from '@/types/models'

export const columns = [
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Status', uid: 'status', sortable: true },
  { name: 'Provider', uid: 'serviceProvider', sortable: true },
  // { name: 'Placement', uid: 'placementType', sortable: true },
  { name: 'Start', uid: 'startingPoint' },
  { name: 'End', uid: 'endPoint' },
  { name: 'Duration', uid: 'duration' },
  { name: 'Price', uid: 'price' },
  { name: 'Notes', uid: 'note' },
  { name: 'Actions', uid: 'actions' },
]

export const INITIAL_VISIBLE_COLUMNS = [
  'name',
  'status',
  'serviceProvider',
  'startingPoint',
  // 'endPoint',
  'duration',
  'price',
  'note',
  'actions',
]

export const statusColorMap: Record<Status, ChipProps['color']> = {
  bought: 'success',
  reserved: 'primary',
  to_buy: 'danger',
  to_find: 'warning',
  in_progress: 'default',
  passed: 'default',
}

export const statusOptionsMap: Record<Status, string> = {
  bought: 'Bought',
  reserved: 'Reserved',
  to_buy: 'To buy',
  to_find: 'To find',
  in_progress: 'In progress',
  passed: 'Passed',
}
