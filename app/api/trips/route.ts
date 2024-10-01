import connectMongo from '@/lib/db/connectMongo'
import TripSchema from '@/lib/db/schemas/Trip.schema'
import { Trip } from '@/types/types'

export async function GET() {
  // const { userId, getToken } = auth()
  // const user = await currentUser()

  // console.log(user)
  // console.log(user?.emailAddresses[0].emailAddress)

  // if (!userId) {
  //   return new Response('Unauthorized', { status: 401 })
  // }

  // Get many trips
  try {
    const trips = await TripSchema.find({}).lean()

    return Response.json({ trips })
  } catch (e) {
    return new Response('Get all error', {
      status: 500,
    })
  }
}

// Create new trip
export async function POST(request: Request) {
  await connectMongo()

  try {
    const data = await request.json()
    const newTrip: Trip = await TripSchema.create(data)

    return Response.json({ id: newTrip._id, slug: newTrip.slug })
  } catch (error: any) {
    return new Response(`error!!!: ${error?.message}`, {
      status: 500,
    })
  }
}

export async function DELETE(request: Request) {
  await connectMongo()

  try {
    const payload = await request.json()

    await TripSchema.deleteOne({ _id: payload.id })

    return new Response('deleted', {
      status: 200,
    })
  } catch (e) {
    return new Response('Get all error', {
      status: 500,
    })
  }
}
