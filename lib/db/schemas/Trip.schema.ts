import { Schema, model, models } from 'mongoose'

import { SectionSchema } from './Section.schema'

import { Trip } from '@/types/types'

const TripSchema = new Schema<Trip>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  dateTimeStart: { type: Date, required: false },
  dateTimeEnd: { type: Date, required: false },
  description: { type: String, required: false },
  cover: { type: String, required: false },
  user: { type: String, required: true, default: null },
  sections: [SectionSchema],
})

const TripModel = models.TripModel || model('TripModel', TripSchema, 'trips')

export default TripModel
