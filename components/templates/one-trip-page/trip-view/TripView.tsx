import React from 'react'
import { Card, CardBody, CardFooter } from '@nextui-org/react'
import { CardHeader } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import { FiEdit2 } from 'react-icons/fi'

import { Trip } from '@/types/models'
import { SectionTypeIcon } from '@/components/SectionTypeIcon'
import { getFormattedDate, getFormattedTime } from '@/lib/date'

type Props = {
  trip: Trip
}

export const TripView = ({ trip }: Props) => {
  return (
    <div>
      {trip.sections.map((section) => {
        return (
          <Card key={section._id} className='max-w-[400px] mb-2'>
            <CardHeader className='flex gap-3'>
              <SectionTypeIcon type={section.type ?? 'unknown'} />
              <div className='flex flex-col w-full'>
                <p className='text-md font-bold'>{section.name}</p>
                <p className='text-default-500 font-light'>
                  {section.serviceProvider?.name}
                </p>
              </div>
              <button
                className='hover:bg-foreground-100 rounded-lg text-center p-2'
                title='edit address'
                onClick={() => console.log('')}
              >
                <FiEdit2 />
              </button>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className='text-small text-default-500'>
                <span>Start: </span>
                <span className='text-md font-bold'>
                  {getFormattedTime(
                    section.startingPoint?.dateTime,
                    'short',
                    'ru'
                  )}
                </span>{' '}
                <span>
                  {getFormattedDate(section.startingPoint?.dateTime, 'medium')}
                </span>
              </p>
              <p className='text-small text-default-500'>
                <span>Finish: </span>
                <span className='text-md font-bold'>
                  {getFormattedTime(section.endPoint?.dateTime, 'short', 'ru')}
                </span>{' '}
                <span>
                  {getFormattedDate(section.endPoint?.dateTime, 'medium')}
                </span>
              </p>
              <Divider className='my-2' />
              <p>some</p>
            </CardBody>

            <CardFooter>Note</CardFooter>
          </Card>
        )
      })}
      {/*<h2>*/}
      {/*  <Button*/}
      {/*    isIconOnly*/}
      {/*    size='sm'*/}
      {/*    variant='light'*/}
      {/*    // isLoading={isPending}*/}
      {/*  >*/}
      {/*    <div className='text-xl text-foreground-400'>*/}
      {/*      /!*<TripTypeIcon type={trip.type ?? 'unknown'} />*!/*/}
      {/*    </div>*/}
      {/*  </Button>*/}
      {/*  {trip.name}*/}
      {/*</h2>*/}
    </div>
  )
}
