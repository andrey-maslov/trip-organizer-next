import { Section, SectionFE, Trip, TripPoint } from '@/types/types'

export const defaultPoint: TripPoint = {
  place: {},
}

export const defaultSection: Omit<Section, '_id'> = {
  type: 'unknown',
  name: '',
  status: 'to_find',
  startingPoint: defaultPoint,
  endPoint: defaultPoint,
  isEnabled: true,
}

const defaultSections: Section[] = new Array(5).fill(defaultSection)

export const defaultTrip: Partial<Trip> = {
  name: 'new trip',
  sections: defaultSections,
}

export const getDefaultSection = (): SectionFE => ({
  id: Date.now().toString(),
  type: 'unknown',
  name: '',
  status: 'to_find',
  startingPoint: defaultPoint,
  endPoint: defaultPoint,
  isEnabled: true,
})

export const defaultCoverImage =
  'https://images.unsplash.com/photo-1541665728259-94dc0f5964d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzY5NzB8MHwxfHNlYXJjaHw1fHxqb3VybmV5JTIwM3xlbnwwfHx8fDE3MTYxMzYwNzh8MA&ixlib=rb-4.0.3&q=80&w=400'

export const fakeStartPoint: TripPoint = {
  place: {
    name: 'Wroclaw',
    address: 'ul. Sucha 1, 50-086 Wrocław, Polska',
  },
  dateTime: '2023-08-29T15:36:32.807Z',
  timeZone: 'Europe/Warsaw',
  // coordinates: '',
}

export const fakeAddresses = [{ label: 'Address 1', value: 'address_1' }]

// My user Clerk ID: user_2cK7cizAIAW3IHsv1N6nRn8TJDq

// My user - Clerk user
const clerkUser = {
  id: 'user_2cK7cizAIAW3IHsv1N6nRn8TJDq',
  passwordEnabled: false,
  totpEnabled: false,
  backupCodeEnabled: false,
  twoFactorEnabled: false,
  banned: false,
  locked: false,
  createdAt: 1707848497430,
  updatedAt: 1727724200935,
  imageUrl:
    'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yY0s3Y2pueHI1MnZISkZ3bVh5V2tFc2RjN1cifQ',
  hasImage: true,
  primaryEmailAddressId: 'idn_2cK7cfVpGfl2UBFGfYIbM0gEDnh',
  primaryPhoneNumberId: null,
  primaryWeb3WalletId: null,
  lastSignInAt: 1727724200905,
  externalId: null,
  username: null,
  firstName: 'Andrey',
  lastName: 'Maslov',
  publicMetadata: {},
  privateMetadata: {},
  unsafeMetadata: {},
  emailAddresses: [
    {
      id: 'idn_2cK7cfVpGfl2UBFGfYIbM0gEDnh',
      emailAddress: 'andrei.maslau@gmail.com',
      linkedTo: [Array],
    },
  ],
  phoneNumbers: [],
  web3Wallets: [],
  externalAccounts: [
    {
      id: 'idn_2cK7cZkBYY49hj3HAwXJPeRf2Mb',
      provider: undefined,
      identificationId: undefined,
      externalId: undefined,
      approvedScopes:
        'email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid profile',
      emailAddress: 'andrei.maslau@gmail.com',
      firstName: undefined,
      lastName: undefined,
      imageUrl: '',
      username: '',
      publicMetadata: {},
      label: null,
      verification: [],
    },
  ],
  samlAccounts: [],
  lastActiveAt: 1727720970871,
  createOrganizationEnabled: true,
  createOrganizationsLimit: null,
  deleteSelfEnabled: true,
}

// Ngrok domain https://busy-jackal-promptly.ngrok-free.app
