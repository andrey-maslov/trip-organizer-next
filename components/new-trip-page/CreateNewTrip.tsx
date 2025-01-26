'use client'

import { useMutation } from '@tanstack/react-query'
import {
  DateRangePicker,
  Input,
  RangeValue,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@heroui/button"
import { DateValue } from '@internationalized/date'

import { defaultTrip } from '@/constants/defaultEntities'
import { createTrip } from '@/queries/queries.db'
import { isEmptyObject } from '@/lib/utils'
import { TripCoverEditable } from '@/components/one-trip-page/TripCoverEditable'
import { getFormattedDate } from '@/lib/date'
import { currencies, DEFAULT_CURRENCY } from '@/constants/constants'
import { slugify } from 'transliteration';
import { sanitizeInput } from '@/lib/sanitizeInput'

export const CreateNewTrip = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugChanged, setSlugChanged] = useState(false)
  const [description, setDescription] = useState('')
  const [currencyISO, setCurrencyISO] = useState(DEFAULT_CURRENCY)
  const [cover, setCover] = useState('')
  const [date, setDate] = React.useState<RangeValue<DateValue | any> | null>(
    null
  )

  // Create New Trip
  const { mutate: createTripMutation, isPending } = useMutation({
    mutationFn: createTrip,
    onSuccess: (res) => {
      if (!isEmptyObject(res)) {
        router.push(`/trips/${res.slug || res.id}`)
      }
    },
  })

  const onCreateNewTrip = () => {
    createTripMutation({
      ...defaultTrip,
      name,
      slug,
      description,
      cover,
      tripCurrency: currencyISO,
      dateTimeStart: date?.start ? date.start.toString() : '',
      dateTimeEnd: date?.end ? date.end.toString() : '',
    })
  }

  return (
    <div className='max-w-[800px] m-auto'>
      <div className='flex gap-8'>
        <div className='w-[200px] h-[200px] flex-shrink-0'>
          <TripCoverEditable
            coverSrc={cover}
            setCoverSrc={setCover}
            tripName={name}
          />
        </div>

        <div className='flex-grow'>
          <h1 className='text-4xl font-bold mb-6 min-h-[40px] truncate max-w-[500px]'>
            {name}
          </h1>
          {description.length > 5 ? (
            <h2 className='text-xl mb-4 text-foreground-500'>{description}</h2>
          ) : null}
          {(date?.start || date?.end) && (
            <h2 className='text-xl mb-8 text-foreground'>
              {`From ${date?.start ? getFormattedDate(date?.start.toString()) : ' ? '} to ${date.end ? getFormattedDate(date.end.toString()) : ' ? '}`}
            </h2>
          )}
          <div className='flex gap-4 mb-8 flex-wrap justify-between'>
            <Input
              className='w-1/2'
              label='Name'
              labelPlacement='outside'
              placeholder='Enter name of your trip here'
              type='text'
              value={name}
              description='20 symbols max'
              onChange={(event) => {
                const text = event.target.value
                if (text.length > 20) {
                  return
                }

                setName(sanitizeInput(text))

                if (!slugChanged) {
                  setSlug(slugify(text))
                }
              }}
            />
            <Input
              className='w-2/5'
              label='Slug'
              labelPlacement='outside'
              type='text'
              value={slug}
              description='20 symbols max'
              onChange={(event) => {
                if (!slugChanged) {
                  setSlugChanged(true)
                }
                const text = event.target.value
                if (text.length > 20) {
                  return
                }
                setSlug(slugify(text))
              }}
            />
            <Textarea
              fullWidth
              label='Description'
              labelPlacement='outside'
              placeholder='Enter your description'
              value={description}
              onChange={(event) => {
                setDescription(sanitizeInput(event.target.value))
              }}
            />
            <DateRangePicker
              label='Trip duration'
              labelPlacement='outside'
              value={date}
              visibleMonths={2}
              onChange={setDate}
            />
            <div className='flex gap-4'>
              <Select
                aria-label='currency'
                className='w-[100px] flex-shrink-0'
                defaultSelectedKeys={[currencyISO]}
                size='sm'
                onChange={(evt) => setCurrencyISO(evt.target.value)}
              >
                {Object.values(currencies).map((curr) => (
                  <SelectItem key={curr.nameISO} value={curr.nameISO}>
                    {curr.nameISO}
                  </SelectItem>
                ))}
              </Select>
              <small className='leading-1'>
                Select your preferred currency. It will be used for all trip
                payment conversions. It will be fixed without an ability to
                change further
              </small>
            </div>
          </div>
          <Button
            className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg uppercase'
            isLoading={isPending}
            radius='full'
            size='lg'
            onPress={() => onCreateNewTrip()}
          >
            Create trip
          </Button>
        </div>
      </div>
    </div>
  )
}
