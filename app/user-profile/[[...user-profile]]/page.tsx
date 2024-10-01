import React from 'react'
import { UserProfile } from '@clerk/nextjs'

export const metadata = {
  title: 'My Profile',
}

export default function TripsPageTemplate() {
  return (
    <div>
      <div>
        <UserProfile path='/user-profile' />
      </div>
    </div>
  )
}
