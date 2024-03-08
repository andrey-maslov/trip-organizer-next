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
      status: 500,
    })
  }
}

// Create new trip
export async function POST(request: Request) {
  await connectMongo()

  try {
    const data = await request.json()
    const newTrip = TripSchema.create(data)
    return Response.json({ trip: newTrip })
  } catch (error: any) {
    return new Response(`error!!!: ${error?.message}`, {
      status: 500,
    })
  }
}
