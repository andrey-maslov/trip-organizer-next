import React from 'react'
import classNames from 'classnames'
import { Editor } from '@tiptap/react'
import { useInView } from 'react-intersection-observer'
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiLink,
  RiLinkUnlink,
  RiDoubleQuotesL,
  RiSeparator,
  RiTextWrap,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from 'react-icons/ri'

import './toolbar.scss'
import { Button } from '@heroui/button'

import { setLink } from '@/components/tiptap-editor/set-link'

type ToolbarProps = {
  editor: Editor
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const isCursorOverLink = editor.getAttributes('link').href

  const { ref, inView } = useInView({
    // rootMargin: '-1px 0px 0px 0px',
    threshold: 0,
  })

  // TODO change all the divs to buttons. See below

  return (
    <div
      ref={ref}
      className={classNames('ToolbarContainer overflow-auto', {
        sticky: !inView,
      })}
    >
      <div className='Toolbar'>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('bold'),
          })}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <RiBold />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('italic'),
          })}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <RiItalic />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('strike'),
          })}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <RiStrikethrough />
        </div>
        <div className='divider' />
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('heading', { level: 1 }),
          })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <RiH1 />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('heading', { level: 2 }),
          })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <RiH2 />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('heading', { level: 3 }),
          })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <RiH3 />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('heading', { level: 4 }),
          })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <RiH4 />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('heading', { level: 5 }),
          })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          <RiH5 />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('heading', { level: 6 }),
          })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          <RiH6 />
        </div>
        <div
          className='icon'
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <RiParagraph />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('bulletList'),
          })}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <RiListOrdered />
        </div>
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('orderedList'),
          })}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <RiListUnordered />
        </div>
        <div className='divider' />
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('link'),
          })}
          onClick={() => setLink(editor)}
        >
          <RiLink />
        </div>
        <div
          className={classNames('icon', { disabled: !isCursorOverLink })}
          onClick={() => setLink(editor)}
        >
          <RiLinkUnlink />
        </div>
        <div className='divider' />
        <div
          className={classNames('icon', {
            'is-active': editor.isActive('blockquote'),
          })}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <RiDoubleQuotesL />
        </div>
        <div
          className='icon'
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <RiSeparator />
        </div>
        <div className='divider' />
        <div
          className='icon'
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <RiTextWrap />
        </div>
        <div
          className='icon'
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <RiFormatClear />
        </div>
        <div className='divider' />
        <Button
          isIconOnly
          aria-label='undo'
          disabled={!editor.can().chain().focus().undo().run()}
          size='sm'
          title='undo'
          variant='light'
          onClick={() => editor.chain().focus().undo().run()}
        >
          <RiArrowGoBackLine />
        </Button>
        <Button
          isIconOnly
          aria-label='redo'
          disabled={!editor.can().chain().focus().redo().run()}
          size='sm'
          title='redo'
          variant='light'
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RiArrowGoForwardLine />
        </Button>
      </div>
    </div>
  )
}
