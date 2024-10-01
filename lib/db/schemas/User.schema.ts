import { model, models, Schema } from 'mongoose'

import { UserDB } from '@/types/types'

const UserSchema = new Schema<UserDB>({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  userClerkId: { type: String, required: false, unique: true },
  role: {
    type: String,
    required: true,
  },
})

const UserModel =
  (models.UserModel as any) || model('UserModel', UserSchema, 'users')

export default UserModel
