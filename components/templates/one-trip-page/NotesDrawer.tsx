'use client'

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { TiptapEditor } from '@/components/tiptap-editor/TiptapEditor'

type NotesProps = {
  data: string | null
  isOpen: boolean
  onClose: () => void
}

export const NotesDrawer: React.FC<NotesProps> = ({
  isOpen,
  data,
  onClose,
}) => {
  console.log(data)

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction='right'
      className='notes-drawer'
      size={'70vw'}
    >
      <div className='bg-background'>
        <TiptapEditor />
      </div>
    </Drawer>
  )
}
