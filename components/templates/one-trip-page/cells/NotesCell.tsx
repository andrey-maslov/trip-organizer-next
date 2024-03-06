import { NotesDrawer } from '@/components/templates/one-trip-page/NotesDrawer'
import { useState } from 'react'

type NotesProps = {
  data: string | null
}

export const NotesCell: React.FC<NotesProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }
  return (
    <>
      <div className='flex items-center relative max-w-[140px] overflow-hidden'>
        <div
          className='text-nowrap text-sm hover:cursor-pointer'
          onClick={() => setIsOpen(true)}
        >
          {data}
        </div>
      </div>
      {isOpen && (
        <NotesDrawer data={data} isOpen={isOpen} onClose={toggleDrawer} />
      )}
    </>
  )
}
