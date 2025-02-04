import { useUser } from '@clerk/nextjs'
import { Role, UserData } from '@/types/user.types'

export const useCurrentUser = (): UserData | null => {
  const userClerk = useUser()

  if (!userClerk.user) {
    return null
  }

  return {
    mongoId: userClerk.user.externalId ?? '',
    clerkId: userClerk.user.id,
    email: userClerk.user.emailAddresses[0].emailAddress,
    firstName: userClerk.user.firstName,
    lastName: userClerk.user.lastName,
    imageUrl: userClerk.user.imageUrl,
    roles: (userClerk.user.publicMetadata.roles ?? ['user']) as Role[],
  }
}
