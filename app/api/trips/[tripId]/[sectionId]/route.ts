import TripSchema from '@/lib/db/schemas/Trip.schema'
import connectMongo from '@/lib/db/connectMongo'

// Update One Section
export async function PUT(
  request: Request,
  { params }: { params: { tripId: string; sectionId: string } }
) {
  const payload = await request.json()
  const { tripId, sectionId } = params
  await connectMongo()

  // Update Section with data
  try {
    // update only Note id of the whole section
    const update =
      typeof payload['noteId'] === 'string'
        ? { $set: { 'sections.$.note': payload.noteId } }
        : { $set: { 'sections.$': payload } }

    const response = await TripSchema.updateOne(
      {
        _id: tripId,
        'sections._id': sectionId,
      },
      update
    ).lean()

    if (response.modifiedCount === 0) {
      return new Response(`Update trip error: no matched section`, {
        status: 404,
      })
    }

    return Response.json(response)
  } catch (e) {
    return new Response(`Update trip error`, {
      // TODO add 500 and 404 separation
      status: 500,
    })
  }
}
