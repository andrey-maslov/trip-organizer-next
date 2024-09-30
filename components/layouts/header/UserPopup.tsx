'use client'

import { Button } from '@nextui-org/button'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { connectWithPopup, useUser } from '@eartho/one-client-nextjs/client'
import { Link } from '@nextui-org/link'

export const UserPopup = () => {
  const { user, error, isLoading, checkSession } = useUser()

  console.log(user)

  // TODO fix all callbacks
  const EARTHO_ACCESS_POINT = process.env.NEXT_PUBLIC_EARTHO_ACCESS_POINT ?? ''

  return (
    <div>
      {user ? (
        <div>
          <span className='text-foreground inline-block mr-2'>
            Hello, {user.displayName ?? 'unknown guest'}!
          </span>
          <Button
            as={Link}
            className='text-sm font-normal text-default-600 bg-default-100'
            href={'/api/access/logout'}
            startContent={<FiLogOut className='text-danger' />}
            variant='flat'
          >
            Log Out
          </Button>
        </div>
      ) : (
        <Button
          className='text-sm font-normal text-default-600 bg-default-100'
          startContent={<FiLogIn className='text-yellow-600' />}
          variant='flat'
          onPress={() => connectWithPopup('login')}
        >
          Log In
        </Button>
      )}
    </div>
  )
}
