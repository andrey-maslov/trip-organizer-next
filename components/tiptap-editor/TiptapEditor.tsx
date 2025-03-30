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

import { Divider } from '@heroui/divider'

import { Toolbar } from './Toolbar'

import './tiptap.scss'
import './content.scss'

import clsx from 'clsx'

import { getDocumentStatus } from '@/components/tiptap-editor/tiptap-editor.utils'
import { throttle } from 'throttle-debounce'

type TiptapProps = {
  content: any
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
  isError: boolean
  isSaved: boolean
  onChangeContent?: (val: any) => void
}

const TiptapEditor = ({
  content,
  editable = true,
  withToolbar = true,
  withTypographyExtension = false,
  withPlaceholderExtension = true,
  // withTaskListExtension = false,
  withLinkExtension = true,
  isError,
  isSaved = false,
  onChangeContent,
}: TiptapProps) => {
  const extensions: Extensions = [StarterKit]

  const [isRecentlySaved, setRecentlySaved] = React.useState(false)

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

  const onValueChange = throttle(2000, (editor) => {
    const output = editor.getJSON()

    onChangeContent?.(output as any)
  })

  const editor = useEditor({
    content,
    extensions,
    editable,
    autofocus: true,
    onUpdate: ({ editor }) => {
      if (onValueChange) onValueChange(editor)
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

  useEffect(() => {
    return () => {
      editor?.destroy?.()
    }
  }, [])

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
