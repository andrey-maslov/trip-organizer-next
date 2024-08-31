import React, { ReactNode } from 'react'
import { FaBus, FaCarSide, FaHotel, FaQuestion, FaTrain } from 'react-icons/fa'
import { ImAirplane } from 'react-icons/im'

type Props = {
  type: string
}

const typeIcons: Record<string, ReactNode> = {
  bus: <FaBus />,
  flight: <ImAirplane />,
  aircraft: <ImAirplane />,
  train: <FaTrain />,
  car: <FaCarSide />,
  hotel: <FaHotel />,
  flat: <FaHotel />,
  unknown: <FaQuestion />,
}

export const SectionTypeIcon = ({ type }: Props) => {
  return typeIcons[type ?? 'unknown']
}
