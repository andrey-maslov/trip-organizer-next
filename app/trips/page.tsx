import React, { Suspense } from 'react'

import { Loader } from '@/components/Loader'
import TripsList from '@/components/trips-page/TripsList'
import { auth } from '@clerk/nextjs/server'

export const metadata = {
  title: 'My trips-page',
}

export default async function TripsPageTemplate() {

  const { sessionClaims } = await auth()

  console.log('SC', sessionClaims)

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <div>
          <TripsList />
        </div>
      </Suspense>
    </div>
  )
}
