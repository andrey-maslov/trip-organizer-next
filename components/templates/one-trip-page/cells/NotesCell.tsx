import { FC } from 'react'
import { Button } from '@nextui-org/button'

type NotesCellProps = {
  hasNote: boolean
  onOpenNote: () => void
}

export const NotesCell: FC<NotesCellProps> = ({ hasNote, onOpenNote }) => (
  <div className='flex items-center relative max-w-[140px] overflow-hidden'>
    <Button
      color='default'
      size='sm'
      variant='light'
      onClick={() => onOpenNote()}
    >
      {hasNote ? 'Note' : 'Add note'}
    </Button>
  </div>
)
