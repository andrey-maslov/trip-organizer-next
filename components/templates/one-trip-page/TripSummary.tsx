import { Card, CardBody, Select, SelectItem } from '@nextui-org/react'
import { CardHeader } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { currencies, DEFAULT_CURRENCY } from '@/constants/constants'
import { getTripSummary } from '@/queries/queries.db'
import { getSummaryToDisplay } from '@/components/templates/one-trip-page/trip.utils'

type Props = {
  trip: string // slug
}

export const TripSummary = ({ trip }: Props) => {
  const [currencyISO, setCurrencyISO] = useState(
    window.localStorage.getItem('app_currency_chosen') ?? DEFAULT_CURRENCY
  )

  // Fetch Summary
  const { data } = useQuery({
    queryKey: ['summary', trip, currencyISO],
    queryFn: () => getTripSummary(trip as string, currencyISO),
    enabled: Boolean(currencyISO),
  })

  const summaryToDisplay = getSummaryToDisplay(data)

  return (
    <div>
      <Card className='max-w-[600px]'>
        <CardHeader className='flex gap-2'>
          <div className='w-full'>
            <p className='text-lg font-bold'>Summary</p>
            <p className='text-small text-default-500'>Money and time spent</p>
          </div>
          <Select
            className='max-w-[200px]'
            defaultSelectedKeys={[currencyISO]}
            label='Select a currency'
            startContent={
              currencies[currencyISO as keyof typeof currencies]?.symbol ?? ''
            }
            onChange={(evt) => {
              setCurrencyISO(evt.target.value as any)
              window.localStorage.setItem(
                'app_currency_chosen',
                evt.target.value
              )
            }}
          >
            {Object.values(currencies).map((curr) => (
              <SelectItem
                key={curr.nameISO}
                startContent={curr.symbol}
                value={curr.nameISO}
              >
                {curr.name}
              </SelectItem>
            ))}
          </Select>
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
