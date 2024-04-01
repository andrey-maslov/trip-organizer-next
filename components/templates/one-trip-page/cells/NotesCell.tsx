'use client'

import { FC } from 'react'
import { Button } from '@nextui-org/button'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useMutation } from '@tanstack/react-query'
import { createNote } from '@/apiRequests/apiDB'
import { useParams } from 'next/navigation'

type NotesCellProps = {
  noteId: string | undefined
  sectionId: string
}

export const NotesCell: FC<NotesCellProps> = ({ noteId, sectionId }) => {
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
    <div className='flex items-center relative max-w-[140px] overflow-hidden'>
      <Button
        color='default'
        size='sm'
        variant='light'
        onClick={() => setCurrentNote()}
        isLoading={isPending}
      >
        {noteId ? 'Note' : 'Add note'}
      </Button>
    </div>
  )
}
