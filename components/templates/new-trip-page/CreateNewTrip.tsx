'use client'

import { useMutation } from '@tanstack/react-query'
import { createTrip } from '@/apiRequests/apiRequests'
import { defaultTrip } from '@/constants/defaultEntities'
import { Input } from '@nextui-org/react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'

export const CreateNewTrip = () => {
  const router = useRouter()

  const [name, setName] = useState('')

  // Create New Trip
  const { mutate: createTripMutation } = useMutation({
    mutationFn: createTrip,
    onSuccess: (res) => {
      if (res.id) {
        router.push(`/trips/${res.id}`)
      }
    },
  })

  const onCreateNewTrip = () => {
    createTripMutation({ ...defaultTrip, name })
  }

  return (
    <div>
      <h1 className='text-4xl font-bold mb-8 min-h-8'>{name}</h1>
      <Input
        type='text'
        placeholder='Enter name of your trip here'
        labelPlacement='outside'
        value={name}
        onChange={(event) => setName(event.target.value)}
        className='mb-8'
      />
      <Button
        radius='full'
        className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg'
        onClick={() => onCreateNewTrip()}
      >
        Create trip
      </Button>
    </div>
  )
}
