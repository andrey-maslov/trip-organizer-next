import { ButtonEdit } from '@/components/ButtonEdit'
import React, { useRef, useState } from 'react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { FiCheck } from 'react-icons/fi'

type NameCellProps = {
  name: string
  onUpdate: (value: string) => void
}

export const NameCell: React.FC<NameCellProps> = ({ name, onUpdate }) => {
  const [editMode, setEditMode] = useState(false)
  const [nameInInput, setNameInInput] = useState<string>(name)

  const ref = useRef(null)

  useOnClickOutside(ref, () => {
    setEditMode(false)
    setNameInInput(name)
  })

  return (
    <div className='flex items-center relative cell-editable min-w-[200px]'>
      {!editMode ? (
        <>
          <div className='text-nowrap font-bold'>
            {name ?? 'Enter section name'}
          </div>
          <ButtonEdit onClick={() => setEditMode(true)} />
        </>
      ) : (
        <div className='flex items-center' ref={ref}>
          <input
            type='text'
            className='block w-full'
            value={nameInInput ?? ''}
            onChange={(event) => setNameInInput(event.target.value)}
          />
          <button
            className='bg-transparent border-0 text-green-600 font-bold'
            onClick={() => {
              setEditMode(false)
              onUpdate(nameInInput ?? '')
            }}
          >
            <FiCheck />
          </button>
        </div>
      )}
    </div>
  )
}
