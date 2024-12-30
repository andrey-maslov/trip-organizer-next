import { useState, FC, useRef, useEffect } from 'react'

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
    <div className='flex items-center relative editable-elemenet min-w-[170px] font-bold px-3'>
      <input
        ref={inputRef}
        className='outline-0 max-w-full'
        title={name}
        type='text'
        value={value}
        onBlur={() => onUpdate(value)}
        onChange={(event) => setValue(event.target.value)}
      />
      {hasHorizontalScroll && (
        <div className='absolute right-3 h-full w-6 bg-gradient-to-r from-transparent to-white' />
      )}
    </div>
  )
}
