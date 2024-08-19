import { FC } from 'react'
import { Button } from '@nextui-org/button'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { useQueryParams } from '@/hooks/useQueryParams'
import { createNote } from '@/apiRequests/apiDB'

type NoteCellProps = {
  noteId: string | undefined
  sectionId: string
  onClick: () => void
}

export const NoteCell: FC<NoteCellProps> = ({ noteId, sectionId, onClick }) => {
  const { setQueryParams } = useQueryParams()
  const { id: tripId } = useParams()

  // Create new Note
  const { mutate: createNoteMutation, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: (res) => {
      setQueryParams({ note: res._id })
    },
  })

  const setCurrentNote = () => {
    if (noteId) {
      onClick()
      setQueryParams({ note: noteId })
    } else {
      // create note and set noteId as query param
      createNoteMutation({
        sectionId,
        tripId: tripId as string,
      })
    }
  }

  return (
    <div className='flex items-center relative max-w-[140px] overflow-hidden p-1'>
      <Button
        color='default'
        isLoading={isPending}
        size='sm'
        variant='light'
        onClick={() => setCurrentNote()}
      >
        {noteId ? 'Note' : 'Add note'}
      </Button>
    </div>
  )
}
