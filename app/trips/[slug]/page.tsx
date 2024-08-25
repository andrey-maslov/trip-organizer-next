import React, { Suspense } from 'react'

import Loader from '@/components/Loader'
import { OneTrip } from '@/components/templates/one-trip-page/OneTrip'

export const metadata = {
  title: 'My journey',
}

export default function OneTripPageTemplate() {
  return (
    <div className='container p-4 lg:p-8'>
      <Suspense fallback={<Loader />}>
        <div>
          <OneTrip />
        </div>
      </Suspense>
    </div>
  )
}
