import React from 'react'

import { CreateNewTrip } from '@/components/templates/new-trip-page/CreateNewTrip'

export const metadata = {
  title: 'My trips-page',
}

export default function TripsPageTemplate() {
  return (
    <div>
      <CreateNewTrip />
    </div>
  )
}
