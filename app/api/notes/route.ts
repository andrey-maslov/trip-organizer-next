import ky from 'ky-universal'

import connectMongo from '@/lib/db/connectMongo'
import NoteSchema from '@/lib/db/schemas/Note.schema'
import { Note } from '@/types/models'

// Create new Note
export async function POST(request: Request) {
  await connectMongo()

  try {
    const { tripId, sectionId, ...note } = await request.json()
    const newNote: Note = await NoteSchema.create({ ...note, sectionId })

    await ky
      .put(`http://localhost:3000/api/trips/${tripId}/${sectionId}`, {
        json: { noteId: newNote._id },
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
    const { tripId, sectionId, noteId } = await request.json()
    // await NoteSchema.deleteOne({ _id: noteId })

    await ky
      .put(`http://localhost:3000/api/trips/${tripId}/${sectionId}`, {
        json: { noteId: null },
      })
      .json()

    return new Response('Note deleted', {
      status: 200,
    })
  } catch (e) {
    return new Response('Delete note error', {
      status: 500,
    })
  }
}
