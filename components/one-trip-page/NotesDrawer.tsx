'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Drawer from 'react-modern-drawer'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BsChevronDoubleLeft } from 'react-icons/bs'
import { Button } from '@heroui/button'
// import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { MdOutlineDelete } from 'react-icons/md'
import { IoCloseOutline } from 'react-icons/io5'

import { useQueryParams } from '@/hooks/useQueryParams'

import 'react-modern-drawer/dist/index.css'

import { title, subtitle } from '@/components/primitives'
import {
  deleteOneNote,
  getOneNote,
  getOneTrip,
  updateNote,
} from '@/queries/queries.db'
import TiptapEditor from '@/components/tiptap-editor/TiptapEditor'
import { debounce } from 'throttle-debounce'

export const NotesDrawer = () => {
  const { slug } = useParams()
  const queryClient = useQueryClient()

  const { removeQueryParams, searchObj } = useQueryParams()

  const [isOpen, setOpen] = useState(false)
  const [isFullscreen, setFullscreen] = useState(Boolean(searchObj.fullscreen))
  const [isSaved, setSaved] = useState(true)
  const [isError, setError] = React.useState(false)
  const [content, setContent] = React.useState<any>('')

  useEffect(() => {
    setOpen(Boolean(searchObj.note))
  }, [searchObj, searchObj.note])

  const { data: trip } = useQuery({
    queryKey: ['trip', slug],
    queryFn: () => getOneTrip(slug as string),
    enabled: Boolean(searchObj.note),
  })

  // Fetch note
  const { data: note } = useQuery({
    queryKey: ['note', searchObj.note],
    queryFn: async () => {
      const res = await getOneNote(searchObj.note as string)
      if (res.content !== undefined) {
        setContent(res.content as any)
      }
      return res
    },
    enabled: Boolean(searchObj.note),
  })

  // Update Note
  const { mutate: updateNoteMutation } = useMutation({
    mutationFn: (data: any) => updateNote(data),
    onSuccess: async () => {
      setSaved(true)
      setError(false)
    },
    onError: (err) => {
      setSaved(false)
      setError(true)
    },
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

  const onValueChange = useCallback(
    debounce(300, (value: any) => {
      setContent(value)
      console.log('Note: ', note)
      updateNoteMutation({ ...note, content: value })
    }),
    [note]
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
        {note?.content && (
          <TiptapEditor
            content={content}
            isError={isError}
            isSaved={isSaved}
            onChangeContent={onValueChange}
          />
        )}
      </div>
    </Drawer>
  )
}
