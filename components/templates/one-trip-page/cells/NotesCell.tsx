import { NotesDrawer } from '@/components/templates/one-trip-page/NotesDrawer'
import { useState } from 'react'
import { Section } from '@/types/models'
import { Button } from '@nextui-org/button'

type NotesCellProps = {
  section: Partial<Section>
}

export const NotesCell: React.FC<NotesCellProps> = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }
  return (
    <>
      <div className='flex items-center relative max-w-[140px] overflow-hidden'>
        <Button
          color='default'
          size='sm'
          variant='light'
          onClick={() => setIsOpen(true)}
        >
          {section.notes ? 'Notes' : 'Add notes'}
        </Button>
      </div>
      {isOpen && (
        <NotesDrawer section={section} isOpen={isOpen} onClose={toggleDrawer} />
      )}
    </>
  )
}
