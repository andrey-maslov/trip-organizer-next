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

  try {
    const update: Record<string, any> = {}

    // To update the only necessary fields - from payload, excluding _id
    for (const [key, value] of Object.entries(payload)) {
      if (key === '_id') continue

      update[`sections.$.${key}`] = value
    }

    const findQuery = isValidObjectId(trip)
      ? { _id: new Types.ObjectId(trip) }
      : { slug: trip }

    const response = await TripSchema.updateOne(
      {
        ...findQuery,
        'sections._id': sectionId,
      },
      { $set: update }
    ).lean()

    if (response.matchedCount === 0) {
      return new Response('Trip or section was not found', {
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

// Update One Section
export async function DELETE(
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
  const { trip, sectionId } = await params

  await connectMongo()

  // Update Trip by deleting one section from array
  try {
    const query = isValidObjectId(trip)
      ? { _id: new Types.ObjectId(trip) }
      : { slug: trip }

    const result = await TripSchema.updateOne(query, {
      $pull: { sections: { _id: sectionId } },
    })

    if (result.modifiedCount === 0) {
      return new Response('Trip or section was not found', {
        status: 404,
      })
    }

    return Response.json(result)
  } catch (e) {
    return new Response('Delete section failure', {
      status: 500,
    })
  }
}
