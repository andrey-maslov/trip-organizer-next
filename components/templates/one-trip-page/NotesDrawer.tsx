'use client'

import React, { useEffect, useState } from 'react'
import Drawer from 'react-modern-drawer'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BsChevronDoubleLeft } from 'react-icons/bs'
import { Button } from '@nextui-org/button'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { MdOutlineDelete } from 'react-icons/md'
import { IoCloseOutline } from 'react-icons/io5'

import { useQueryParams } from '@/hooks/useQueryParams'

import 'react-modern-drawer/dist/index.css'

import { title, subtitle } from '@/components/primitives'
import { deleteOneNote, getOneNote, getOneTrip } from '@/apiRequests/apiDB'

const DynamicTiptapEditor = dynamic(
  () => import('../../tiptap-editor/TiptapEditor'),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
)

export const NotesDrawer = () => {
  const { slug } = useParams()
  const queryClient = useQueryClient()

  const { removeQueryParams, searchObj } = useQueryParams()

  const [isOpen, setOpen] = useState(false)
  const [isFullscreen, setFullscreen] = useState(Boolean(searchObj.fullscreen))

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
        sectionId: (note?.section ?? '') as string,
        tripId: (note?.trip ?? '') as string,
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

  const section = (trip?.sections ?? []).find(
    (section) => section.note === searchObj.note
  )

  if (!isOpen) {
    return null
  }

  return (
    <Drawer
      className='notes-drawer'
      direction='right'
      open={isOpen}
      size={isFullscreen ? '100vw' : '40vw'}
      onClose={() => {
        setOpen(false)
        removeQueryParams()
      }}
    >
      <div className='bg-background p-4 md:px-10 xl:px-12 relative'>
        <div className='mb-4 flex justify-between'>
          <div>
            <Button
              isIconOnly
              className='text-xl text-foreground-400 mr-4'
              size='sm'
              variant='light'
              onPress={() => setFullscreen(!isFullscreen)}
            >
              <BsChevronDoubleLeft
                className={clsx(isFullscreen ? 'rotate-180' : '')}
              />
            </Button>
            <Button
              isIconOnly
              className='text-xl text-foreground-400'
              size='sm'
              variant='light'
              onPress={() => {
                setOpen(false)
                removeQueryParams()
              }}
            >
              <IoCloseOutline />
            </Button>
          </div>
          <Button
            isIconOnly
            className='text-xl'
            color='danger'
            size='sm'
            title='delete note'
            variant='flat'
            onPress={() => {
              if (confirm('Do you really want to delete your note?')) {
                deleteNoteMutation()
              }
            }}
          >
            <MdOutlineDelete />
          </Button>
        </div>
        <h1 className={title({ class: 'mb-10' })}>{trip?.name}</h1>
        <h2 className={subtitle({ class: 'mb-2' })}>
          Section: {section?.name}
        </h2>
        <DynamicTiptapEditor note={note} />
      </div>
    </Drawer>
  )
}
