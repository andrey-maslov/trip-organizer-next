'use client'

import { useMutation } from '@tanstack/react-query'
import { Input, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { DayPicker } from 'react-day-picker'

import { defaultTrip } from '@/constants/defaultEntities'
import { createTrip } from '@/apiRequests/apiDB'
import { isEmptyObject } from '@/lib/utils'
import { TripCoverEditable } from '@/components/templates/one-trip-page/TripCoverEditable'
import { getFormattedDate } from '@/lib/date'

export const CreateNewTrip = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugChanged, setSlugChanged] = useState(false)
  const [description, setDescription] = useState('')
  const [selectedDateStart, setSelectedDateStart] = useState<Date | undefined>()
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date | undefined>()
  const [cover, setCover] = useState('')

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
      dateTimeStart: selectedDateStart,
      dateTimeEnd: selectedDateEnd,
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
            <h2 className='text-2xl mb-4 text-foreground-500'>{description}</h2>
          ) : null}
          {(selectedDateStart || selectedDateEnd) && (
            <h2 className='text-2xl mb-8 text-foreground'>
              {`From ${selectedDateStart ? getFormattedDate(selectedDateStart) : ' ? '} to ${selectedDateEnd ? getFormattedDate(selectedDateEnd) : ' ? '}`}
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
      <div className='flex justify-center gap-4 mb-8'>
        <div>
          <DayPicker
            footer={
              <Button size='sm' onClick={() => setSelectedDateStart(undefined)}>
                Reset
              </Button>
            }
            fromDate={selectedDateEnd}
            mode='single'
            selected={selectedDateStart}
            onSelect={setSelectedDateStart}
          />
        </div>
        <div>
          <DayPicker
            footer={
              <Button size='sm' onClick={() => setSelectedDateEnd(undefined)}>
                Reset
              </Button>
            }
            fromDate={selectedDateStart}
            mode='single'
            selected={selectedDateEnd}
            onSelect={setSelectedDateEnd}
          />
        </div>
      </div>

      <div className='flex justify-center'>
        <Button
          className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg uppercase'
          isLoading={isPending}
          radius='full'
          size='lg'
          onClick={() => onCreateNewTrip()}
        >
          Create trip
        </Button>
      </div>
    </div>
  )
}
