'use client'

import { Card, CardBody } from '@nextui-org/react'
import { CardHeader } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { getTripSummary } from '@/queries/queries.db'
import { getSummaryToDisplay } from '@/components/one-trip-page/trip.utils'

type Props = {
  trip: string // slug
  currency: string
}

export const TripSummary = ({ trip, currency }: Props) => {
  // Fetch Summary
  const { data } = useQuery({
    queryKey: ['summary', trip],
    queryFn: () => getTripSummary(trip as string, currency),
  })

  const summaryToDisplay = getSummaryToDisplay(data, currency)

  return (
    <div>
      <Card className='max-w-[600px]'>
        <CardHeader className='flex gap-2'>
          <div className='w-full'>
            <p className='text-lg font-bold'>Summary</p>
            <p className='text-small text-default-500'>Money and time spent</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className='flex justify-between'>
            {summaryToDisplay &&
              Object.values(summaryToDisplay).map((item, i) => (
                <ul key={i} className=''>
                  {item.map((item) => (
                    <li key={item.label} className='flex justify-between mb-2'>
                      <div className='mr-4 text-foreground-600'>
                        {item.label}:
                      </div>
                      <div className='w-[100px]'>{item.value}</div>
                    </li>
                  ))}
                </ul>
              ))}
          </div>
        </CardBody>
        <Divider />
      </Card>
    </div>
  )
}
