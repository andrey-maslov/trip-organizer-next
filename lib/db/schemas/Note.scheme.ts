import { Schema, model, models } from 'mongoose'
import { Note } from '@/types/models'

export const NoteSchema = new Schema<Note>({
  sectionId: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  content: { type: JSON, required: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: false, default: Date.now },
})

const NoteModel = models.NoteModel || model('NoteModel', NoteSchema)

export default NoteModel
