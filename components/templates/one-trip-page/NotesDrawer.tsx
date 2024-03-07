'use client'

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

import dynamic from 'next/dynamic'
import { Section } from '@/types/models'
import { title, subtitle } from '@/components/primitives'
import { Divider } from '@nextui-org/divider'
import { useQuery } from '@tanstack/react-query'
import { getOneTrip } from '@/apiRequests/apiRequests'
import { useParams } from 'next/navigation'

const DynamicTiptapEditor = dynamic(
  () => import('../../tiptap-editor/TiptapEditor'),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
)

type NotesProps = {
  section: Section
  isOpen: boolean
  onClose: () => void
}

export const NotesDrawer: React.FC<NotesProps> = ({
  section,
  isOpen,
  onClose,
}) => {
  const params = useParams()
  const { data } = useQuery({
    queryKey: ['trip', params.id],
    queryFn: () => getOneTrip(params.id as string),
  })

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction='right'
      className='notes-drawer'
      size={'40vw'}
    >
      <div className='bg-background p-20'>
        <h1 className={title({ class: 'mb-10' })}>{data?.name}</h1>
        <h2 className={subtitle({ class: 'mb-10' })}>
          Section: {section.name}
        </h2>
        <Divider />
        <DynamicTiptapEditor content={section.notes} />
      </div>
    </Drawer>
  )
}
