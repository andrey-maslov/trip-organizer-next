import React from 'react'
import { DatePicker } from "@heroui/react"
import { ZonedDateTime } from '@internationalized/date'

export type CustomData = ZonedDateTime | any

type CustomDayPickerProps = {
  value: CustomData
  onChange: (value: CustomData) => void
  label?: string
  classNames?: string
}

export const CustomDateTimePicker = ({
  value,
  onChange,
  label,
  classNames,
}: CustomDayPickerProps) => {
  return (
    <DatePicker
      className={classNames}
      granularity='minute'
      hourCycle={24}
      label={label}
      value={value}
      onChange={onChange}
    />
  )
}
