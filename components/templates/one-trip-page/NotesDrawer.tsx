'use client'

import { FC, useEffect, useState } from 'react'
import Drawer from 'react-modern-drawer'
import { useQueryParams } from '@/hooks/useQueryParams'
import 'react-modern-drawer/dist/index.css'
import dynamic from 'next/dynamic'
import { Section } from '@/types/models'
import { title, subtitle } from '@/components/primitives'
import { useQuery } from '@tanstack/react-query'
import { getOneNote, getOneTrip } from '@/apiRequests/apiDB'
import { useParams } from 'next/navigation'

const DynamicTiptapEditor = dynamic(
  () => import('../../tiptap-editor/TiptapEditor'),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
)

type NotesProps = {
  section: Section
}

export const NotesDrawer: FC<NotesProps> = ({ section }) => {
  const { id: tripId } = useParams()

  const { removeQueryParams, searchObj } = useQueryParams()

  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    setOpen(Boolean(searchObj.note))
  }, [searchObj.note])

  // TODO check why the fetch is doubled
  const { data: trip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getOneTrip(tripId as string),
    enabled: Boolean(searchObj.note),
  })

  // Fetch note
  const { data: note } = useQuery({
    queryKey: ['note', searchObj.note],
    queryFn: () => getOneNote(searchObj.note as string),
    enabled: Boolean(searchObj.note),
  })

  if (!section || !note) {
    return null
  }

  return (
    <Drawer
      open={isOpen}
      onClose={() => {
        setOpen(false)
        removeQueryParams()
      }}
      direction='right'
      className='notes-drawer'
      size={'40vw'}
    >
      <div className='bg-background p-20'>
        <h1 className={title({ class: 'mb-10' })}>{trip?.name}</h1>
        <h2 className={subtitle({ class: 'mb-2' })}>
          Section: {section?.name}
        </h2>
        <DynamicTiptapEditor note={note} />
      </div>
    </Drawer>
  )
}
