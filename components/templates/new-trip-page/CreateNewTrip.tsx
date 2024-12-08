'use client'

import { useMutation } from '@tanstack/react-query'
import { DateRangePicker, Input, RangeValue, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { DateValue } from '@internationalized/date'

import { defaultTrip } from '@/constants/defaultEntities'
import { createTrip } from '@/queries/queries.db'
import { isEmptyObject } from '@/lib/utils'
import { TripCoverEditable } from '@/components/templates/one-trip-page/TripCoverEditable'
import { getFormattedDate } from '@/lib/date'

export const CreateNewTrip = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugChanged, setSlugChanged] = useState(false)
  const [description, setDescription] = useState('')
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
      dateTimeStart: date?.start ? date.start.toString() : '',
      dateTimeEnd: date?.end ? date.end.toString() : '',
    })
  }

  return (
    <div className='max-w-[800px] m-auto'>
      <div className='flex gap-8'>
        <div className='w-[200px] h-[200px]'>
          <TripCoverEditable
            coverSrc={cover}
            setCoverSrc={setCover}
            tripName={name}
          />
        </div>

        <div className='flex-grow'>
          <h1 className='text-4xl font-bold mb-6'>{name}</h1>
          {description.length > 5 ? (
            <h2 className='text-xl mb-4 text-foreground-500'>{description}</h2>
          ) : null}
          {(date?.start || date?.end) && (
            <h2 className='text-xl mb-8 text-foreground'>
              {`From ${date?.start ? getFormattedDate(date?.start.toString()) : ' ? '} to ${date.end ? getFormattedDate(date.end.toString()) : ' ? '}`}
            </h2>
          )}
          <div className='mb-8'>
            <div className='flex gap-4'>
              <div className='w-full'>
                <Input
                  className='mb-4'
                  label='Name'
                  labelPlacement='outside'
                  placeholder='Enter name of your trip here'
                  type='text'
                  value={name}
                  onChange={(event) => {
                    // TODO improve - sanitize
                    setName(event.target.value)
                    if (!slugChanged) {
                      setSlug(
                        event.target.value
                          .replaceAll(/ +|\./gi, '-')
                          .toLowerCase()
                          .trim()
                      )
                    }
                  }}
                />
              </div>
              <div className='w-full'>
                <Input
                  className='mb-4'
                  label='Slug'
                  labelPlacement='outside'
                  type='text'
                  value={slug}
                  onChange={(event) => {
                    if (!slugChanged) {
                      setSlugChanged(true)
                    }
                    // TODO improve - sanitize, use slugify or create the same ???
                    setSlug(
                      event.target.value.replaceAll(/ /gi, '-').toLowerCase()
                    )
                  }}
                />
              </div>
            </div>
            <Textarea
              fullWidth
              label='Description'
              placeholder='Enter your description'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className='mb-14'>
        <DateRangePicker
          label='Trip duration'
          labelPlacement='outside'
          value={date}
          visibleMonths={2}
          onChange={setDate}
        />
      </div>

      <div className='flex justify-center'>
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
  )
}
