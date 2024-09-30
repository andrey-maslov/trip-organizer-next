import { model, models, Schema } from 'mongoose'

import { UserData } from '@/types/types'

const UserSchema = new Schema<UserData>({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  displayName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
})

const UserModel =
  (models.UserModel as any) || model('UserModel', UserSchema, 'users')

export default UserModel
