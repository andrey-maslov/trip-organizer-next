import { Role } from './user.types'

export {}

declare global {
  interface CustomJWTSessionClaims {
    role: Role
  }
}
