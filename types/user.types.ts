export type Role = 'admin' | 'user'

// What we have in MongoDB
export type UserDB = {
  // _id: string // Clerk id
  clerkId: string // MongoDB id
  email: string | null
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  roles: Role[]
  createdAt: number | Date
  updatedAt: number | Date
}

// What we retrieve from Clerk and have in session
export type UserData = Omit<UserDB, 'clerkId'> & {
  id: string
  externalId: string
}
