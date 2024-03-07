import { Schema, model, models } from 'mongoose'

export const SectionSchema = new Schema({
  name: String,
  type: String,
  waypoints: [
    {
      name: String,
      coords: String,
      country: String,
      description: String,
    },
  ],
  dateTimeStart: String,
  dateTimeEnd: String,
  transportType: String,
  placementType: String,
  serviceProvider: {
    name: String,
    link: String,
  },
  status: String,
  payments: [
    {
      name: String,
      link: String,
      price: {
        amount: Number,
        currency: String,
      },
    },
  ],
  notes: String,
})

const SectionModel = models.SectionModel || model('SectionModel', SectionSchema)

export default SectionModel
