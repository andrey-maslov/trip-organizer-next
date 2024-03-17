import { ButtonEdit } from '@/components/ButtonEdit'
import { Chip, Select, SelectItem } from '@nextui-org/react'
import {
  statusColorMap,
  statusOptionsMap,
} from '@/components/templates/one-trip-page/trip-table.config'
import React, { useRef, useState } from 'react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { statusTypes } from '@/constants/constants'
import { Status } from '@/types/models'

type StatusCellProps = {
  status: Status
  onUpdate: (value: string) => void
}

export const StatusCell: React.FC<StatusCellProps> = ({ status, onUpdate }) => {
  const [editMode, setEditMode] = useState(false)

  const ref = useRef(null)

  useOnClickOutside(ref, () => {
    setEditMode(false)
  })

  return (
    <div className='flex items-center relative cell-editable max-h-[43px]'>
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
            // label={nu}
            aria-label='select status'
            className='max-w-xs min-w-[120px]'
            size='sm'
            onChange={(event) => {
              setEditMode(false)
              onUpdate(event.target.value)
            }}
            selectedKeys={[status]}
            classNames={{
              // innerWrapper: 'p-0 h-1',
              trigger: 'h-4 min-h-unit-6',
            }}
          >
            {statusTypes.map((item) => (
              <SelectItem key={item} textValue={item}>
                <span className='text-xs'>
                  {statusOptionsMap[item as keyof typeof statusOptionsMap] ??
                    item}
                </span>
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  )
}
