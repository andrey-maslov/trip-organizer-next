import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from '@heroui/navbar'
import { Image } from '@heroui/image'
import { Link } from '@heroui/link'
import { link as linkStyles } from '@heroui/theme'
import NextLink from 'next/link'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from '@heroui/button'
import { FiLogIn } from 'react-icons/fi'

import { siteConfig } from '@/config/site'
import { UserPopup } from '@/components/layouts/header/UserPopup'
import { MobileMenu } from '@/components/layouts/header/MobileMenu'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const Navbar = () => {
  const currentUser = useCurrentUser()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <NextUINavbar
      isBordered
      isMenuOpen={isMenuOpen}
      maxWidth='xl'
      position='sticky'
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink
            className='flex justify-start items-center gap-1 text-foreground'
            href='/'
          >
            <Image
              alt='trip planr logo'
              src='/trip_planr_logo.svg'
              width={120}
            />
            {/*<BrandLogo />*/}
            {/*<h3 className='font-bold text-xl'>TripOrg</h3>*/}
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <ul className='hidden lg:flex gap-4 justify-start ml-2'>
        {currentUser &&
          siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium px-6'
                )}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
      </ul>

      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <NavbarItem className='hidden md:flex'>
          <UserPopup />
        </NavbarItem>
      </NavbarContent>

      {/*Mobile*/}

      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        <SignedIn>
          <NavbarMenuToggle />
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
      </NavbarContent>

      {/*Mobile*/}
      <NavbarMenu>
        <MobileMenu setIsMenuOpen={setIsMenuOpen} />
      </NavbarMenu>
    </NextUINavbar>
  )
}
