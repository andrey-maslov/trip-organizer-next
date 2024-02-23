'use client'

import { Button } from '@nextui-org/button'
import { FiLogIn, FiLogOut } from 'react-icons/fi'

import { useEarthoOne } from '@eartho/one-client-react'

export const UserPopup = () => {
  const { isConnected, user, connectWithPopup, logout } = useEarthoOne()

  const EARTHO_ACCESS_POINT = process.env.NEXT_PUBLIC_EARTHO_ACCESS_POINT ?? ''

  console.log('User', user)

  return (
    <div>
      {isConnected ? (
        <div>
          <span className='text-foreground inline-block mr-2'>
            Hello, {user?.user?.displayName ?? 'unknown guest'}!
          </span>
          <Button
            className='text-sm font-normal text-default-600 bg-default-100'
            startContent={<FiLogOut className='text-danger' />}
            variant='flat'
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log Out
          </Button>
        </div>
      ) : (
        <Button
          className='text-sm font-normal text-default-600 bg-default-100'
          startContent={<FiLogIn className='text-danger' />}
          variant='flat'
          onClick={() => connectWithPopup({ access_id: EARTHO_ACCESS_POINT })}
        >
          Log In
        </Button>
      )}
    </div>
  )
}
