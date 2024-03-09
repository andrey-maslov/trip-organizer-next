'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { createTrip, searchPictures } from '@/apiRequests/apiRequests'
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

export const CreateNewTrip = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedDateStart, setSelectedDateStart] = useState<Date | undefined>()
  const [selectedDateEnd, setSelectedDateEnd] = useState<Date | undefined>()
  const [cover, setCover] = useState('')

  const [picsListOpen, setPicsListOpen] = useState(false)

  const canFetchPics = picsListOpen && name.length >= 5

  const { data: pictures, isLoading: picturesLoading } = useQuery({
    queryKey: ['pictures', name],
    queryFn: () => searchPictures(name),
    enabled: canFetchPics,
  })

  // Create New Trip
  const { mutate: createTripMutation, isPending } = useMutation({
    mutationFn: createTrip,
    onSuccess: (res) => {
      if (res.id) {
        router.push(`/trips/${res.id}`)
      }
    },
  })

  const onCreateNewTrip = () => {
    createTripMutation({
      ...defaultTrip,
      name,
      description,
      cover,
      dateTimeStart: selectedDateStart,
      dateTimeEnd: selectedDateEnd,
    })
  }

  return (
    <div className='max-w-[800px] m-auto'>
      <div className='flex gap-8'>
        <div className='w-[200px] h-[200px] relative cell-editable'>
          <Image
            width={200}
            height={200}
            alt='Trip cover'
            src={cover}
            fallbackSrc={defaultCoverImage}
          />
          {name.length >= 5 && (
            <ButtonEdit onClick={() => setPicsListOpen(true)} />
          )}

          <Modal
            backdrop='opaque'
            size='3xl'
            isOpen={picsListOpen}
            onOpenChange={setPicsListOpen}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className='flex flex-col gap-1'>
                    Choose you cover image
                  </ModalHeader>
                  <ModalBody>
                    {picturesLoading ? (
                      <div>loading...</div>
                    ) : (
                      <div className='grid grid-cols-4 gap-4'>
                        {pictures?.results.map((picture) => (
                          <Image
                            className='cursor-pointer'
                            key={picture.id}
                            width={300}
                            height={300}
                            alt='Trip cover'
                            src={picture.urls.small}
                            onClick={() => {
                              setCover(picture.urls.small)
                              onClose()
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
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
            <Input
              type='text'
              placeholder='Enter name of your trip here'
              labelPlacement='outside'
              value={name}
              onChange={(event) => setName(event.target.value)}
              className='mb-8'
            />
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
