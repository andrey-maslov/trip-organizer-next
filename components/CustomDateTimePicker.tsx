import React from 'react'
import { DatePicker } from '@nextui-org/react'
import { ZonedDateTime } from '@internationalized/date'

export type CustomData = ZonedDateTime

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
      hourCycle={24}
      label={label}
      value={value}
      onChange={onChange}
    />
  )
}
