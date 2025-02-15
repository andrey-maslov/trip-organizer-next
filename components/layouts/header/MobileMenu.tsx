import { NavbarMenuItem } from '@heroui/navbar'
import { Link } from '@heroui/link'
import { useClerk } from '@clerk/nextjs'
import { Divider } from '@heroui/divider'

import { siteConfig } from '@/config/site'

type Props = {
  isMenuOpen?: boolean
  setIsMenuOpen: (isOpen: boolean) => void
}

export const MobileMenu = ({ setIsMenuOpen }: Props) => {
  const { signOut } = useClerk()

  return (
    <div className='mx-4 mt-2 flex flex-col gap-2'>
      {siteConfig.navItems.map((item, index) => (
        <NavbarMenuItem key={index} className='py-3'>
          <Link
            color='foreground'
            href={item.href}
            size='lg'
            onPress={() => setIsMenuOpen(false)}
          >
            {item.label}
          </Link>
        </NavbarMenuItem>
      ))}
      <Divider className='my-3' />
      <NavbarMenuItem key='logout' className='py-3'>
        <Link
          color='danger'
          size='lg'
          onPress={async () => {
            await signOut({ redirectUrl: '/' })
            setIsMenuOpen(false)
          }}
        >
          Sign out
        </Link>
      </NavbarMenuItem>
    </div>
  )
}
