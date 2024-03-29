import React, { Suspense } from 'react'

import Loader from '@/components/Loader'
import TripsList from '@/components/templates/trips-page/TripsList'

export const metadata = {
  title: 'My trips-page',
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
