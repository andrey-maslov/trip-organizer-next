'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { createTrip } from '@/apiRequests/apiDB'
import { defaultCoverImage, defaultTrip } from '@/constants/defaultEntities'
import {
  Input,
  Textarea,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@nextui-org/react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { ButtonEdit } from '@/components/ButtonEdit'
import { searchPictures } from '@/apiRequests/apiExternal'
import { isEmptyObject } from '@/lib/utils'
import { TripCoverEditable } from '@/components/templates/one-trip-page/TripCoverEditable'

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
          <h2 className='text-2xl mb-8 text-foreground'>
            {selectedDateStart ? `From ${format(selectedDateStart, 'PP')}` : ''}{' '}
            {selectedDateEnd ? `to ${format(selectedDateEnd, 'PP')}` : ''}
          </h2>
          <div className='mb-8'>
            <div className='flex gap-4'>
              <div className='w-full'>
                <Input
                  label='Name'
                  type='text'
                  placeholder='Enter name of your trip here'
                  labelPlacement='outside'
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
                  className='mb-4'
                />
              </div>
              <div className='w-full'>
                <Input
                  label='Slug'
                  type='text'
                  labelPlacement='outside'
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
                  className='mb-4'
                />
              </div>
            </div>
            <Textarea
              label='Description'
              placeholder='Enter your description'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center gap-4 mb-8'>
        <div>
          {/*<h3 className='font-bold text-lg mb-8'>Date Start</h3>*/}
          <DayPicker
            mode='single'
            selected={selectedDateStart}
            onSelect={setSelectedDateStart}
            fromDate={selectedDateEnd}
            footer={
              <Button size='sm' onClick={() => setSelectedDateStart(undefined)}>
                Reset
              </Button>
            }
          />
        </div>
        <div>
          {/*<h3 className='font-bold text-xl mb-8'>Date End</h3>*/}
          <DayPicker
            mode='single'
            selected={selectedDateEnd}
            onSelect={setSelectedDateEnd}
            fromDate={selectedDateStart}
            footer={
              <Button size='sm' onClick={() => setSelectedDateEnd(undefined)}>
                Reset
              </Button>
            }
          />
        </div>
      </div>

      <div className='flex justify-center'>
        <Button
          radius='full'
          className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg uppercase'
          onClick={() => onCreateNewTrip()}
          isLoading={isPending}
          size='lg'
        >
          Create trip
        </Button>
      </div>
    </div>
  )
}
