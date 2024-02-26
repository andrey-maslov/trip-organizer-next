'use client'

import { useQuery } from '@tanstack/react-query'
import { getOneTrip } from '@/apiRequests/apiRequests'
import { useParams } from 'next/navigation'
import { OneTripTable } from '@/components/templates/one-trip-page/OneTripTable'

export const OneTrip = () => {
  const params = useParams()
  const { isPending, error, data } = useQuery({
    queryKey: ['trip', params.id],
    queryFn: () => getOneTrip(params.id as string),
  })

  if (isPending) return 'Loading...'

  if (error) {
    return 'An error has occurred: ' + error?.message
  }

  return (
    <div className='container p-4 lg:p-8'>
      <OneTripTable sections={data?.sections ?? []} />
    </div>
  )
}
