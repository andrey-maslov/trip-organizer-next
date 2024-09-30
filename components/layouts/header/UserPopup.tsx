'use client'

import {
  SignedIn,
  SignedOut,
  useClerk,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import { Button } from '@nextui-org/button'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { Link } from '@nextui-org/link'

export const UserPopup = () => {
  const { signOut } = useClerk()
  const { user } = useUser()

  // console.log('U', user)

  return (
    <div>
      <SignedIn>
        <div>
          <span className='text-foreground inline-block mr-2'>
            Hello, {user?.firstName ?? 'unknown guest'}!
          </span>

          <UserButton />

          <Button
            className='text-sm font-normal text-default-600 bg-default-100'
            startContent={<FiLogOut className='text-danger' />}
            variant='flat'
            onPress={() => signOut({ redirectUrl: '/' })}
          >
            Logout
          </Button>
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
