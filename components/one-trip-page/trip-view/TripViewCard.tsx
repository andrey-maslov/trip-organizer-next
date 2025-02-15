import { Button, Card, CardBody } from '@heroui/react'
import { CardHeader } from '@heroui/card'
import { SectionTypeIcon } from '@/components/SectionTypeIcon'
import { FaExpand } from 'react-icons/fa'
import { DateTime } from '@/components/one-trip-page/trip-view/TimeData'
import { Divider } from '@heroui/divider'
import { BsGeoAlt } from 'react-icons/bs'
import { CopyToClipboard } from '@/components/CopyToClipboard'
import { toast } from 'react-toastify'
import { Link } from '@heroui/link'
import { StatusButton } from '@/components/one-trip-page/cells/StatusButton'
import React, { useState } from 'react'
import { Section } from '@/types/types'

type Props = {
  section: Section
}

export const TripViewCard = ({ section }: Props) => {
  const [expanded, setExpanded] = useState(false)

  if (!section || !section.isEnabled) {
    return null
  }

  const startTime = section.startingPoint?.dateTime
  const endTime = section.endPoint?.dateTime
  const startAddress = section.startingPoint?.place?.address

  return (
    <Card key={section._id} className='max-w-[400px] mb-2'>
      <CardHeader className='flex flex-col items-start'>
        <div className='flex items-start gap-3 w-full'>
          <SectionTypeIcon
            classNames='mt-1 text-yellow-500'
            type={section.type}
          />
          <p className='text-md font-bold mb-4 w-full'>{section.name}</p>
          <button
            className='hover:bg-foreground-100 rounded-lg text-center p-2 text-foreground-600'
            title='expand section'
            onClick={() => setExpanded(!expanded)}
          >
            <FaExpand />
          </button>
        </div>

        <DateTime startTime={startTime} endTime={endTime} />
      </CardHeader>

      {expanded && (
        <>
          <Divider />
          <CardBody>
            {startAddress && (
              <div>
                <div className='flex text-sm mb-4'>
                  <BsGeoAlt className='mr-2 text-xl' />
                  <div className='mr-4'>{startAddress}</div>
                  <CopyToClipboard
                    text={startAddress}
                    onCopy={() => toast.success('Address copied')}
                  />
                </div>
                <div className='flex justify-between'>
                  <Button
                    as={Link}
                    className='ml-4 p-2 h-6'
                    color='primary'
                    href={`https://www.google.com/maps?q=${encodeURIComponent(startAddress)}`}
                    rel='noreferrer'
                    size='sm'
                    target='_blank'
                    variant='light'
                  >
                    Show directions
                  </Button>
                  <StatusButton status={section.status} />
                </div>
              </div>
            )}
          </CardBody>
        </>
      )}
    </Card>
  )
}
