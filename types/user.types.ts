export type Role = 'admin' | 'user'

// What we have in MongoDB
export type UserDB = {
  clerkId: string
  email: string | null
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  roles: Role[]
  createdAt: number | Date
  updatedAt: number | Date
}

// What we retrieve from Clerk and have in session
export type UserClerk = Omit<UserDB, 'clerkId'> & {
  id: string
  externalId: string
}

export type UserData = Omit<UserDB, 'createdAt' | 'updatedAt'> & {
  mongoId: string; // MongoDB ID
}
