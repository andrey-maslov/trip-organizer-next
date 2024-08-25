'use client'

import { FC, useEffect, useState } from 'react'
import Drawer from 'react-modern-drawer'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useQueryParams } from '@/hooks/useQueryParams'

import 'react-modern-drawer/dist/index.css'
import dynamic from 'next/dynamic'

import { Section } from '@/types/models'
import { title, subtitle } from '@/components/primitives'
import { deleteOneNote, getOneNote, getOneTrip } from '@/apiRequests/apiDB'

const DynamicTiptapEditor = dynamic(
  () => import('../../tiptap-editor/TiptapEditor'),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
)

type NotesProps = {
  section: Section | null
}

export const NotesDrawer: FC<NotesProps> = ({ section }) => {
  const { slug } = useParams()
  const queryClient = useQueryClient()

  const { removeQueryParams, searchObj } = useQueryParams()

  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    setOpen(Boolean(searchObj.note))
  }, [searchObj, searchObj.note])

  // TODO check why the fetch is doubled
  const { data: trip } = useQuery({
    queryKey: ['trip', slug],
    queryFn: () => getOneTrip(slug as string),
    enabled: Boolean(searchObj.note),
  })

  // Fetch note
  const { data: note } = useQuery({
    queryKey: ['note', searchObj.note],
    queryFn: () => getOneNote(searchObj.note as string),
    enabled: Boolean(searchObj.note),
  })

  // Delete Note
  const { mutate: deleteNoteMutation, isPending } = useMutation({
    mutationFn: () =>
      deleteOneNote({
        noteId: searchObj.note,
        sectionId: section?.id ?? '',
        tripId: trip?._id as string,
      }),
    onSuccess: async () => {
      toast.success('Note successfully deleted')
      removeQueryParams()
      await queryClient.invalidateQueries({ queryKey: ['trip', slug] })
    },
    onError: (err) => {
      toast.error("Note wasn't deleted")
    },
  })

  if (!isOpen) {
    return null
  }

  return (
    <Drawer
      className='notes-drawer'
      direction='right'
      open={isOpen}
      size={'40vw'}
      onClose={() => {
        setOpen(false)
        removeQueryParams()
      }}
    >
      <div className='bg-background p-20'>
        <h1 className={title({ class: 'mb-10' })}>{trip?.name}</h1>
        <h2 className={subtitle({ class: 'mb-2' })}>
          Section: {section?.name}
        </h2>
        <DynamicTiptapEditor
          deleteNote={() => deleteNoteMutation()}
          note={note}
        />
      </div>
    </Drawer>
  )
}
