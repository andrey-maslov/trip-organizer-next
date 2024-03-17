import TripSchema from '@/lib/db/schemas/Trip.scheme'
import connectMongo from '@/lib/db/connectMongo'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  await connectMongo()

  // Get one trip
  try {
    const trip = await TripSchema.findById(id).lean()
    return Response.json({ ...trip })
  } catch (e) {
    return new Response(`Get all error`, {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}

export async function PUT(request: Request) {
  const payload = await request.json()
  await connectMongo()

  // Update one trip
  try {
    const trip = await TripSchema.findByIdAndUpdate(payload._id, payload, {
      new: true,
    }).lean()
    return Response.json({ ...trip })
  } catch (e) {
    return new Response(`Update trip error`, {
      // TODO add 500 and 404 separation
      status: 404,
    })
  }
}
