'use client'

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { throttle } from 'lodash'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
// import TaskList from '@tiptap/extension-task-list'
// import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'

// TODO https://tiptap.dev/docs/editor/examples/savvy

import type { Extensions } from '@tiptap/react'

import { Toolbar } from './Toolbar'

import './tiptap.scss'
import './content.scss'
import { Note } from '@/types/models'
import { updateNote, updateTrip } from '@/apiRequests/apiDB'
import { Divider } from '@nextui-org/divider'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

type TiptapProps = {
  note: Note
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

const getDocumentStatus = (isSaved: boolean): string => {
  if (!isSaved) {
    return 'Saving...'
  } else if (isSaved) {
    return 'Saved'
  }
  return ''
}

const throttleOnUpdate = throttle(
  (editor: any, noteId: string, callback: (data: any) => void) => {
    const json = editor.getJSON()
    // send the content to an API
    void callback({ _id: noteId, updatedAt: new Date(), content: json })
  },
  3000
)

const TiptapEditor = ({
  note,
  editable = true,
  // placeholder = "Type '/' for actions…",
  withToolbar = true,
  withTypographyExtension = false,
  withPlaceholderExtension = true,
  // withTaskListExtension = false,
  withLinkExtension = true,
}: TiptapProps) => {
  const extensions: Extensions = [StarterKit]

  const [isSaved, setSaved] = useState(true)

  // Update Note
  const { mutate: updateNoteMutation, isPending } = useMutation({
    mutationFn: (data: any) => updateNote(data),
    onSuccess: async () => {
      setSaved(true)
    },
    onError: (err) => {
      setSaved(false)
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

  // if (withTaskListExtension) {
  //   extensions.push(TaskList, TaskItem)
  // }

  if (withPlaceholderExtension) {
    extensions.push(
      Placeholder.configure({
        placeholder: 'Start adding your note...',
      })
    )
  }

  const editor = useEditor({
    content: note?.content,
    extensions,
    editable,
    autofocus: true,
    onUpdate: ({ editor }) => {
      // add callback
      setSaved(false)
      throttleOnUpdate(editor, note._id, updateNoteMutation)
    },
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <div className='mb-8 text-sm text-foreground-400'>
        {getDocumentStatus(isSaved)}
      </div>
      <Divider />
      <div className='tiptap-editor-wrapper'>
        {withToolbar ? <Toolbar editor={editor} /> : null}
        <EditorContent placeholder='Start typing here' editor={editor} />
      </div>
    </>
  )
}

export default TiptapEditor
