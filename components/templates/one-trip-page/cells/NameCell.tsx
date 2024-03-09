import { ButtonEdit } from '@/components/ButtonEdit'
import React, { useRef, useState } from 'react'
import { Input } from '@nextui-org/react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { FiCheck } from 'react-icons/fi'

type NameCellProps = {
  name: string | null
  onEditClick: () => void
}

export const NameCell: React.FC<NameCellProps> = ({ name }) => {
  const [editMode, setEditMode] = useState(false)
  const [newName, setNewName] = useState(name)

  const ref = useRef(null)

  useOnClickOutside(ref, () => setEditMode(false))

  return (
    <div className='flex items-center relative cell-editable'>
      {!editMode ? (
        <>
          <div className='text-nowrap font-bold'>
            {name ?? 'Enter section name'}
          </div>
          <ButtonEdit onClick={() => setEditMode(true)} />
        </>
      ) : (
        <div className='flex items-center' ref={ref}>
          <Input
            type='text'
            size='sm'
            variant='underlined'
            value={newName ?? ''}
            onChange={(event) => setNewName(event.target.value)}
          />
          <button
            className='bg-transparent border-0 text-green-600 font-bold'
            onClick={() => setEditMode(false)}
          >
            <FiCheck />
          </button>
        </div>
      )}
    </div>
  )
}
