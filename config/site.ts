export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Trip Organizer',
  description: 'Quick and easy tool for organizing costs and logistics',
  navItems: [
    {
      label: 'Trips',
      href: '/trips',
    },
    {
      label: 'Profile',
      href: '/user-profile',
    },
    // {
    //   label: 'Blog',
    //   href: '/blog',
    // },
    // {
    //   label: 'About',
    //   href: '/about',
    // },
  ],
  navMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Logout',
      href: '/logout',
    },
  ],
  links: {
    github: '',
    twitter: '',
    docs: '',
    discord: '',
    sponsor: '',
  },
}

export const mainTitle =
  'Make your travels unforgettable and optimal regardless of the mode of transportation and the time of year'
export const mainSubtitle =
  'Quick and easy tool for organizing costs and logistics'
