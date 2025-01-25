import { FC } from 'react'
import { Button } from "@heroui/button"
import { useMutation } from '@tanstack/react-query'
import { FaRegNoteSticky } from 'react-icons/fa6'
import { IoAddOutline } from 'react-icons/io5'

import { useQueryParams } from '@/hooks/useQueryParams'
import { createNote } from '@/queries/queries.db'

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
    <div className='flex items-center relative max-w-[140px] overflow-hidden p-1 mx-auto'>
      <Button
        isIconOnly
        color='default'
        isLoading={isPending}
        size='sm'
        startContent={noteId ? <FaRegNoteSticky /> : <IoAddOutline />}
        title={noteId ? 'Read note' : 'Add note'}
        variant='light'
        onPress={() => onOpenNote()}
      />
    </div>
  )
}
