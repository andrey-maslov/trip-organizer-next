import { isValidObjectId, Types } from 'mongoose'

import TripSchema from '@/lib/db/schemas/Trip.schema'
import connectMongo from '@/lib/db/connectMongo'

// Update One Section
export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      trip: string // slug
      sectionId: string
    }>
  }
) {
  const payload = await request.json()
  const { trip, sectionId } = await params

  await connectMongo()

  // Update Section with data
  try {
    // update only Note id of the whole section
    let update = {}

    if (typeof payload['noteId'] === 'string' || payload['noteId'] === null) {
      update = { $set: { 'sections.$.note': payload.noteId } }
    } else if (payload._id) {
      update = { $set: { 'sections.$': payload } }
    }

    const find = isValidObjectId(trip)
      ? { _id: new Types.ObjectId(trip) }
      : { slug: trip }

    const response = await TripSchema.updateOne(
      {
        ...find,
        'sections._id': sectionId,
      },
      update
    ).lean()

    if (response.matchedCount === 0) {
      return new Response('Update trip error: no matched section !!', {
        status: 404,
      })
    }

    return Response.json(response)
  } catch (e) {
    return new Response('Update trip error', {
      // TODO add 500 and 404 separation
      status: 500,
    })
  }
}
