import { useState, FC, useRef, useEffect } from 'react'
import { sanitizeInput } from '@/lib/sanitizeInput'

type NameCellProps = {
  name: string
  onUpdate: (value: string) => void
}

// const placeholder = 'Enter section name'

export const NameCell: FC<NameCellProps> = ({ name, onUpdate }) => {
  const [value, setValue] = useState(name)
  const inputRef = useRef(null)
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false)

  useEffect(() => {
    const inputElement = inputRef.current

    if (inputElement) {
      const { scrollWidth, clientWidth } = inputElement

      if (scrollWidth > clientWidth) {
        setHasHorizontalScroll(true)
      } else {
        setHasHorizontalScroll(false)
      }
    }
  }, [])

  return (
    <div className='flex items-center relative overflow-hidden font-bold pr-3'>
      <input
        ref={inputRef}
        className='outline-0 max-w-full bg-transparent'
        title={name}
        type='text'
        value={value}
        onBlur={() => onUpdate(value)}
        onChange={(event) => setValue(sanitizeInput(event.target.value))}
      />
      {hasHorizontalScroll && (
        <div className='absolute right-3 h-full w-6 bg-gradient-to-r from-transparent to-white' />
      )}
    </div>
  )
}
