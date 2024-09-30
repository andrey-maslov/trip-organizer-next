'use client'

import type { Extensions } from '@tiptap/react'

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
// import TaskList from '@tiptap/extension-task-list'
// import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'

// TODO https://tiptap.dev/docs/editor/examples/savvy
// TODO activate task list ext https://tiptap.dev/docs/editor/api/nodes/task-list

import { Divider } from '@nextui-org/divider'
import { useMutation } from '@tanstack/react-query'

import { Toolbar } from './Toolbar'

import './tiptap.scss'
import './content.scss'
import { Note } from '@/types/types'
import { updateNote } from '@/apiRequests/apiDB'

import clsx from 'clsx'

import {
  getDocumentStatus,
  throttleOnUpdate,
} from '@/components/tiptap-editor/tiptap-editor.utils'

type TiptapProps = {
  note: Note | null | undefined
  deleteNote?: () => void
  editable?: boolean
  placeholder?: string
  withToolbar?: boolean
  withPopover?: boolean
  withTypographyExtension?: boolean
  withLinkExtension?: boolean
  withCodeBlockLowlightExtension?: boolean
  withTaskListExtension?: boolean
  withPlaceholderExtension?: boolean
  withMentionSuggestion?: boolean
  withEmojiSuggestion?: boolean
  withEmojisReplacer?: boolean
  withHexColorsDecorator?: boolean
}

const TiptapEditor = ({
  note,
  editable = true,
  deleteNote,
  // placeholder = "Type '/' for actions…",
  withToolbar = true,
  withTypographyExtension = false,
  withPlaceholderExtension = true,
  // withTaskListExtension = false,
  withLinkExtension = true,
}: TiptapProps) => {
  const extensions: Extensions = [StarterKit]

  const [isSaved, setSaved] = useState(true)
  const [isRecentlySaved, setRecentlySaved] = React.useState(false)
  const [isError, setError] = React.useState(false)

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

  if (withTypographyExtension) {
    extensions.push(Typography)
  }

  if (withLinkExtension) {
    extensions.push(
      Link.configure({
        linkOnPaste: false,
        openOnClick: false,
      })
    )
  }

  if (withPlaceholderExtension) {
    extensions.push(
      Placeholder.configure({
        placeholder: 'Start adding your note...',
      })
    )
  }

  // if (withTaskListExtension) {
  //   extensions.push(TaskList, TaskItem)
  // }

  const editor = useEditor({
    content: note?.content,
    extensions,
    editable,
    autofocus: true,
    onUpdate: ({ editor }) => {
      if (!note?._id) {
        return
      }
      // add callback
      setSaved(false)
      throttleOnUpdate(editor, note._id, updateNoteMutation)
    },
  })

  useEffect(() => {
    if (isError) {
      return
    }
    setRecentlySaved(isSaved)
  }, [isSaved, isError])

  useEffect(() => {
    if (!isRecentlySaved) {
      return
    }

    const timeout = setTimeout(() => {
      setRecentlySaved(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [isRecentlySaved])

  if (!editor) {
    return null
  }

  return (
    <>
      <div className='flex items-center justify-between mb-2'>
        {isError ? (
          <div className='mb-2 text-sm text-red-500'>Saving error!</div>
        ) : (
          <div
            className={clsx(
              'text-sm text-foreground-400',
              isRecentlySaved && isSaved ? 'text-green-600' : ''
            )}
          >
            {getDocumentStatus(isSaved)}
          </div>
        )}
      </div>
      <Divider />
      <div className='tiptap-editor-wrapper'>
        {withToolbar ? <Toolbar editor={editor} /> : null}
        <EditorContent editor={editor} placeholder='Start typing here' />
      </div>
    </>
  )
}

export default TiptapEditor
