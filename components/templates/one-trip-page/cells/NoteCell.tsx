import { FC } from 'react'
import { Button } from '@nextui-org/button'
import { useMutation } from '@tanstack/react-query'

import { useQueryParams } from '@/hooks/useQueryParams'
import { createNote } from '@/apiRequests/apiDB'

type Props = {
  noteId: string | undefined
  sectionId: string
  tripId: string
}

export const NoteCell: FC<Props> = ({ noteId, sectionId, tripId }) => {
  const { setQueryParams } = useQueryParams()
  // const { slug } = useParams()

  // Create new Note
  const { mutate: createNoteMutation, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: (res) => {
      setQueryParams({ note: res._id })
    },
  })

  const onOpenNote = () => {
    if (noteId) {
      setQueryParams({ note: noteId })
    } else {
      // create note and set noteId as query param
      createNoteMutation({
        sectionId,
        tripId: tripId,
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
        onPress={() => onOpenNote()}
      >
        {noteId ? 'Note' : 'Add note'}
      </Button>
    </div>
  )
}
