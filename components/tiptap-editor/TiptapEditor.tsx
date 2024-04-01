'use client'

import React from 'react'
import { useEditor, EditorContent, Content } from '@tiptap/react'
import { throttle } from 'lodash'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
// import TaskList from '@tiptap/extension-task-list'
// import TaskItem from '@tiptap/extension-task-item'
// import Placeholder from '@tiptap/extension-placeholder'

// TODO https://tiptap.dev/docs/editor/examples/savvy

import type { Extensions } from '@tiptap/react'

import { Toolbar } from './Toolbar'

import './tiptap.scss'
import './content.scss'
import { Note } from '@/types/models'
import { createNote, updateNote } from '@/apiRequests/apiDB'

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

const saveNote = (data: Partial<Note>) => {
  if (data._id) {
    return updateNote(data)
  } else {
    // return createNote(data)
  }
}

const throttleOnUpdate = throttle(
  ({
    editor,
    data,
    callback,
  }: {
    editor: any
    data: Partial<Note>
    callback?: (note: Partial<Note>) => void
  }) => {
    const json = editor.getJSON()
    // send the content to an API here
    if (typeof callback !== 'undefined') {
      if (data._id) {
        // use prev created
      }

      // const newData = { ...data }
      callback({ ...data, content: json })
    }
  },
  3000
)

const TiptapEditor = ({
  note,
  editable = true,
  // placeholder = "Type '/' for actions…",
  withToolbar = true,
  withTypographyExtension = false,
  withLinkExtension = true,
  // withTaskListExtension = false,
  // withPlaceholderExtension = false,
}: TiptapProps) => {
  const extensions: Extensions = [StarterKit]

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
  //
  // if (withPlaceholderExtension) {
  //   extensions.push(
  //     Placeholder.configure({
  //       placeholder,
  //     })
  //   )
  // }

  const editor = useEditor({
    content: note?.content,
    extensions,
    editable,
    onUpdate: ({ editor }) => {
      const newData = { ...note }
      throttleOnUpdate({ editor, data: newData, callback: updateNote })
    },
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <div className='tiptap-editor-wrapper'>
        {withToolbar ? <Toolbar editor={editor} /> : null}
        <EditorContent placeholder='Start typing here' editor={editor} />
      </div>
    </>
  )
}

export default TiptapEditor
