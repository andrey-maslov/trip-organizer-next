import { ChipProps } from "@heroui/react"

import { Status } from '@/types/types'

export type Column = {
  name: string
  uid: string
  width?: number
}

export const columns: Column[] = [
  { name: 'Type', uid: 'type', width: 40 },
  { name: 'Name', uid: 'name', width: 150 },
  { name: 'Status', uid: 'status', width: 100 },
  { name: 'Provider', uid: 'serviceProvider', width: 100 },
  // { name: 'Placement', uid: 'placementType', sortable: true },
  { name: 'Start', uid: 'startingPoint', width: 130 },
  { name: 'End', uid: 'endPoint', width: 130 },
  { name: 'Duration', uid: 'duration', width: 100 },
  { name: 'Expenses', uid: 'payments', width: 100 },
  { name: 'Notes', uid: 'note', width: 100 },
  { name: 'Actions', uid: 'actions', width: 60 },
]

export const INITIAL_VISIBLE_COLUMNS = [
  'name',
  'status',
  'serviceProvider',
  'startingPoint',
  // 'endPoint',
  'duration',
  'payments',
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

export const statusOptions = Object.entries(statusOptionsMap).map(
  ([uid, name]) => ({
    uid,
    name,
  })
)
