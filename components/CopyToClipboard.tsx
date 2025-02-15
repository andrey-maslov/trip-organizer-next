import React from 'react'
import { Button } from '@heroui/react'
import { FaRegCopy } from 'react-icons/fa6'

type Props = {
  text: string
  onCopy?: () => void
}

export const CopyToClipboard = ({ text, onCopy }: Props) => {
  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)

      if (onCopy) {
        onCopy()
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <Button
      isIconOnly
      aria-label='copy to clipboard'
      className='text-lg'
      color='primary'
      size='sm'
      title='Copy to clipboard'
      variant='light'
      onPress={copyTextToClipboard}
    >
      <FaRegCopy />
    </Button>
  )
}
