import { createElement, FocusEvent, useState } from 'react'
import sanitizeHtml from 'sanitize-html'
import { useCallback } from 'react'

type Props = {
  content?: string
  setContent: (content: string) => void
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span'
  className?: string
}

export const Editable = ({
  content,
  setContent,
  tag = 'div',
  className = '',
}: Props) => {
  const [text, setText] = useState(content)

  const onContentBlur = useCallback(
    (evt: FocusEvent<HTMLDivElement>) => {
      const sanitizeConf = {
        allowedTags: ['b', 'i', 'a', 'p'],
        allowedAttributes: { a: ['href'] },
      }

      if (evt.currentTarget.innerHTML !== content) {
        const newValue = sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf)

        setText(newValue)
        setContent(newValue)
      }
    },
    [content, setContent]
  )

  return createElement(tag, {
    className,
    contentEditable: true,
    onBlur: onContentBlur,
    dangerouslySetInnerHTML: { __html: text },
    tabIndex: 0,
  })
}
