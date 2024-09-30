import ky from 'ky-universal'

import connectMongo from '@/lib/db/connectMongo'
import NoteSchema from '@/lib/db/schemas/Note.schema'
import { Note } from '@/types/types'

const host = process.env.NEXT_PUBLIC_HOST

// Create new Note
export async function POST(request: Request) {
  await connectMongo()

  try {
    const { tripId, sectionId, ...note } = await request.json()

    const newNote: Note = await NoteSchema.create({
      ...note,
      section: sectionId,
      trip: tripId,
    })

    await ky
      .put(`${host}/api/trips/${tripId}/${sectionId}`, {
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

// TODO ???
export async function DELETE(request: Request) {
  await connectMongo()

  try {
    const { tripId, sectionId, noteId } = await request.json()

    await NoteSchema.deleteOne({ _id: noteId })

    await ky
      .put(`${host}/api/trips/${tripId}/${sectionId}`, {
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
