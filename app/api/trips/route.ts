import connectMongo from '@/lib/db/connectMongo'
import TripSchema from '@/lib/db/schemas/Trip'

export async function GET() {
  await connectMongo()

  // Get many teams
  try {
    const trips = await TripSchema.find().lean()
    return Response.json({ trips })
  } catch (e) {
    return new Response(`Get all error`, {
      status: 400,
    })
  }
}
