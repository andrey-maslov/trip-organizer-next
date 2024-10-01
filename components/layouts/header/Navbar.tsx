import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@nextui-org/navbar'
import { Link } from '@nextui-org/link'
import { link as linkStyles } from '@nextui-org/theme'
import NextLink from 'next/link'
import clsx from 'clsx'
import { FiTwitter } from 'react-icons/fi'
import { useUser } from '@clerk/nextjs'

import { ThemeSwitch } from '@/components/layouts/header/ThemeSwitch'
import { siteConfig } from '@/config/site'
import { UserPopup } from '@/components/layouts/header/UserPopup'

export const Navbar = () => {
  const user = useUser()

  return (
    <NextUINavbar maxWidth='xl' position='sticky'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink
            className='flex justify-start items-center gap-1 text-foreground'
            href='/'
          >
            <h3 className='font-bold text-xl'>TripOrg</h3>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent>
        <ul className='hidden lg:flex gap-4 justify-start ml-2'>
          {user.user &&
            siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:text-primary data-[active=true]:font-medium'
                  )}
                  color='foreground'
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        {/*<NavbarItem className='hidden sm:flex gap-2'>*/}
        {/*  <ThemeSwitch />*/}
        {/*</NavbarItem>*/}
        <NavbarItem className='hidden md:flex'>
          <UserPopup />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        <Link isExternal aria-label='Github' href={siteConfig.links.github}>
          <FiTwitter className='text-default-500' />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item}-${index}`}
              onClick={() => console.log('changed')}
            >
              <Link
                color={
                  index === 2
                    ? 'primary'
                    : index === siteConfig.navItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href={item.href}
                size='lg'
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  )
}
