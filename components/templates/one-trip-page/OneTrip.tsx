'use client'

import { useQuery } from '@tanstack/react-query'
import { deleteOneTrip, getOneTrip } from '@/apiRequests/apiRequests'
import { useParams, useRouter } from 'next/navigation'
import { OneTripTable } from '@/components/templates/one-trip-page/OneTripTable'
import { Divider } from '@nextui-org/react'
import { Button } from '@nextui-org/button'

export const OneTrip = () => {
  const { id } = useParams()
  const router = useRouter()

  const { isPending, error, data } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => getOneTrip(id as string),
  })

  const onDeleteTrip = () => {
    if (confirm('Do you really want to delete your trip data?')) {
      deleteOneTrip(id as string)
        .then(() => {
          router.push('/trips')
        })
        .catch((err) => console.log('Error: ' + err))
    }
  }

  if (isPending) return 'Loading...'

  if (error) {
    return 'An error has occurred: ' + error?.message
  }

  return (
    <div className='container p-4 lg:p-8'>
      <OneTripTable sections={data?.sections ?? []} />
      <Divider className='mb-8' />
      <Button onClick={onDeleteTrip} color='danger'>
        Delete trip
      </Button>
    </div>
  )
}
