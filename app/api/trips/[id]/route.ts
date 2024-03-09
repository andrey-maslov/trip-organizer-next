import TripSchema from '@/lib/db/schemas/Trip'
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
      status: 404,
    })
  }
}
