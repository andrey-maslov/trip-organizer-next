export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Trip Organizer',
  description: 'Quick and easy tool for organizing costs and logistics',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Pricing',
      href: '/pricing',
    },
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: 'About',
      href: '/about',
    },
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
      label: 'Projects',
      href: '/projects',
    },
    {
      label: 'Team',
      href: '/team',
    },
    {
      label: 'Calendar',
      href: '/calendar',
    },
    {
      label: 'Settings',
      href: '/settings',
    },
    {
      label: 'Help & Feedback',
      href: '/help-feedback',
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
