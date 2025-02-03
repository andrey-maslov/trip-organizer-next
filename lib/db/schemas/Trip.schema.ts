import { Schema, model, models } from 'mongoose'

import { SectionSchema } from './Section.schema'

import { Trip } from '@/types/types'
import { defaultExchangeRates } from '@/constants/constants'

const TripSchema = new Schema<Trip>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  dateTimeStart: { type: Date, required: false },
  dateTimeEnd: { type: Date, required: false },
  description: { type: String, required: false },
  cover: { type: String, required: false },
  user: { type: String, required: true, default: null },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // TODO change to true
  }, // to connect with mongoDB
  sections: [SectionSchema],
  exchangeRates: {
    type: Object,
    required: false,
    default: defaultExchangeRates,
  },
})

const TripModel = models.TripModel || model('TripModel', TripSchema, 'trips')

export default TripModel
