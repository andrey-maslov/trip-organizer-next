import React, { ReactNode } from 'react'
import { FaBus, FaCarSide, FaHotel, FaQuestion, FaTrain } from 'react-icons/fa'
import { FaFerry } from 'react-icons/fa6'
import { ImAirplane } from 'react-icons/im'

type Props = {
  type?: string
  classNames?: string
}

const typeIcons: Record<string, ReactNode> = {
  bus: <FaBus />,
  flight: <ImAirplane />,
  aircraft: <ImAirplane />,
  train: <FaTrain />,
  car: <FaCarSide />,
  ferry: <FaFerry />,
  hotel: <FaHotel />,
  flat: <FaHotel />,
  unknown: <FaQuestion />,
}

export const SectionTypeIcon = ({ type = 'unknown', classNames }: Props) => {
  return <span className={classNames}>{typeIcons[type ?? 'unknown']}</span>
}
