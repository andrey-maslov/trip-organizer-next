import { Schema, model, models } from 'mongoose'
import { SectionSchema } from './Section.scheme'
import { Trip } from '@/types/models'

const TripSchema = new Schema<Trip>({
  name: { type: String, required: true },
  dateTimeStart: { type: Date, required: false },
  dateTimeEnd: { type: Date, required: false },
  description: { type: String, required: false },
  cover: { type: String, required: false },
  sections: [SectionSchema],
})

const TripModel = models.TripModel || model('TripModel', TripSchema, 'trips')

export default TripModel
