import { ButtonEdit } from '@/components/ButtonEdit'
import React, { useRef, useState } from 'react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { FiCheck } from 'react-icons/fi'
import clsx from 'clsx'

type NameCellProps = {
  name: string
  onUpdate: (value: string) => void
}

const placeholder = 'Enter section name'

export const NameCell: React.FC<NameCellProps> = ({ name, onUpdate }) => {
  const [editMode, setEditMode] = useState(false)
  const [nameInInput, setNameInInput] = useState<string>(name)

  const ref = useRef(null)

  useOnClickOutside(ref, () => {
    setEditMode(false)
    setNameInInput(name)
  })

  const onSave = () => {
    setEditMode(false)
    onUpdate(nameInInput ?? '')
  }

  return (
    <div className='flex items-center relative cell-editable min-w-[170px]'>
      {!editMode ? (
        <>
          <div
            className={clsx(
              'text-nowrap',
              name ? 'font-bold' : 'text-foreground-400'
            )}
          >
            {name || placeholder}
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
            onClick={() => onSave()}
          >
            <FiCheck />
          </button>
        </div>
      )}
    </div>
  )
}
