'use client'

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@nextui-org/button'
import { FiLogIn } from 'react-icons/fi'
import { Link } from '@nextui-org/link'

export const UserPopup = () => {
  const { user } = useUser()

  return (
    <div>
      <SignedIn>
        <div className='flex items-center justify-between p-6'>
          <span className='text-foreground-500 inline-block mr-2 text-small'>
            Hello, {user?.firstName ?? 'unknown guest'}!
          </span>

          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <Button
          as={Link}
          className='text-sm font-normal text-default-600 bg-default-100'
          href={'/sign-in'}
          startContent={<FiLogIn className='text-yellow-600' />}
          variant='flat'
        >
          Sign In
        </Button>
      </SignedOut>
    </div>
  )
}
