'use client'

import React from 'react'
import { useEditor, EditorContent, Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
// import TaskList from '@tiptap/extension-task-list'
// import TaskItem from '@tiptap/extension-task-item'
// import Placeholder from '@tiptap/extension-placeholder'

import type { Extensions } from '@tiptap/react'

import { Toolbar } from './Toolbar'

import './tiptap.scss'
import './content.scss'

type TiptapProps = {
  content: Content | undefined
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
  content,
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
    content,
    extensions,
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      // send the content to an API here
      console.log(json)
    },
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <div className='tiptap-editor-wrapper'>
        {withToolbar ? <Toolbar editor={editor} /> : null}
        <EditorContent editor={editor} />
      </div>
    </>
  )
}

export default TiptapEditor
