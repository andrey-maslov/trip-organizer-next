import { Schema, model, models } from 'mongoose'

import { DEFAULT_SECTION_STATUS } from '@/constants/constants'
import { Payment, Section } from '@/types/types'

export const PaymentSchema = new Schema<Payment>({
  name: { type: String, required: false },
  link: { type: String, required: false },
  amount: { type: Number, required: false },
  currency: { type: String, required: false },
})

export const SectionSchema = new Schema<Section>({
  name: { type: String, required: true },
  type: { type: String, required: false },
  dateTimeStart: { type: Date, required: false },
  dateTimeEnd: { type: Date, required: false },
  transportType: { type: String, required: false },
  placementType: { type: String, required: false },
  serviceProvider: {
    type: { type: String, required: false },
    name: { type: String, required: false },
    url: { type: String, required: false },
  },
  status: { type: String, required: true, default: DEFAULT_SECTION_STATUS },
  payments: [PaymentSchema],
  note: { type: Schema.Types.ObjectId, ref: 'Note', required: false },
  startingPoint: { type: Object, required: true, default: {} },
  endPoint: { type: Object, required: true, default: {} },
})

const SectionModel = models.SectionModel || model('SectionModel', SectionSchema)

export default SectionModel
