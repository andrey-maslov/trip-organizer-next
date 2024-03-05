import React, { ReactNode } from 'react'
import { FaBus, FaCarSide, FaHotel, FaQuestion, FaTrain } from 'react-icons/fa'
import { ImAirplane } from 'react-icons/im'
import { Section } from '@/types/models'
import { ButtonEdit } from '@/components/ButtonEdit'

const approachIcons: Record<string, ReactNode> = {
  bus: <FaBus />,
  aircraft: <ImAirplane />,
  train: <FaTrain />,
  car: <FaCarSide />,
  hotel: <FaHotel />,
  flat: <FaHotel />,
  unknown: <FaQuestion />,
}

type TransportCellProps = {
  data: Pick<
    Section,
    'type' | 'transportType' | 'placementType' | 'serviceProvider'
  >
  onEditClick: () => void
}

export const ApproachCell: React.FC<TransportCellProps> = ({
  data,
  onEditClick,
}) => {
  const { type, transportType, placementType, serviceProvider } = data

  if (!transportType) {
    return <div>-</div>
  }

  const approachType =
    type === 'road' ? transportType || 'unknown' : placementType || 'unknown'

  return (
    <div className='flex items-center relative cell-editable'>
      <div className='mr-3 text-2xl text-foreground-400'>
        {approachIcons[approachType]}
      </div>
      <div>
        <div>{approachType}</div>
        {serviceProvider?.link ? (
          <a
            href={serviceProvider.link}
            className='text-blue-600 underline'
            target={'_blank'}
            rel='noreferrer'
          >
            {serviceProvider.name}
          </a>
        ) : (
          <div>{serviceProvider?.name}</div>
        )}
      </div>
      <ButtonEdit onClick={() => onEditClick()} />
    </div>
  )
}
