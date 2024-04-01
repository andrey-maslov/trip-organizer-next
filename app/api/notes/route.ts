import connectMongo from '@/lib/db/connectMongo'
import NoteSchema from '@/lib/db/schemas/Note.schema'
import { Note } from '@/types/models'
import ky from 'ky-universal'

// Create new Note
export async function POST(request: Request) {
  await connectMongo()

  try {
    const { tripId, sectionId, ...note } = await request.json()
    const newNote: Note = await NoteSchema.create({ ...note, sectionId })

    await ky
      .put(`http://localhost:3000/api/trips/${tripId}/${sectionId}`, {
        json: { createdNoteID: newNote._id },
      })
      .json()

    return Response.json(newNote)
  } catch (error: any) {
    return new Response(`error!!!: ${error?.message}`, {
      status: 500,
    })
  }
}

export async function DELETE(request: Request) {
  await connectMongo()

  try {
    const payload = await request.json()
    await NoteSchema.deleteOne({ _id: payload.id })
    return new Response(`deleted`, {
      status: 200,
    })
  } catch (e) {
    return new Response(`Get all error`, {
      status: 500,
    })
  }
}
