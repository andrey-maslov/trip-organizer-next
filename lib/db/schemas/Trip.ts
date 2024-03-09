import { Schema, model, models } from 'mongoose'
import { SectionSchema } from './Section'

const TripSchema = new Schema({
  name: { type: String, required: true },
  dateTimeStart: String,
  dateTimeEnd: String,
  description: String,
  cover: String,
  sections: [SectionSchema],
})

const TripModel = models.TripModel || model('TripModel', TripSchema, 'trips')

export default TripModel
