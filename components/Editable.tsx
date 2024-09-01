import { createElement, FocusEvent, useState, useCallback } from 'react'
import sanitizeHtml from 'sanitize-html'

type Props = {
  content?: string
  setContent: (content: string) => void
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span'
  className?: string
  placeholder?: string
}

export const Editable = ({
  content = '',
  setContent,
  tag = 'div',
  className = '',
  placeholder = 'Enter text here...',
}: Props) => {
  const [text, setText] = useState(content)
  const [isFocused, setIsFocused] = useState(false)

  const onContentBlur = useCallback(
    (evt: FocusEvent<HTMLDivElement>) => {
      const sanitizeConf = {
        allowedTags: ['b', 'i', 'a', 'p'],
        allowedAttributes: { a: ['href'] },
      }

      const newValue = sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf)

      if (newValue !== content) {
        setText(newValue)
        setContent(newValue)
      }

      if (!newValue) {
        setText('')
      }

      setIsFocused(false)
    },
    [content, setContent]
  )

  const onFocus = () => {
    setIsFocused(true)
  }

  return createElement(tag, {
    className,
    contentEditable: true,
    onBlur: onContentBlur,
    onFocus,
    dangerouslySetInnerHTML: { __html: isFocused || text ? text : placeholder },
    style: { color: !isFocused && !text ? 'gray' : 'inherit' },
    tabIndex: 0,
  })
}
