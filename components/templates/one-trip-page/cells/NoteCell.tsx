import { FC } from 'react'
import { Button } from '@nextui-org/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { useQueryParams } from '@/hooks/useQueryParams'
import { createNote, getOneTrip } from '@/apiRequests/apiDB'

type Props = {
  noteId: string | undefined
  sectionId: string
  onClick: () => void
}

export const NoteCell: FC<Props> = ({ noteId, sectionId, onClick }) => {
  const { setQueryParams } = useQueryParams()
  const { slug } = useParams()

  // Fetch Trip
  const { data: trip } = useQuery({
    queryKey: ['trip', slug],
    queryFn: () => getOneTrip(slug as string),
  })

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
        tripId: trip?._id as string,
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
        onPress={() => setCurrentNote()}
      >
        {noteId ? 'Note' : 'Add note'}
      </Button>
    </div>
  )
}
