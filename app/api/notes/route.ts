import { isValidObjectId, Types } from 'mongoose'

import connectMongo from '@/lib/db/connectMongo'
import NoteSchema from '@/lib/db/schemas/Note.schema'
import { Note } from '@/types/types'
import TripSchema from '@/lib/db/schemas/Trip.schema'

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

    // Add note ID to section
    const findTripQuery = isValidObjectId(tripId)
      ? { _id: new Types.ObjectId(tripId) }
      : { slug: tripId }

    await TripSchema.updateOne(
      {
        ...findTripQuery,
        'sections._id': sectionId,
      },
      { $set: { 'sections.$.note': newNote._id } }
    ).lean()

    // TODO add response when failed

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

    // Add note ID to section
    const findTripQuery = isValidObjectId(tripId)
      ? { _id: new Types.ObjectId(tripId) }
      : { slug: tripId }

    await TripSchema.updateOne(
      {
        ...findTripQuery,
        'sections._id': sectionId,
      },
      { $set: { 'sections.$.note': null } }
    ).lean()

    // TODO add response when failed

    return new Response('Note deleted', {
      status: 200,
    })
  } catch (e) {
    return new Response('Delete note error', {
      status: 500,
    })
  }
}
