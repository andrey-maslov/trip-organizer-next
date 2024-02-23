import React, { Suspense } from 'react'

import Loader from '@/components/Loader'
import TripsList from '@/components/templates/trips/TripsList'

export const metadata = {
  title: 'My trips',
}

export default function TripsPageTemplate() {
  return (
    <div className='container p-4 lg:p-8'>
      <Suspense fallback={<Loader />}>
        <div>
          <TripsList />
        </div>
      </Suspense>
    </div>
  )
}
