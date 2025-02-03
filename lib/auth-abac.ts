//
import { Trip } from '@/types/types'
import { Role, UserData } from '@/types/user.types'

/**
 * ABAC = attribute based access control
 * Subject
 * Action
 * Resource
 * Other info (Environment, Organization, etc.)
 */

// type Comment = {
//   id: string
//   body: string
//   authorId: string
//   createdAt: Date
// }

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: UserData, data: Permissions[Key]['dataType']) => boolean)

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>
    }>
  }>
}

type Permissions = {
  comments: {
    dataType: Comment
    action: 'view' | 'create' | 'update'
  }
  trips: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Trip
    action: 'view' | 'create' | 'update' | 'delete'
  }
}

const ROLES = {
  admin: {
    trips: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    comments: {
      view: true,
      create: true,
      update: true,
    },
  },
  user: {
    trips: {
      view: (user, trip) => user.id === trip.user,
      create: true,
      update: (user, trip) => trip.user === user.id,
      delete: (user, todo) => todo.userId === user.id,
    },
    // comments: {
    //   view: (user, comment) => !user.blockedBy.includes(comment.authorId),
    //   create: true,
    //   update: (user, comment) => comment.authorId === user.id,
    // },
  },
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
  user: UserData,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
    if (permission == null) return false

    if (typeof permission === 'boolean') return permission
    return data != null && permission(user, data)
  })
}

// USAGE:
// const user: User = { blockedBy: ['2'], id: '1', roles: ['user'] }
// const todo: Todo = {
//   completed: false,
//   id: '3',
//   invitedUsers: [],
//   title: 'Test Todo',
//   userId: '1',
// }

// Can create a comment
// hasPermission(user, 'comments', 'create')

// Can view the `trip` Trip
// hasPermission(user, 'trips', 'view', trip)

// Can view all trips
// hasPermission(user, 'trips', 'view')
