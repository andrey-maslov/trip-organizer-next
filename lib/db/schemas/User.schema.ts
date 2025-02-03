import { Schema, model, models } from 'mongoose'
import { UserDB } from '@/types/user.types'

const UserSchema = new Schema<UserDB>({
  clerkId: { type: String, required: true }, // Clerk user ID
  email: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  imageUrl: { type: String, required: false },
  roles: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const UserModel = models.UserModel || model('UserModel', UserSchema, 'users')
export default UserModel
