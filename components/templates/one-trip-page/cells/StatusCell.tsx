import { ButtonEdit } from '@/components/ButtonEdit'
import { Chip, Select, SelectItem } from '@nextui-org/react'
import {
  statusColorMap,
  statusOptionsMap,
} from '@/components/templates/one-trip-page/trip-table.config'
import React, { useRef, useState } from 'react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { statusTypesList } from '@/constants/constants'

type StatusCellProps = {
  status: string
  onUpdate: (value: string) => void
}

export const StatusCell: React.FC<StatusCellProps> = ({ status, onUpdate }) => {
  const [editMode, setEditMode] = useState(false)

  const ref = useRef(null)

  useOnClickOutside(ref, () => {
    setEditMode(false)
  })

  return (
    <div className='flex items-center relative cell-editable'>
      {!editMode ? (
        <>
          <Chip
            className='capitalize border-none gap-1 text-default-600'
            color={statusColorMap[status]}
            size='sm'
            variant='flat'
          >
            {statusOptionsMap[status as keyof typeof statusOptionsMap]}
          </Chip>
          <ButtonEdit onClick={() => setEditMode(true)} />
        </>
      ) : (
        <div className='flex items-center' ref={ref}>
          <Select
            label='Select a status'
            className='max-w-xs min-w-[150px]'
            size='sm'
            onChange={(event) => {
              setEditMode(false)
              onUpdate(event.target.value)
            }}
          >
            {statusTypesList.map((item) => (
              <SelectItem key={item} value={item}>
                {statusOptionsMap[item as keyof typeof statusOptionsMap]}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  )
}
